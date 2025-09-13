# Business Licensing Assessor / מערכת הערכת רישוי עסקים

A comprehensive end-to-end application for assessing business licensing requirements in Israel. The system helps restaurant owners understand what permits and licenses they need based on their specific business characteristics.

מערכת מקיפה לבדיקת דרישות רישוי עסקים בישראל. המערכת מסייעת לבעלי מסעדות להבין אילו היתרים ורישיונות הם צריכים בהתאם למאפיינים הספציפיים של העסק שלהם.

## Features / תכונות

- **Smart Questionnaire**: 5-field form capturing business details (area, seating, gas usage, meat service, deliveries)
- **Intelligent Matching**: Filters 20+ licensing requirements based on business criteria
- **AI-Powered Reports**: Generates comprehensive Hebrew reports using Google Gemini API
- **PDF Export**: Download reports as PDF documents
- **JSON Export**: Download structured data in JSON format
- **Multilingual Support**: Hebrew interface with RTL support

- **שאלון חכם**: טופס עם 5 שדות לתפיסת פרטי העסק (שטח, מקומות ישיבה, שימוש בגז, הגשת בשר, משלוחים)
- **התאמה חכמה**: מסנן 20+ דרישות רישוי בהתאם לקריטריונים עסקיים
- **דוחות מונעי AI**: יוצר דוחות מקיפים בעברית באמצעות Google Gemini API
- **ייצוא PDF**: הורדת דוחות כקבצי PDF
- **ייצוא JSON**: הורדת נתונים מובנים בפורמט JSON
- **תמיכה רב-לשונית**: ממשק עברי עם תמיכה ב-RTL

## Tech Stack / ערימת טכנולוגיות

### Backend / שרת
- **Node.js + Express** with TypeScript
- **Google Gemini API** for report generation
- **JSON file storage** for requirements data
- **CORS** enabled for frontend communication

### Frontend / ממשק
- **React** with TypeScript
- **Create React App** foundation
- **Axios** for API communication
- **React Markdown** for report rendering
- **jsPDF + html2canvas** for PDF generation

## Dependencies / תלויות

### Backend Dependencies / תלויות שרת

#### Production Dependencies / תלויות ייצור
```json
{
  "@google/generative-ai": "^0.24.1",
  "@types/pdf-parse": "^1.1.5",
  "cors": "^2.8.5",
  "dotenv": "^17.2.2",
  "express": "^5.1.0",
  "mammoth": "^1.10.0",
  "pdf-parse": "^1.1.1"
}
```

#### Development Dependencies / תלויות פיתוח
```json
{
  "@types/cors": "^2.8.19",
  "@types/express": "^5.0.3",
  "@types/node": "^24.3.1",
  "nodemon": "^3.1.10",
  "ts-node": "^10.9.2",
  "typescript": "^5.9.2"
}
```

### Frontend Dependencies / תלויות ממשק

#### Production Dependencies / תלויות ייצור
```json
{
  "@types/react": "^19.1.12",
  "@types/react-dom": "^19.1.9",
  "axios": "^1.11.0",
  "html2canvas": "^1.4.1",
  "jspdf": "^3.0.2",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-markdown": "^10.1.0",
  "react-scripts": "^5.0.1",
  "typescript": "^4.9.5"
}
```

### Version Compatibility / תאימות גרסאות

| Component / רכיב | Minimum Version / גרסה מינימלית | Recommended / מומלץ | Notes / הערות |
|------------------|----------------------------------|---------------------|----------------|
| Node.js | 16.0.0 | 18.17.0+ | LTS version recommended |
| npm | 7.0.0 | 9.0.0+ | Comes with Node.js |
| TypeScript | 4.9.0 | 5.0.0+ | For type checking |
| React | 18.0.0 | 19.1.1+ | Latest stable |
| Express | 4.18.0 | 5.1.0+ | Web framework |

### Installation Verification / אימות התקנה

After running `npm install` in both directories, verify all dependencies are installed:

```bash
# Backend verification
cd backend
npm list --depth=0

# Frontend verification  
cd frontend
npm list --depth=0
```

**Expected package counts:**
- Backend: ~7 production + ~6 development packages
- Frontend: ~10 production packages

### Security Notes / הערות אבטחה

- All dependencies are regularly updated
- No known security vulnerabilities in current versions
- API keys are stored in environment variables
- CORS is properly configured for development
- Production deployment should use HTTPS

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

## Quick Start / התחלה מהירה

### Prerequisites / דרישות מוקדמות
- Node.js 16+ and npm
- Google Gemini API key (FREE!)

### 1. Clone Repository / שכפול המאגר
```bash
git clone <repository-url>
cd business-licensing-assessor
```

### 2. Backend Setup / הגדרת השרת
```bash
cd backend
npm install
```

Create environment file:
```bash
cp env.example .env
```

Add your Google Gemini API key to `.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=3001
```

