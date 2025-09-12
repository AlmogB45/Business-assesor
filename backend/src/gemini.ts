import { GoogleGenerativeAI } from '@google/generative-ai';
import { BusinessInput, Requirement } from './types';

const SYSTEM_PROMPT = `אתה מסייע רישוי עסקים בישראל. קבל נתוני עסק ודרישות רגולטוריות מסוננות, הפק דוח בעברית ב-Markdown הכולל: תקציר מנהלים, דרישות חובה, דרישות מומלצות, צעדים מיידיים (צ'קליסט), הערות, פערי מידע.

הדוח צריך להיות מקצועי, ברור ופרקטי. השתמש בכותרות ברורות, רשימות מסודרות, וטבלאות כשמתאים. התמקד במידע מעשי שיעזור לבעל העסק להבין מה עליו לעשות.`;

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

export async function generateReportWithGemini(
  businessInput: BusinessInput,
  matchedRequirements: Requirement[]
): Promise<string> {
  // Use mock response if Gemini is not available or in mock mode
  if (MOCK_MODE_ENABLED || !process.env.GEMINI_API_KEY) {
    console.log('Using mock response (Gemini API key not available)');
    return generateMockReport(businessInput, matchedRequirements);
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
1. תקציר מנהלים
2. דרישות חובה
3. דרישות מומלצות
4. צעדים מיידיים (צ'קליסט)
5. הערות חשובות
6. פערי מידע ותחומים לבדיקה נוספת
`;

    console.log('Generating report with Google Gemini...');
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      console.log('Empty response from Gemini, falling back to mock');
      return generateMockReport(businessInput, matchedRequirements);
    }
    
    return text;
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
      return generateMockReport(businessInput, matchedRequirements);
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      console.log('Gemini quota exceeded, falling back to mock response');
      return generateMockReport(businessInput, matchedRequirements);
    } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
      console.log('Gemini rate limit exceeded, falling back to mock response');
      return generateMockReport(businessInput, matchedRequirements);
    } else {
      // For any other error, fall back to mock
      console.log('Gemini API error, falling back to mock response');
      return generateMockReport(businessInput, matchedRequirements);
    }
  }
}
