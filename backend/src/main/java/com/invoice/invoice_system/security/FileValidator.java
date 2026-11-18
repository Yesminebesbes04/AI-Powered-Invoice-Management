// src/main/java/com/invoice/invoice_system/security/FileValidator.java
package com.invoice.invoice_system.security;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileValidator {

    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "application/pdf",
            "image/jpeg",
            "image/png"
    );

    public void validateFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is missing or empty.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported file type: " + contentType);
        }

        // Magic Byte Signature Inspection
        try (InputStream is = file.getInputStream()) {
            byte[] headerBytes = new byte[8];
            int bytesRead = is.read(headerBytes, 0, headerBytes.length);
            if (bytesRead < 4) {
                throw new IllegalArgumentException("Corrupted or invalid file header.");
            }

            if (!isPdf(headerBytes) && !isJpeg(headerBytes) && !isPng(headerBytes)) {
                throw new IllegalArgumentException("File content signature does not match allowed PDF or Image formats.");
            }
        }
    }

    private boolean isPdf(byte[] bytes) {
        // PDF Magic Bytes: %PDF (0x25 0x50 0x44 0x46)
        return bytes[0] == 0x25 && bytes[1] == 0x50 && bytes[2] == 0x44 && bytes[3] == 0x46;
    }

    private boolean isJpeg(byte[] bytes) {
        // JPEG Magic Bytes: 0xFF 0xD8 0xFF
        return (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF;
    }

    private boolean isPng(byte[] bytes) {
        // PNG Magic Bytes: 0x89 PNG (0x89 0x50 0x4E 0x47)
        return (bytes[0] & 0xFF) == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47;
    }
}