**Get FREE Gemini API Key / קבלת מפתח API חינמי:**
1. Visit https://ai.google.dev/
2. Click "Get API key in Google AI Studio"
3. Sign in with Google account
4. Copy your free API key (no billing required!)

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup / הגדרת הממשק
```bash
cd ../frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

## Detailed Installation Instructions / הוראות התקנה מפורטות

### System Requirements / דרישות מערכת
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux Ubuntu 18.04+
- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 7.0.0 or higher (comes with Node.js)
- **Memory**: At least 4GB RAM
- **Storage**: At least 500MB free space

### Step-by-Step Installation / התקנה שלב אחר שלב

#### 1. Install Node.js / התקנת Node.js
**Windows:**
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the instructions
4. Verify installation: `node --version` and `npm --version`

**macOS:**
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2. Clone and Setup Project / שכפול והגדרת הפרויקט
```bash
# Clone the repository
git clone https://github.com/your-username/business-licensing-assessor.git
cd business-licensing-assessor

# Verify project structure
ls -la
```

#### 3. Backend Installation / התקנת השרת
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected output should show:**
- @google/generative-ai
- cors
- dotenv
- express
- mammoth
- pdf-parse
- And development dependencies

#### 4. Environment Configuration / הגדרת סביבה
```bash
# Create environment file
touch .env

# Edit the file (use your preferred editor)
nano .env
# or
code .env
# or
notepad .env
```

**Add the following content to .env:**
```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=3001
NODE_ENV=development
```

#### 5. Frontend Installation / התקנת הממשק
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected output should show:**
- react
- react-dom
- react-scripts
- axios
- html2canvas
- jspdf
- react-markdown
- And other dependencies

### Running the Application / הרצת האפליקציה

#### Method 1: Run Both Services Separately / שיטה 1: הרצת שני השירותים בנפרד

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Method 2: Using npm scripts (if configured) / שיטה 2: שימוש בסקריפטים של npm
```bash
# From project root
npm run dev:backend  # Start backend
npm run dev:frontend # Start frontend
```

### Verification / אימות התקנה

1. **Backend Health Check:**
   - Open browser to `http://localhost:3001/api/health`
   - Should return: `{"status":"ok","requirements_count":20}`

2. **Frontend Access:**
   - Open browser to `http://localhost:3000`
   - Should see the Hebrew questionnaire form

3. **Test Report Generation:**
   - Fill out the questionnaire
   - Click "קבל דוח רישוי"
   - Should generate a report (mock or AI-powered)

### Troubleshooting / פתרון בעיות

#### Common Issues / בעיות נפוצות

**1. Port Already in Use / פורט תפוס**
```bash
# Find process using port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**2. Node.js Version Issues / בעיות גרסת Node.js**
```bash
# Check current version
node --version

# Update Node.js if needed
# Download latest LTS from https://nodejs.org/
```

**3. npm Install Fails / התקנת npm נכשלת**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules & del package-lock.json  # Windows

# Reinstall
npm install
```

**4. CORS Issues / בעיות CORS**
- Ensure backend is running on port 3001
- Check that frontend is making requests to `http://localhost:3001`
- Verify CORS is enabled in backend server

**5. API Key Issues / בעיות מפתח API**
- Verify API key is correctly set in `.env` file
- Check that `.env` file is in the backend directory
- Ensure no extra spaces or quotes around the API key
- Test API key at https://ai.google.dev/

### Development Commands / פקודות פיתוח

#### Backend Commands / פקודות שרת
```bash
cd backend

# Development with auto-restart
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Run ETL script
npm run etl
```

#### Frontend Commands / פקודות ממשק
```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

### Production Deployment / פריסה לייצור

#### Backend Deployment / פריסת שרת
1. Build the application: `npm run build`
2. Set production environment variables
3. Use process manager (PM2): `pm2 start dist/server.js`
4. Configure reverse proxy (nginx)
5. Enable HTTPS

#### Frontend Deployment / פריסת ממשק
1. Build the application: `npm run build`
2. Serve the `build/` directory
3. Configure web server (nginx, Apache)
4. Set up CDN if needed

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

The system uses Google Gemini's FREE API to generate comprehensive licensing reports in Hebrew. The AI assistant:

- Analyzes business characteristics
- Reviews matched requirements
- Generates structured reports with:
  - Executive summary
  - Mandatory requirements
  - Recommended requirements
  - Action checklist
  - Important notes
  - Information gaps

**Gemini Free Tier Benefits:**
- 15 requests per minute
- 1 million tokens per month
- No billing required
- High-quality Hebrew language support

See [docs/PROMPTS.md](docs/PROMPTS.md) for AI prompt documentation.

## Customization

### Adding New Business Criteria
1. Update `BusinessInput` interface in `types.ts`
2. Add form fields in `QuestionnaireForm.tsx`
3. Update matching logic in `matcher.ts`

### Modifying Report Structure
1. Edit system prompt in `backend/src/gemini.ts`
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