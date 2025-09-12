import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BusinessInput, Requirement, MatchResponse, ReportResponse } from './types';
import { matchRequirements } from './matcher';
import { generateReportWithGemini } from './gemini';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment validation
console.log('Environment check:');
console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('- GEMINI_MODEL:', process.env.GEMINI_MODEL || 'gemini-1.5-flash (default)');
console.log('- PORT:', process.env.PORT || '3001 (default)');

if (!process.env.GEMINI_API_KEY) {
  console.warn('\n⚠️  WARNING: GEMINI_API_KEY is not set in .env file');
  console.warn('Will use mock responses. To get real AI reports:');
  console.warn('1. Get free API key from: https://ai.google.dev/');
  console.warn('2. Add GEMINI_API_KEY=your_key_here to backend/.env');
  console.warn('See docs/ENV_SETUP.md for instructions\n');
}

// Load requirements data
const requirementsPath = path.join(__dirname, '../data/requirements.json');
let allRequirements: Requirement[] = [];

try {
  const requirementsData = fs.readFileSync(requirementsPath, 'utf-8');
  allRequirements = JSON.parse(requirementsData);
  console.log(`✅ Loaded ${allRequirements.length} requirements`);
} catch (error) {
  console.error('❌ Error loading requirements:', error);
  process.exit(1);
}

// Validation middleware
function validateBusinessInput(req: express.Request, res: express.Response, next: express.NextFunction) {
  const { area_m2, seats, gas, serves_meat, deliveries } = req.body;
  
  if (typeof area_m2 !== 'number' || area_m2 <= 0) {
    return res.status(400).json({ error: 'area_m2 must be a positive number' });
  }
  
  if (typeof seats !== 'number' || seats < 0) {
    return res.status(400).json({ error: 'seats must be a non-negative number' });
  }
  
  if (typeof gas !== 'boolean') {
    return res.status(400).json({ error: 'gas must be a boolean' });
  }
  
  if (typeof serves_meat !== 'boolean') {
    return res.status(400).json({ error: 'serves_meat must be a boolean' });
  }
  
  if (typeof deliveries !== 'boolean') {
    return res.status(400).json({ error: 'deliveries must be a boolean' });
  }
  
  next();
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', requirements_count: allRequirements.length });
});

app.post('/api/match', validateBusinessInput, (req, res) => {
  try {
    const businessInput: BusinessInput = req.body;
    const matchedRequirements = matchRequirements(businessInput, allRequirements);
    
    const response: MatchResponse = {
      matched_requirements: matchedRequirements,
      business_input: businessInput
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in /api/match:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/report', validateBusinessInput, async (req, res) => {
  try {
    const businessInput: BusinessInput = req.body;
    const matchedRequirements = matchRequirements(businessInput, allRequirements);
    
    console.log('Generating report for business input:', businessInput);
    console.log(`Found ${matchedRequirements.length} matching requirements`);
    
    const report = await generateReportWithGemini(businessInput, matchedRequirements);
    
    const response: ReportResponse = {
      report,
      matched_requirements: matchedRequirements,
      business_input: businessInput
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in /api/report:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
