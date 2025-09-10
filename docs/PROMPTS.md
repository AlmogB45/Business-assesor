# AI Prompts Documentation

## System Prompt (Hebrew)

The system prompt used for OpenAI API calls:

```
אתה מסייע רישוי עסקים בישראל. קבל נתוני עסק ודרישות רגולטוריות מסוננות, הפק דוח בעברית ב-Markdown הכולל: תקציר מנהלים, דרישות חובה, דרישות מומלצות, צעדים מיידיים (צ'קליסט), הערות, פערי מידע.

הדוח צריך להיות מקצועי, ברור ופרקטי. השתמש בכותרות ברורות, רשימות מסודרות, וטבלאות כשמתאים. התמקד במידע מעשי שיעזור לבעל העסק להבין מה עליו לעשות.
```

**Translation:**
> You are a business licensing assistant in Israel. Receive business data and filtered regulatory requirements, generate a report in Hebrew in Markdown format including: executive summary, mandatory requirements, recommended requirements, immediate steps (checklist), notes, information gaps.
>
> The report should be professional, clear and practical. Use clear headings, organized lists, and tables when appropriate. Focus on practical information that will help the business owner understand what they need to do.

## User Prompt Template

The user prompt dynamically includes business data and matched requirements:

```
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
```

## Expected Report Structure

The AI is instructed to generate a report with the following sections:

### 1. תקציר מנהלים (Executive Summary)
- Brief overview of the business profile
- Summary of licensing requirements
- Total estimated time and cost

### 2. דרישות חובה (Mandatory Requirements)
- List of all mandatory licenses and permits
- Organized by priority or timeline
- Clear action items for each requirement

### 3. דרישות מומלצות (Recommended Requirements)
- Optional but beneficial permits
- Explanation of advantages for each

### 4. צעדים מיידיים (Immediate Steps/Checklist)
- Actionable checklist format
- Prioritized by urgency
- Clear next steps for business owner

### 5. הערות חשובות (Important Notes)
- Special considerations
- Common pitfalls to avoid
- Tips for smoother approval process

### 6. פערי מידע ותחומים לבדיקה נוספת (Information Gaps)
- Areas requiring additional consultation
- Questions to clarify with authorities
- Recommendations for professional assistance

## Model Configuration

```typescript
{
  model: process.env.MODEL || 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 2000
}
```

- **Temperature 0.7**: Balanced creativity and consistency
- **Max tokens 2000**: Sufficient for comprehensive reports
- **Default model**: gpt-4o-mini for cost efficiency

## Error Handling

If OpenAI API fails, the system returns:
```
שגיאה ביצירת הדוח. אנא נסה שוב מאוחר יותר.
```
(Translation: "Error generating report. Please try again later.")

## Customization

To modify prompts:
1. Edit the `SYSTEM_PROMPT` constant in `backend/src/openai.ts`
2. Adjust the user prompt template in the `generateReport` function
3. Update model parameters as needed

## Best Practices

- Keep prompts in Hebrew for consistency
- Include specific structure requirements
- Provide clear examples in the system prompt
- Use practical, actionable language
- Focus on business owner's perspective
