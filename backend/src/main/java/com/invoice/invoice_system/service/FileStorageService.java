// src/main/java/com/invoice/invoice_system/service/FileStorageService.java
package com.invoice.invoice_system.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.invoice.invoice_system.entity.UploadedFile;
import com.invoice.invoice_system.repository.UploadedFileRepository;

@Service
public class FileStorageService {

    private final Path storageLocation;
    private final UploadedFileRepository uploadedFileRepository;

    public FileStorageService(
            @Value("${file.upload-dir:uploads}") String uploadDir,
            UploadedFileRepository uploadedFileRepository) throws IOException {
        this.uploadedFileRepository = uploadedFileRepository;
        this.storageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.storageLocation);
    }

    public UploadedFile saveFile(MultipartFile file) throws IOException {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "invoice");
        
        if (originalFilename.contains("..")) {
            throw new IllegalArgumentException("Filename contains invalid path sequence: " + originalFilename);
        }

        String fileExtension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            fileExtension = originalFilename.substring(dotIndex);
        }

        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        Path targetPath = this.storageLocation.resolve(storedFileName).normalize();

        // Enforce storage location boundary
        if (!targetPath.getParent().equals(this.storageLocation)) {
            throw new SecurityException("Cannot store file outside target directory.");
        }

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        UploadedFile uploadedFile = new UploadedFile();
        uploadedFile.setFileName(originalFilename);
        uploadedFile.setFilePath(targetPath.toString());
        return uploadedFileRepository.save(uploadedFile);
    }
}