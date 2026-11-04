# AfriLens Report AI
### AI-Powered Vulnerability Reporting with African Context Intelligence

---

## Overview

AfriLens Report AI is an intelligent cybersecurity reporting platform that transforms vulnerability assessment results into professional, actionable, and easy-to-understand security reports.

The platform analyzes vulnerability scan results from tools such as Nessus, automatically categorizes findings, calculates risk levels, generates executive summaries, provides remediation recommendations, and produces professional PDF/DOCX reports.

What makes AfriLens Report AI unique is its African Context Intelligence feature, which translates technical cybersecurity findings into relatable real-life African scenarios, helping students, managers, small businesses, and non-technical users understand cyber risks without requiring advanced cybersecurity knowledge.

---

## Problem Statement

Vulnerability scanners generate large amounts of technical data that can be difficult for students, organizations, and non-technical stakeholders to interpret.

Security analysts often spend hours:

- Reviewing scan results
- Prioritizing vulnerabilities
- Writing executive summaries
- Creating recommendations
- Preparing professional reports

Many decision-makers struggle to understand technical cybersecurity terminology, making risk communication difficult.

---

## Proposed Solution

AfriLens Report AI automates the vulnerability reporting process by:

- Accepting uploaded vulnerability scan files
- Analyzing security findings
- Categorizing vulnerabilities by severity
- Calculating risk scores
- Generating executive summaries
- Providing remediation recommendations
- Translating technical risks into relatable African analogies
- Exporting professional reports

---

## Project Objectives

The project aims to:

- Simplify cybersecurity reporting
- Improve vulnerability prioritization
- Reduce report generation time
- Enhance cybersecurity awareness
- Bridge the gap between technical and non-technical audiences
- Provide real-world security insights through localized explanations

---

# Key Features

## Vulnerability Scan Upload

Supports:

- `.nessus`
- `.csv`
- `.xlsx`

Users can upload their own reports for analysis.

---

## Vulnerability Dashboard

Displays:

- Critical Findings
- High Findings
- Medium Findings
- Low Findings
- Informational Findings

Additional metrics include:

- Overall Risk Score
- Top Vulnerabilities
- Findings by Category
- Recent Assessments

---

## Risk Scoring Engine

The system automatically calculates risk levels using vulnerability severity.

Example:

```text
Critical = 10 Points
High = 7 Points
Medium = 5 Points
Low = 2 Points
```

Risk levels:

- Low
- Medium
- High
- Critical

---

## Executive Summary Generator

Automatically generates management-ready summaries.

Example:

> The assessment identified 36 vulnerabilities, including three Critical findings requiring immediate remediation. The environment has been classified as High Risk.

---

## Detailed Findings Analysis

Each finding includes:

- Vulnerability Name
- Severity
- CVSS Score
- Description
- Business Impact
- Technical Impact
- Recommendations

---

## African Context Intelligence

A unique feature that translates cybersecurity findings into relatable African real-world scenarios.

### Example

**Finding:** Weak Password Policy

**Technical Explanation**

Passwords are weak and can be easily guessed.

**Business Impact**

Unauthorized users may gain access to sensitive systems.

**African Context Example**

> This is like using the same padlock key for your home, shop, and warehouse. If someone copies the key, they gain access to everything.

**Recommendation**

Implement strong passwords and multi-factor authentication.

---

## Automated Report Generation

Generate:

- Executive Summary
- Findings Summary
- Risk Analysis
- Recommendations
- Conclusion
- Appendices

Export formats:

- PDF
- DOCX

---

# System Workflow

```text
Upload Scan File
        ↓
Extract Vulnerability Data
        ↓
Analyze Findings
        ↓
Calculate Risk Score
        ↓
Generate Recommendations
        ↓
Generate African Context Explanations
        ↓
Create Professional Report
        ↓
Export PDF/DOCX
```

---

# Technology Stack

## Frontend

- HTML5
- CSS3
- Bootstrap
- JavaScript
- React

## Backend

- Python
- Flask

## Database

- PostgreSQL

## Libraries

- Pandas
- SQLAlchemy
- Jinja2
- Plotly
- OpenPyXL
- python-docx
- ReportLab

---

# Team Roles

## Frontend Developer

### Responsibilities

- User Interface Design
- Dashboard Development
- Upload Page
- Report Visualization
- Responsive Design

---

## Backend & Database Developer

### Responsibilities

- System Logic
- API Development
- File Processing
- Database Management
- Authentication
- Report Generation

---

## Cybersecurity Analyst & Testing Lead

### Responsibilities

- Severity Classification
- Risk Analysis
- Remediation Recommendations
- Nessus Integration
- Security Testing
- Validation of Findings

### Tools

- Nessus
- Burp Suite
- Wireshark
- Nmap

---

## Documentation & Project Manager

### Responsibilities

- Project Documentation
- Technical Report
- README
- Presentation
- GitHub Management
- Medium/LinkedIn Publication

---

# Testing Strategy

## Functional Testing

- File Upload Validation
- Report Generation
- Data Processing
- Export Features

## Security Testing

### Nessus

- Vulnerability Assessment

### Burp Suite

- Input Validation Testing
- Authentication Testing

### Nmap

- Port and Service Enumeration

### Wireshark

- Network Traffic Monitoring

---

# Project Structure

```text
AfriLens-Report-AI
│
├── app.py
│
├── templates
│   ├── index.html
│   ├── dashboard.html
│   ├── findings.html
│   └── reports.html
│
├── static
│   ├── css
│   ├── js
│   └── images
│
├── uploads
│
├── reports
│
├── database
│
├── screenshots
│
├── README.md
│
└── requirements.txt
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AfriLens-Report-AI.git
```

## Navigate to Project Folder

```bash
cd AfriLens-Report-AI
```

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Application

```bash
python app.py
```

---

# Screenshots

### Home Page

_Add screenshot here_

### Dashboard

_Add screenshot here_

### Scan Upload

_Add screenshot here_

### Generated Report

_Add screenshot here_

### African Context Report Mode

_Add screenshot here_

---

# Learning Outcomes

Through this project, team members gained practical experience in:

- Vulnerability Management
- Cybersecurity Reporting
- Risk Assessment
- Flask Development
- Database Management
- Security Testing
- Team Collaboration
- Real-World Problem Solving

---

# Future Improvements

- AI Risk Prediction
- CVE Intelligence Integration
- Threat Intelligence Feeds
- Compliance Mapping
  - ISO 27001
  - CIS Controls
  - NIST Cybersecurity Framework
- Multi-Tenant Support
- Cloud Deployment
- Multi-Language Reporting

---

# Contributors

- Belinda Tom
- Project Team Members

---

# License

This project is developed for educational, research, and cybersecurity awareness purposes.

Licensed under the MIT License.

---

## Vision

AfriLens Report AI empowers cybersecurity professionals, students, and organizations by transforming complex vulnerability findings into understandable, actionable, and culturally relevant security insights. By combining AI-powered reporting with African Context Intelligence, the platform makes cybersecurity accessible to everyone.
