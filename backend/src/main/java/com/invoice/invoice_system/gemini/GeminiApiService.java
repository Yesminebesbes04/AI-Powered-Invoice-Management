// src/main/java/com/invoice/invoice_system/gemini/GeminiApiService.java
package com.invoice.invoice_system.gemini;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.invoice.invoice_system.dto.GeminiInvoiceDto;

@Service
public class GeminiApiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiInvoiceDto analyzeInvoiceDocument(
            Path filePath,
            String mimeType,
            String extractedText) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key="
                        + apiKey;

        try {
            ObjectNode requestJson = objectMapper.createObjectNode();

            ArrayNode contents = requestJson.putArray("contents");
            ObjectNode contentObj = contents.addObject();
            ArrayNode parts = contentObj.putArray("parts");

            // Prompt instructions
            String promptText = """
                You are an invoice extraction AI.

                Return ONLY valid JSON.

                Extract:
                {
                  "invoiceNumber": "",
                  "supplierName": "",
                  "totalAmount": 0,
                  "invoiceDate": "",
                  "currency": "",
                  "supplierEmail": ""
                }

                Rules:
                - If a value is not found return empty string.
                - totalAmount must be numeric.
                - invoiceDate format must be YYYY-MM-DD.
                - Do not return explanations.
                - Do not return markdown.
                - Return JSON only.
                """;

            parts.addObject().put("text", promptText);

            // If searchable text exists, attach text part;
            // otherwise attach Base64 multimodal media
            if (extractedText != null && extractedText.length() > 50) {

                parts.addObject().put(
                        "text",
                        "Extracted Document Text:\n" + extractedText
                );

            } else {

                byte[] fileBytes = Files.readAllBytes(filePath);

                String base64Data =
                        Base64.getEncoder().encodeToString(fileBytes);

                ObjectNode inlineData =
                        parts.addObject().putObject("inline_data");

                inlineData.put("mime_type", mimeType);
                inlineData.put("data", base64Data);
            }

            // Request structured JSON output from Gemini
            ObjectNode generationConfig =
                    requestJson.putObject("generationConfig");

            generationConfig.put(
                    "response_mime_type",
                    "application/json"
            );

            String rawResponse = restClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .body(objectMapper.writeValueAsString(requestJson))
                    .retrieve()
                    .body(String.class);

            return parseGeminiResponse(rawResponse);

        } catch (Exception e) {

            if (e.getMessage() != null &&
                e.getMessage().contains("503")) {

                throw new RuntimeException(
                    "Gemini service is temporarily busy. Please try again in a few moments.");
            }

            throw new RuntimeException(
                "Failed to analyze invoice with Gemini AI: "
                + e.getMessage(), e);
        }
    }

    private GeminiInvoiceDto parseGeminiResponse(
            String rawResponse) throws Exception {

        JsonNode root = objectMapper.readTree(rawResponse);

        JsonNode candidateText = root
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text");

        String jsonString = candidateText.asText();

        // Strip markdown code block markers if present
        jsonString = jsonString
                .replaceAll("^```json\\s*", "")
                .replaceAll("\\s*```$", "")
                .trim();

        return objectMapper.readValue(
                jsonString,
                GeminiInvoiceDto.class
        );
    }
}