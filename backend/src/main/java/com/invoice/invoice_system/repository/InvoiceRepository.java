package com.invoice.invoice_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.invoice_system.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findBySupplierNameContainingIgnoreCase(String supplierName);

}