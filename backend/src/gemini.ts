import { GoogleGenerativeAI } from '@google/generative-ai';
import { BusinessInput, Requirement } from './types';

const SYSTEM_PROMPT = `אתה מסייע רישוי עסקים בישראל. קבל נתוני עסק ודרישות רגולטוריות מסוננות, הפק דוח בעברית ב-Markdown הכולל: תקציר מנהלים, דרישות חובה, דרישות מומלצות, צעדים מיידיים (צ'קליסט), הערות, פערי מידע.

הדוח צריך להיות מקצועי, ברור ופרקטי. השתמש בכותרות ברורות, רשימות מסודרות, וטבלאות כשמתאים. התמקד במידע מעשי שיעזור לבעל העסק להבין מה עליו לעשות.

מבנה הדוח:
- כל סעיף צריך להיות מאורגן עם כותרות משנה ברורות
- השתמש ברשימות ממוספרות ומובחנות
- הוסף טבלאות כשמתאים לארגון המידע
- בסוף כל סעיף, הוסף שורה אחת עם "מקור: [רשות מוציאה]" בלבד
- אל תכלול מידע על מקורות בתוך הטקסט עצמו`;

const MOCK_MODE_ENABLED = process.env.MOCK_GEMINI === 'true';

// Mock report generator for when Gemini API is not available
function generateMockReport(
  businessInput: BusinessInput,
  matchedRequirements: Requirement[]
): string {
  const mandatoryReqs = matchedRequirements.filter(req => req.level === 'mandatory');
  const recommendedReqs = matchedRequirements.filter(req => req.level === 'recommended');
  const optionalReqs = matchedRequirements.filter(req => req.level === 'optional');

  return `# דוח רישוי עסק - דמו

## תקציר מנהלים

על פי הנתונים שסופקו:
- שטח העסק: ${businessInput.area_m2} מ"ר
- מספר מקומות ישיבה: ${businessInput.seats}
- שימוש בגז: ${businessInput.gas ? 'כן' : 'לא'}
- הגשת בשר: ${businessInput.serves_meat ? 'כן' : 'לא'}
- שירותי משלוחים: ${businessInput.deliveries ? 'כן' : 'לא'}

נמצאו **${matchedRequirements.length} דרישות רלוונטיות** לעסק שלכם.

## דרישות חובה (${mandatoryReqs.length})

${mandatoryReqs.map(req => `### ${req.title}
- **רשות מוציאה:** ${req.authority}
- **תיאור:** ${req.summary}
- **מקור:** ${req.source_ref}
`).join('\n')}

## דרישות מומלצות (${recommendedReqs.length})

${recommendedReqs.map(req => `### ${req.title}
- **רשות מוציאה:** ${req.authority}
- **תיאור:** ${req.summary}
- **מקור:** ${req.source_ref}
`).join('\n')}

## דרישות אופציונליות (${optionalReqs.length})

${optionalReqs.map(req => `### ${req.title}
- **רשות מוציאה:** ${req.authority}
- **תיאור:** ${req.summary}
- **מקור:** ${req.source_ref}
`).join('\n')}

## צעדים מיידיים

1. **התחילו בדרישות החובה** - אלו נדרשות לפתיחת העסק
2. **תכננו מראש** - חלק מהרישיונות לוקחים מספר שבועות
3. **התייעצו עם יועץ** - לבדיקה מקצועית של הדרישות
4. **הכינו תיעוד** - אספו את כל המסמכים הנדרשים מראש

## הערות חשובות

⚠️ **זהו דוח דמו** - נוצר ללא שימוש ב-Gemini API
📋 כל הדרישות מבוססות על מסמכי מקור מאומתים
🔍 מומלץ לוודא עם הרשויות המתאימות לפני הגשת בקשות

## פערי מידע

- יש לוודא דרישות ספציפיות לאזור הגיאוגרפי
- חלק מהדרישות עשויות להשתנות לפי סוג העסק הספציפי
- מומלץ להתעדכן על שינויים רגולטוריים אחרונים

---

*דוח זה נוצר באופן אוטומטי על בסיס ${matchedRequirements.length} דרישות רלוונטיות מתוך ${matchedRequirements.length} דרישות שנבדקו.*`;
}

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
}

