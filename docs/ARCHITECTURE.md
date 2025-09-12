# System Architecture

## Overview

The Business Licensing Assessor is a full-stack web application designed to help Israeli business owners understand their licensing requirements. The system follows a clean, modular architecture with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │◄──►│   Backend       │◄──►│   OpenAI API    │
│   (React)       │    │   (Express)     │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │                 │
                       │  Data Layer     │
                       │  (JSON files)   │
                       │                 │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │                 │
                       │ Source Docs     │
                       │ (DOCX/PDF)      │
                       │                 │
                       └─────────────────┘
```

## Component Breakdown

### Frontend Layer (React + TypeScript)

**Location**: `/frontend/src/`

**Responsibilities**:
- User interface for questionnaire form
- Report display with markdown rendering
- PDF export functionality
- API communication

**Key Components**:
- `App.tsx` - Main application component and state management
- `QuestionnaireForm.tsx` - Business input form
- `ReportDisplay.tsx` - Report rendering and PDF export
- `api.ts` - API client functions
- `types.ts` - TypeScript interfaces

**Technologies**:
- React 18 with TypeScript
- React Markdown for report rendering
- jsPDF + html2canvas for PDF generation
- Axios for HTTP requests

### Backend Layer (Express + TypeScript)

**Location**: `/backend/src/`

**Responsibilities**:
- REST API endpoints
- Business logic and requirement matching
- AI integration with OpenAI
- Data validation and error handling

**Key Components**:
- `server.ts` - Express server setup and routes
- `matcher.ts` - Requirement matching algorithm
- `openai.ts` - AI report generation
- `types.ts` - Shared TypeScript interfaces

**API Endpoints**:
- `GET /api/health` - Health check
- `POST /api/match` - Match requirements to business criteria
- `POST /api/report` - Generate AI-powered report

**Technologies**:
- Express.js with TypeScript
- OpenAI API client
- CORS for cross-origin requests
- dotenv for environment variables

### Data Layer

**Location**: `/backend/data/` and `/source_docs/`

**Components**:
- `requirements.json` - Processed licensing requirements
- Source documents (DOCX/PDF) - Original regulatory documents

**Data Flow**:
1. Source documents (Word/PDF) contain original licensing information
2. ETL script processes documents and extracts structured data
3. Generated `requirements.json` serves as the application database
4. Backend loads requirements at startup for fast access

### ETL (Extract, Transform, Load) Layer

**Location**: `/backend/scripts/`

**Responsibilities**:
- Parse source documents (DOCX using mammoth, PDF using pdf-parse)
- Extract licensing requirements using pattern matching
- Transform to structured JSON format
- Generate `requirements.json` with source references

**Key Components**:
- `etl-from-source-docs.ts` - Main ETL script
- Document parsers for different file formats
- Pattern extraction algorithms
- Data validation and cleaning

## Data Flow

### User Request Flow

```
1. User fills questionnaire (Frontend)
   ↓
2. Form submission → POST /api/report (Frontend → Backend)
   ↓
3. Input validation (Backend)
   ↓
4. Requirement matching (Backend)
   ↓
5. AI report generation (Backend → OpenAI)
   ↓
6. Response with report + matched requirements (Backend → Frontend)
   ↓
7. Report rendering + source references (Frontend)
   ↓
8. Optional PDF export (Frontend)
```

### Data Processing Flow

```
1. Source documents (DOCX/PDF)
   ↓
2. ETL script parsing
   ↓
3. Pattern extraction and validation
   ↓
4. Generate requirements.json
   ↓
5. Backend loads at startup
   ↓
6. Available for matching algorithm
```

## Security Considerations

### Environment Variables
- OpenAI API key stored in `.env` (not committed)
- Model configuration externalized
- Port configuration flexible

### Input Validation
- All API inputs validated for type and range
- Business logic prevents invalid combinations
- Error handling with appropriate HTTP status codes

### CORS Configuration
- Cross-origin requests enabled for frontend communication
- Could be restricted to specific domains in production

## Scalability Considerations

### Current Limitations
- In-memory data storage (requirements loaded at startup)
- Single-server deployment
- No caching layer for OpenAI responses

### Scaling Strategies

**Horizontal Scaling**:
- Load balancer for multiple backend instances
- Shared data store (Redis/MongoDB)
- API gateway for rate limiting

**Caching**:
- Redis for requirement data
- OpenAI response caching for common scenarios
- CDN for frontend assets

**Database Migration**:
- PostgreSQL for structured data
- Document store for requirements
- Audit logging for compliance

## Development Workflow

### Local Development
1. Backend: `npm run dev` (nodemon for hot reload)
2. Frontend: `npm start` (React dev server)
3. ETL: `npm run etl` (regenerate requirements)

### Build Process
1. Backend: TypeScript compilation to `/dist/`
2. Frontend: React build to `/build/`
3. Dependencies: npm install in both directories

### Deployment Preparation
- Environment variable configuration
- Production build generation
- Process manager setup (PM2)
- Reverse proxy configuration (nginx)

## Technology Choices

### Why React?
- Component-based architecture for maintainable UI
- Strong TypeScript support
- Rich ecosystem for PDF generation and markdown rendering
- Fast development with Create React App

### Why Express.js?
- Minimal, flexible web framework
- Excellent TypeScript integration
- Large ecosystem of middleware
- Simple REST API development

### Why OpenAI API?
- Advanced natural language processing
- Hebrew language support
- Consistent, high-quality report generation
- Flexible prompt engineering

### Why JSON Storage?
- Simple deployment (no database setup)
- Fast read access (loaded in memory)
- Version control friendly
- Easy backup and migration

## Monitoring and Logging

### Current Implementation
- Console logging for debugging
- Error handling with appropriate messages
- OpenAI API error propagation

### Production Recommendations
- Structured logging (Winston/Bunyan)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Health check endpoints
- Metrics collection

## Future Architecture Enhancements

### Microservices Migration
- Document processing service
- Matching algorithm service
- Report generation service
- User management service

### Event-Driven Architecture
- Document update events
- Requirement change notifications
- Audit trail events
- Real-time updates

### API Gateway
- Rate limiting per user/IP
- Authentication and authorization
- Request/response transformation
- API versioning

---

*This document provides a high-level view of the system architecture. For specific implementation details, see the individual component documentation.*
