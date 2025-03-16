# Ticketing System

A comprehensive ticketing platform built with React and Django, featuring a multi-tiered agent system for lottery ticket sales and management.

## 🚀 Overview

This application provides a complete solution for managing lottery ticket sales through a hierarchical agent system. The platform supports Admin, Merchant (Top-Level Agent), and Agent (Normal-Level) roles with distinct capabilities and responsibilities.

## ✨ Key Features

### Multi-Tier Agent System
- **Three-level hierarchy**: Admin → Merchant (Top-Level Agent) → Agent (Normal-Level)
- **Merchants** purchase vouchers from Admin with a 20% discount
- **Agents** purchase vouchers from Merchants with a 10% discount
- **Role Management**: Admins can promote regular agents to merchant status

### User Authentication & Management
- Automatic generation of Agent IDs (e.g., PPT123) upon registration
- Comprehensive registration process with required fields: name, phone number, address, email, username
- Secure login system using generated Agent IDs

### Wallet & Financial Management
- Manual input-based wallet system
- Merchants can distribute funds to agents using names or generated IDs
- Clear separation of vouchers and bonuses
- Commission system for agents (10% on purchases from merchants)

### Ticket Sales Process
- Agents sell lottery tickets to customers based on available voucher units
- All transactions logged on the central server
- Automatic generation of verification codes upon purchase
- Customer information collection: name, phone number, email
- Fraud prevention through code verification system

### Game Management
- Admins can create new ticket games with custom images
- Support for multiple game types

### Reporting & Monitoring
- Daily ticket sales logs downloadable from the backend
- Agent dashboard for monitoring daily sales
- Automated restriction on ticket sales based on available funds

### Payout System
- Manual payout solution for agents
- Commission withdrawal system (e.g., 500 commission on 5,000 purchase)
- Payout request tab for admins
- Payment description ID generation for tracking

## 📋 Technical Stack

### Frontend
- React.js

### Backend
- Django 4.2.16
- Django REST Framework 3.15.2
- JWT Authentication (djangorestframework-simplejwt 5.3.1)
- MySQL Database (mysqlclient 2.2.4)
- API Documentation with drf-yasg 1.21.7

## 🛠️ Installation & Setup

### Prerequisites
- Python (v3.8 or higher)
- MySQL Database

## 📝 Usage Guidelines

### Admin Workflow
1. Create and manage games
2. Sell vouchers to merchants (top-level agents)
3. Promote regular agents to merchant status
4. Monitor all ticket sales and transactions
5. Process payout requests

### Merchant (Top-Level Agent) Workflow
1. Purchase vouchers from admin (with 20% discount)
2. Distribute vouchers to agents
3. Monitor agent activities and sales

### Agent Workflow
1. Purchase vouchers from merchants (with 10% discount)
2. Sell tickets to customers
3. Monitor daily sales
4. Request payouts when needed

## 🔐 Security Considerations

- All API endpoints are protected with JWT authentication
- Role-based access control implemented for all sensitive operations
- All financial transactions are logged for auditing purposes
- Customer data is encrypted at rest and in transit

## 🚀 Deployment

### Backend Deployment
The backend uses Gunicorn (23.0.0) as the WSGI HTTP server for production deployment.

### Environment Variables
Create a `.env` file with the following variables:
```
DEBUG=False
SECRET_KEY=your_secret_key
DATABASE_URL=mysql://user:password@localhost:3306/db_name
ALLOWED_HOSTS=example.com,www.example.com
```
