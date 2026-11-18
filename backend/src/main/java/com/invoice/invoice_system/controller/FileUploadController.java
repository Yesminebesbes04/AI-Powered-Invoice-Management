// src/main/java/com/invoice/invoice_system/controller/FileUploadController.java
package com.invoice.invoice_system.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.invoice.invoice_system.dto.InvoiceResponseDto;
import com.invoice.invoice_system.service.InvoiceProcessingService;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private final InvoiceProcessingService invoiceProcessingService;

    public FileUploadController(
            InvoiceProcessingService invoiceProcessingService) {
        this.invoiceProcessingService = invoiceProcessingService;
    }

    @PostMapping(
            value = "/process",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> processFile(
            @RequestParam("file") MultipartFile file) {

        try {

            InvoiceResponseDto result =
                    invoiceProcessingService
                            .processUploadedInvoice(file);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .status(503)
                    .body(e.getMessage());
        }
    }
}