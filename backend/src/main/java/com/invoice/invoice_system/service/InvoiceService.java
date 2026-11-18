package com.invoice.invoice_system.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.invoice.invoice_system.entity.Invoice;
import com.invoice.invoice_system.repository.InvoiceRepository;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id).orElse(null);
    }

    public Invoice updateInvoice(Long id, Invoice updatedInvoice) {

        Invoice invoice =
                invoiceRepository.findById(id)
                        .orElse(null);

        if (invoice != null) {

            invoice.setInvoiceNumber(
                    updatedInvoice.getInvoiceNumber());

            invoice.setSupplierName(
                    updatedInvoice.getSupplierName());

            invoice.setTotalAmount(
                    updatedInvoice.getTotalAmount());

            invoice.setStatus(
                    updatedInvoice.getStatus());

            return invoiceRepository.save(invoice);
        }

        return null;
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    public List<Invoice> searchBySupplier(String supplier) {

        return invoiceRepository
                .findBySupplierNameContainingIgnoreCase(
                        supplier);
    }
}