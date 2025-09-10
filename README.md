# Business Licensing Assessor

A comprehensive end-to-end application for assessing business licensing requirements in Israel. The system helps restaurant owners understand what permits and licenses they need based on their specific business characteristics.

## Features

- **Smart Questionnaire**: 5-field form capturing business details (area, seating, gas usage, meat service, deliveries)
- **Intelligent Matching**: Filters 20+ licensing requirements based on business criteria
- **AI-Powered Reports**: Generates comprehensive Hebrew reports using OpenAI API
- **PDF Export**: Download reports as PDF documents
- **Multilingual Support**: Hebrew interface with RTL support

## Tech Stack

### Backend
- **Node.js + Express** with TypeScript
- **OpenAI API** for report generation
- **JSON file storage** for requirements data
- **CORS** enabled for frontend communication

### Frontend
- **React** with TypeScript
- **Create React App** foundation
- **Axios** for API communication
- **React Markdown** for report rendering
- **jsPDF + html2canvas** for PDF generation

## Project Structure

```
business-licensing-assessor/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express server setup
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── matcher.ts         # Requirements matching logic
│   │   └── openai.ts          # AI report generation
│   ├── data/
│   │   └── requirements.json  # 20+ sample requirements
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuestionnaireForm.tsx
│   │   │   └── ReportDisplay.tsx
│   │   ├── App.tsx
│   │   ├── api.ts             # API client
│   │   └── types.ts
│   ├── public/
│   └── package.json
├── docs/
│   ├── API.md                 # API documentation
│   ├── DATA_SCHEMA.md         # Data structure docs
│   └── PROMPTS.md             # AI prompt documentation
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- OpenAI API key

### 1. Clone Repository
```bash
git clone <repository-url>
cd business-licensing-assessor
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create environment file:
```bash
cp env.example .env
```

Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
MODEL=gpt-4o-mini
PORT=3001
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

## Usage

1. **Fill Questionnaire**: Enter business details in the 5-field form
2. **Generate Report**: Click "קבל דוח רישוי" to get AI-generated assessment
3. **Review Requirements**: Read comprehensive licensing requirements
4. **Download PDF**: Export report for offline reference

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/match` - Match requirements to business criteria
- `POST /api/report` - Generate AI-powered licensing report

See [docs/API.md](docs/API.md) for detailed API documentation.

## Sample Requirements

The system includes 20+ licensing requirements covering:

- Basic business licenses
- Food service permits
- Gas installation approvals
- Fire safety certificates
- Accessibility compliance
- Meat handling permits
- Delivery service permits
- Optional enhancements (outdoor seating, alcohol, entertainment)

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npm start           # Run production build
```

### Frontend Development
```bash
cd frontend
npm start           # Start development server
npm run build       # Build for production
```

### Adding New Requirements

Edit `backend/data/requirements.json` to add new licensing requirements. Follow the schema in [docs/DATA_SCHEMA.md](docs/DATA_SCHEMA.md).

## AI Integration

The system uses OpenAI's API to generate comprehensive licensing reports in Hebrew. The AI assistant:

- Analyzes business characteristics
- Reviews matched requirements
- Generates structured reports with:
  - Executive summary
  - Mandatory requirements
  - Recommended requirements
  - Action checklist
  - Important notes
  - Information gaps

See [docs/PROMPTS.md](docs/PROMPTS.md) for AI prompt documentation.

## Customization

### Adding New Business Criteria
1. Update `BusinessInput` interface in `types.ts`
2. Add form fields in `QuestionnaireForm.tsx`
3. Update matching logic in `matcher.ts`

### Modifying Report Structure
1. Edit system prompt in `backend/src/openai.ts`
2. Adjust user prompt template
3. Update frontend markdown rendering if needed

## Production Deployment

### Backend
- Set environment variables
- Use process manager (PM2, systemd)
- Configure reverse proxy (nginx)
- Enable HTTPS

### Frontend
```bash
npm run build
# Serve build/ directory
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with clear commits
4. Add tests for new functionality
5. Submit pull request

## License

[Add your license here]

## Support

For issues and questions:
- Check existing issues in the repository
- Create new issue with detailed description
- Include environment details and steps to reproduce

---

**Note**: This is a demonstration project. Consult with legal professionals for actual business licensing advice.