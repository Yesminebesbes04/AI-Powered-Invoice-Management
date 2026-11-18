package com.invoice.invoice_system.ocr;

import java.io.File;

import org.springframework.stereotype.Service;

import net.sourceforge.tess4j.Tesseract;

@Service
public class ImageOcrService {

    public String extractText(String imagePath)
            throws Exception {

        Tesseract tesseract =
                new Tesseract();

        tesseract.setDatapath("tessdata");

        return tesseract.doOCR(
                new File(imagePath));
    }
}
