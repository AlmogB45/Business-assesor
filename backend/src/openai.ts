import OpenAI from 'openai';
import { BusinessInput, Requirement } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `אתה מסייע רישוי עסקים בישראל. קבל נתוני עסק ודרישות רגולטוריות מסוננות, הפק דוח בעברית ב-Markdown הכולל: תקציר מנהלים, דרישות חובה, דרישות מומלצות, צעדים מיידיים (צ'קליסט), הערות, פערי מידע.

הדוח צריך להיות מקצועי, ברור ופרקטי. השתמש בכותרות ברורות, רשימות מסודרות, וטבלאות כשמתאים. התמקד במידע מעשי שיעזור לבעל העסק להבין מה עליו לעשות.`;

export async function generateReport(
  businessInput: BusinessInput,
  matchedRequirements: Requirement[]
): Promise<string> {
  const model = process.env.MODEL || 'gpt-4o-mini';
  
  const userPrompt = `
נתוני העסק:
- שטח: ${businessInput.area_m2} מ"ר
- מקומות ישיבה: ${businessInput.seats}
- גז: ${businessInput.gas ? 'כן' : 'לא'}
- הגשת בשר: ${businessInput.serves_meat ? 'כן' : 'לא'}
- משלוחים: ${businessInput.deliveries ? 'כן' : 'לא'}

דרישות רגולטוריות רלוונטיות:
${matchedRequirements.map(req => `
**${req.name}** (${req.type})
- תיאור: ${req.description}
- רשות: ${req.authority}
- זמן משוער: ${req.estimated_time}
- עלות: ${req.cost}
`).join('\n')}

אנא הכן דוח מקיף בעברית עם המבנה הבא:
1. תקציר מנהלים
2. דרישות חובה
3. דרישות מומלצות
4. צעדים מיידיים (צ'קליסט)
5. הערות חשובות
6. פערי מידע ותחומים לבדיקה נוספת
`;

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || 'שגיאה ביצירת הדוח';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('שגיאה ביצירת הדוח. אנא נסה שוב מאוחר יותר.');
  }
}
