import { BusinessInput, Requirement } from './types';

// Mock OpenAI response for development/testing when no credits available
export function generateMockReport(
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

⚠️ **זהו דוח דמו** - נוצר ללא שימוש ב-OpenAI API
📋 כל הדרישות מבוססות על מסמכי מקור מאומתים
🔍 מומלץ לוודא עם הרשויות המתאימות לפני הגשת בקשות

## פערי מידע

- יש לוודא דרישות ספציפיות לאזור הגיאוגרפי
- חלק מהדרישות עשויות להשתנות לפי סוג העסק הספציפי
- מומלץ להתעדכן על שינויים רגולטוריים אחרונים

---

*דוח זה נוצר באופן אוטומטי על בסיס ${matchedRequirements.length} דרישות רלוונטיות מתוך ${matchedRequirements.length} דרישות שנבדקו.*`;
}

export const MOCK_MODE_ENABLED = process.env.MOCK_OPENAI === 'true';
