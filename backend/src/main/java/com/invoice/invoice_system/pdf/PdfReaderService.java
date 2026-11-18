// src/main/java/com/invoice/invoice_system/pdf/PdfReaderService.java
package com.invoice.invoice_system.pdf;

import java.io.File;
import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

@Service
public class PdfReaderService {

    public String extractTextIfSearchable(String filePath) {
        try (PDDocument document = Loader.loadPDF(new File(filePath))) {
            if (document.isEncrypted()) {
                return ""; // Fallback to Multimodal AI
            }
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            return text != null ? text.trim() : "";
        } catch (IOException e) {
            return ""; // Fallback to Multimodal AI
        }
    }
}