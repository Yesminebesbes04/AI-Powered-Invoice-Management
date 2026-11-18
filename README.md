# AI-Powered Invoice Management System

## Project Status

🚀 Active Development

---

## Overview

AI-Powered Invoice Management System is a full-stack web application designed to automate invoice digitization and intelligent data extraction using Google's Gemini AI.

The platform enables users to upload invoice documents in PDF or image format, automatically extract structured information using AI-powered OCR, review and validate extracted data, and securely store invoice records in a PostgreSQL database for efficient management and analysis.

The project aims to reduce manual data entry, improve processing accuracy, and streamline invoice management workflows for businesses and organizations.

---

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Spring Boot
- Spring Security
- JWT Authentication
- RESTful APIs

### Database

- PostgreSQL

### Artificial Intelligence

- Google Gemini API
- OCR-Based Invoice Data Extraction

### Testing & Development Tools

- Postman
- Maven
- Git
- GitHub

---

## Key Features

### Authentication & Security

- User Registration
- User Login
- JWT-Based Authentication
- Role-Based Access Control
- Secure API Endpoints

### Invoice Management

- Upload Invoice Documents (PDF/Image)
- Store Invoice Records
- Manage Processed Invoices
- View Invoice History

### AI-Powered Data Extraction

- Automatic OCR Processing
- Gemini AI Integration
- Structured Data Extraction
- Intelligent Field Recognition

### Dashboard & Monitoring

- Invoice Tracking Dashboard
- Extracted Data Visualization
- Processing Status Monitoring

---

## Extracted Information

The system automatically extracts the following information from invoices:

- Invoice Number
- Invoice Date
- Due Date
- Supplier Name
- Supplier Address
- Customer Information
- Tax Identification Number
- Invoice Line Items
- VAT Information
- Subtotal Amount
- Total Amount

---

## System Architecture

```text
Frontend (React)
        │
        ▼
REST API
        │
        ▼
Backend (Spring Boot)
        │
 ┌──────┼──────────┐
 ▼      ▼          ▼
JWT   Gemini API  PostgreSQL
Auth     OCR       Database
```

---

## Project Structure

```text
AI-Powered-Invoice-Management
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── React Application
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Spring Boot Application
│
├── screenshots/
│   ├── login-page.png
│   ├── register-page.png
│   ├── invoice-upload-page.png
│   ├── extraction-result.png
│   └── dashboard.png
│
├── uploads/
│   └── Sample Invoices
│
└── README.md
```

---

## Screenshots

The application includes:

- User Authentication Interface
- Registration System
- Invoice Upload Module
- AI Extraction Results
- Analytics Dashboard

Screenshots can be found in the `screenshots` directory.

---

## Future Enhancements

- Batch Invoice Processing
- CSV & Excel Export
- Advanced Search & Filtering
- Extraction Accuracy Analytics
- ERP System Integration
- Multi-User Collaboration
- Cloud Storage Integration
- Real-Time Notifications

---

## Learning Outcomes

Through this project, the following concepts were implemented and explored:

- Full-Stack Web Development
- REST API Design
- Authentication & Authorization
- Database Design and Management
- OCR Technologies
- AI Integration using Gemini API
- Secure Backend Development
- PostgreSQL Data Persistence
- Client-Server Architecture

---

## Author

**Yesmine Besbes**

Computer Science Student

---

## License

This project is developed for educational and learning purposes.