function addSourceReferencesToReport(report: string, matchedRequirements: Requirement[]): string {
  // Group requirements by level
  const mandatoryReqs = matchedRequirements.filter(req => req.level === 'mandatory');
  const recommendedReqs = matchedRequirements.filter(req => req.level === 'recommended');
  
  // Get unique authorities for each level
  const mandatoryAuthorities = [...new Set(mandatoryReqs.map(req => req.authority))];
  const recommendedAuthorities = [...new Set(recommendedReqs.map(req => req.authority))];
  
  let processedReport = report;
  
  // Add source reference after mandatory requirements section
  if (mandatoryAuthorities.length > 0) {
    const mandatorySourceRef = `\n\n<div class="source-reference">מקור: ${mandatoryAuthorities.join(', ')}</div>`;
    
    // Find the mandatory requirements section and add source reference
    const mandatorySectionRegex = /(##\s*2\.\s*דרישות\s*חובה[\s\S]*?)(?=##\s*3\.|$)/;
    const match = processedReport.match(mandatorySectionRegex);
    
    if (match) {
      processedReport = processedReport.replace(mandatorySectionRegex, match[1] + mandatorySourceRef);
    }
  }
  
  // Add source reference after recommended requirements section
  if (recommendedAuthorities.length > 0) {
    const recommendedSourceRef = `\n\n<div class="source-reference">מקור: ${recommendedAuthorities.join(', ')}</div>`;
    
    // Find the recommended requirements section and add source reference
    const recommendedSectionRegex = /(##\s*3\.\s*דרישות\s*מומלצות[\s\S]*?)(?=##\s*4\.|$)/;
    const match = processedReport.match(recommendedSectionRegex);
    
    if (match) {
      processedReport = processedReport.replace(recommendedSectionRegex, match[1] + recommendedSourceRef);
    }
  }
  
  return processedReport;
}

export async function generateReportWithGemini(
  businessInput: BusinessInput,
  matchedRequirements: Requirement[]
): Promise<string> {
  // Use mock response if Gemini is not available or in mock mode
  if (MOCK_MODE_ENABLED || !process.env.GEMINI_API_KEY) {
    console.log('Using mock response (Gemini API key not available)');
    const mockReport = generateMockReport(businessInput, matchedRequirements);
    return addSourceReferencesToReport(mockReport, matchedRequirements);
  }

  try {
    const model = getGeminiClient();
    
    const userPrompt = `
${SYSTEM_PROMPT}

נתוני העסק:
- שטח: ${businessInput.area_m2} מ"ר
- מקומות ישיבה: ${businessInput.seats}
- גז: ${businessInput.gas ? 'כן' : 'לא'}
- הגשת בשר: ${businessInput.serves_meat ? 'כן' : 'לא'}
- משלוחים: ${businessInput.deliveries ? 'כן' : 'לא'}

דרישות רגולטוריות רלוונטיות:
${matchedRequirements.map(req => `
**${req.title}** (${req.level})
- תיאור: ${req.summary}
- רשות: ${req.authority}
- מקור: ${req.source_ref}
`).join('\n')}

אנא הכן דוח מקיף בעברית עם המבנה הבא:

## 1. תקציר מנהלים
- סקירה כללית של הדרישות הרלוונטיות
- המלצות עיקריות לפעולה
- הערכת זמן משוערת לתהליך

## 2. דרישות חובה
- רשימת דרישות חובה מאורגנת לפי סדר עדיפות
- הסבר מפורט לכל דרישה
- צעדים מעשיים לביצוע
- בסוף הסעיף: מקור: [רשות מוציאה]

## 3. דרישות מומלצות
- רשימת דרישות מומלצות מאורגנת
- הסבר על היתרונות של כל דרישה
- צעדים לביצוע
- בסוף הסעיף: מקור: [רשות מוציאה]

## 4. צעדים מיידיים (צ'קליסט)
- רשימה ממוספרת של צעדים לביצוע מיידי
- סדר עדיפות ברור
- הערכת זמן לכל צעד

## 5. הערות חשובות
- נקודות חשובות לזכור
- אזהרות וסיכונים
- המלצות נוספות

## 6. פערי מידע ותחומים לבדיקה נוספת
- נושאים שדורשים בדיקה נוספת
- המלצות להתייעצות מקצועית

הדוח צריך להיות מאורגן, נקי ומקצועי עם מקורות בסוף כל סעיף רלוונטי.
`;

    console.log('Generating report with Google Gemini...');
    
    // Retry logic for handling temporary service overload
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();
        
        if (!text || text.trim().length === 0) {
          console.log('Empty response from Gemini, falling back to mock');
          return generateMockReport(businessInput, matchedRequirements);
        }
        
        console.log(`✅ Gemini API successful on attempt ${attempt}`);
        return addSourceReferencesToReport(text, matchedRequirements);
      } catch (error: any) {
        lastError = error;
        console.log(`❌ Gemini API attempt ${attempt}/3 failed:`, error.message);
        
        // If it's a 503 (service overloaded), wait before retrying
        if (error.status === 503 && attempt < 3) {
          const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s exponential backoff
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // For other errors or final attempt, break and handle below
        break;
      }
    }
    
    // If all retries failed, throw the last error to be handled by the catch block
    throw lastError;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response?.data
    });
    
    // Handle different types of Gemini API errors
    if (error.message?.includes('API_KEY_INVALID')) {
      console.log('Invalid Gemini API key, falling back to mock response');
      const mockReport = generateMockReport(businessInput, matchedRequirements);
      return addSourceReferencesToReport(mockReport, matchedRequirements);
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      console.log('Gemini quota exceeded, falling back to mock response');
      const mockReport = generateMockReport(businessInput, matchedRequirements);
      return addSourceReferencesToReport(mockReport, matchedRequirements);
    } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
      console.log('Gemini rate limit exceeded, falling back to mock response');
      const mockReport = generateMockReport(businessInput, matchedRequirements);
      return addSourceReferencesToReport(mockReport, matchedRequirements);
    } else if (error.message?.includes('404 Not Found') || error.message?.includes('models/') && error.message?.includes('is not found')) {
      console.log('Gemini model not found (404), falling back to mock response');
      console.log('Available models: gemini-1.5-flash, gemini-1.5-pro, gemini-1.0-pro');
      const mockReport = generateMockReport(businessInput, matchedRequirements);
      return addSourceReferencesToReport(mockReport, matchedRequirements);
    } else {
      // For any other error, fall back to mock
      console.log('Gemini API error, falling back to mock response');
      const mockReport = generateMockReport(businessInput, matchedRequirements);
      return addSourceReferencesToReport(mockReport, matchedRequirements);
    }
  }
}
