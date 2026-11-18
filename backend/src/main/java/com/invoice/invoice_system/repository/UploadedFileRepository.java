package com.invoice.invoice_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.invoice_system.entity.UploadedFile;

public interface UploadedFileRepository
        extends JpaRepository<UploadedFile, Long> {

}