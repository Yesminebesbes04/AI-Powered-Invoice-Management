package com.invoice.invoice_system.service;

import java.nio.file.Path;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.invoice.invoice_system.dto.GeminiInvoiceDto;
import com.invoice.invoice_system.dto.InvoiceResponseDto;
import com.invoice.invoice_system.entity.Invoice;
import com.invoice.invoice_system.entity.UploadedFile;
import com.invoice.invoice_system.gemini.GeminiApiService;
import com.invoice.invoice_system.pdf.PdfReaderService;
import com.invoice.invoice_system.repository.InvoiceRepository;
import com.invoice.invoice_system.security.FileValidator;

@Service
public class InvoiceProcessingService {

    private final FileValidator fileValidator;
    private final FileStorageService fileStorageService;
    private final PdfReaderService pdfReaderService;
    private final GeminiApiService geminiApiService;
    private final InvoiceRepository invoiceRepository;

    public InvoiceProcessingService(
            FileValidator fileValidator,
            FileStorageService fileStorageService,
            PdfReaderService pdfReaderService,
            GeminiApiService geminiApiService,
            InvoiceRepository invoiceRepository) {
        this.fileValidator = fileValidator;
        this.fileStorageService = fileStorageService;
        this.pdfReaderService = pdfReaderService;
        this.geminiApiService = geminiApiService;
        this.invoiceRepository = invoiceRepository;
    }

    public InvoiceResponseDto processUploadedInvoice(MultipartFile file) throws Exception {

        // 1. Validate file (MIME type & Magic Bytes)
        fileValidator.validateFile(file);

        // 2. Store file safely with UUID filename
        UploadedFile storedFile = fileStorageService.saveFile(file);
        Path filePath = Path.of(storedFile.getFilePath());

        // 3. Extract text if PDF has embedded text
        String extractedText = "";

        if ("application/pdf".equalsIgnoreCase(file.getContentType())) {
            extractedText = pdfReaderService.extractTextIfSearchable(
                    storedFile.getFilePath()
            );
        }

        // 4. Send document or extracted text to Gemini AI
        GeminiInvoiceDto dto = geminiApiService.analyzeInvoiceDocument(
                filePath,
                file.getContentType(),
                extractedText
        );

        // 5. Convert Gemini DTO to Invoice Entity
        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setSupplierName(dto.getSupplierName());
        invoice.setTotalAmount(dto.getTotalAmount());
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setCurrency(dto.getCurrency());
        invoice.setSupplierEmail(dto.getSupplierEmail());
        invoice.setStatus("PROCESSED");

        // 6. Save invoice to PostgreSQL
        Invoice savedInvoice = invoiceRepository.save(invoice);

        // 7. Create response DTO
        InvoiceResponseDto response = new InvoiceResponseDto();

        response.setId(savedInvoice.getId());
        response.setInvoiceNumber(savedInvoice.getInvoiceNumber());
        response.setSupplierName(savedInvoice.getSupplierName());
        response.setTotalAmount(savedInvoice.getTotalAmount());
        response.setInvoiceDate(savedInvoice.getInvoiceDate());
        response.setCurrency(savedInvoice.getCurrency());
        response.setSupplierEmail(savedInvoice.getSupplierEmail());
        response.setStatus(savedInvoice.getStatus());

        return response;
    }
}