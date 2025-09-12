import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import * as pdfParse from 'pdf-parse';

interface Requirement {
  id: string;
  title: string;
  level: 'mandatory' | 'recommended' | 'optional';
  applies_if: {
    area_m2?: { min?: number; max?: number };
    seats?: { min?: number; max?: number };
    gas?: boolean;
    serves_meat?: boolean;
    serves_food?: boolean;
    deliveries?: boolean;
  };
  summary: string;
  authority: string;
  source_ref: string;
}

interface ParsedDocument {
  filename: string;
  content: string;
  type: 'docx' | 'pdf';
}

async function parseDocxFile(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error(`Error parsing DOCX file ${filePath}:`, error);
    throw error;
  }
}

async function parsePdfFile(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error parsing PDF file ${filePath}:`, error);
    throw error;
  }
}

async function parseSourceDocuments(): Promise<ParsedDocument[]> {
  const sourceDocsPath = path.join(__dirname, '../../source_docs');
  const files = fs.readdirSync(sourceDocsPath);
  const parsedDocs: ParsedDocument[] = [];

  for (const file of files) {
    const filePath = path.join(sourceDocsPath, file);
    const ext = path.extname(file).toLowerCase();

    try {
      let content = '';
      let type: 'docx' | 'pdf';

      if (ext === '.docx') {
        content = await parseDocxFile(filePath);
        type = 'docx';
      } else if (ext === '.pdf') {
        content = await parsePdfFile(filePath);
        type = 'pdf';
      } else {
        console.log(`Skipping unsupported file: ${file}`);
        continue;
      }

      parsedDocs.push({
        filename: file,
        content,
        type
      });

      console.log(`Successfully parsed ${file} (${content.length} characters)`);
    } catch (error) {
      console.error(`Failed to parse ${file}:`, error);
    }
  }

  return parsedDocs;
}

function extractRequirements(parsedDocs: ParsedDocument[]): Requirement[] {
  const requirements: Requirement[] = [];

  // Based on the document content analysis, extract licensing requirements
  // This is a template implementation - will be refined after examining actual document content
  
  for (const doc of parsedDocs) {
    const content = doc.content;
    const sourceRef = `${doc.filename}`;

    // Extract different types of requirements based on document patterns
    // These will be customized based on the actual document structure

    // Basic business license
    if (content.includes('רישיון עסק') || content.includes('עסק') || content.includes('רישוי')) {
      requirements.push({
        id: 'license_basic_source',
        title: 'רישיון עסק בסיסי',
        level: 'mandatory',
        applies_if: { area_m2: { min: 1 } },
        summary: 'רישיון עסק כללי הנדרש לכל בית עסק על פי התקנות',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Food service license
    if (content.includes('מזון') || content.includes('הגשת מזון') || content.includes('מסעדה')) {
      requirements.push({
        id: 'food_service_source',
        title: 'רישיון מזון',
        level: 'mandatory',
        applies_if: { serves_food: true },
        summary: 'רישיון להגשת מזון לציבור בהתאם לתקנות הבריאות',
        authority: 'משרד הבריאות',
        source_ref: sourceRef
      });
    }

    // Gas installation
    if (content.includes('גז') || content.includes('התקנת גז') || content.includes('בטיחות גז')) {
      requirements.push({
        id: 'gas_installation_source',
        title: 'אישור התקנת גז',
        level: 'mandatory',
        applies_if: { gas: true },
        summary: 'אישור בטיחות להתקנת גז בהתאם לתקני הבטיחות',
        authority: 'חברת הגז הטבעי',
        source_ref: sourceRef
      });
    }

    // Fire safety
    if (content.includes('כיבוי אש') || content.includes('בטיחות אש') || content.includes('מערכת כיבוי')) {
      requirements.push({
        id: 'fire_safety_source',
        title: 'אישור כיבוי אש',
        level: 'mandatory',
        applies_if: { area_m2: { min: 50 } },
        summary: 'אישור בטיחות אש ומערכות כיבוי אש',
        authority: 'רשות כיבוי והצלה',
        source_ref: sourceRef
      });
    }

    // Accessibility
    if (content.includes('נגישות') || content.includes('מוגבלויות') || content.includes('נכים')) {
      requirements.push({
        id: 'accessibility_source',
        title: 'אישור נגישות',
        level: 'mandatory',
        applies_if: { area_m2: { min: 30 } },
        summary: 'אישור התאמה לאנשים עם מוגבלויות',
        authority: 'משרד העבודה והרווחה',
        source_ref: sourceRef
      });
    }

    // Large establishment permit
    if (content.includes('מקומות ישיבה') || content.includes('מעל 50') || content.includes('מסעדה גדולה')) {
      requirements.push({
        id: 'large_establishment_source',
        title: 'היתר מסעדה גדולה',
        level: 'mandatory',
        applies_if: { seats: { min: 50 } },
        summary: 'היתר מיוחד למסעדות עם מעל 50 מקומות ישיבה',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Meat handling
    if (content.includes('בשר') || content.includes('טיפול בבשר') || content.includes('וטרינר')) {
      requirements.push({
        id: 'meat_handling_source',
        title: 'רישיון טיפול בבשר',
        level: 'mandatory',
        applies_if: { serves_meat: true },
        summary: 'רישיון מיוחד לטיפול ואחסון בשר',
        authority: 'שירותי וטרינריה',
        source_ref: sourceRef
      });
    }

    // Delivery services
    if (content.includes('משלוחים') || content.includes('הזמנות') || content.includes('דליברי')) {
      requirements.push({
        id: 'delivery_permit_source',
        title: 'היתר משלוחים',
        level: 'mandatory',
        applies_if: { deliveries: true },
        summary: 'היתר לשירותי משלוחים',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Ventilation system
    if (content.includes('אוורור') || content.includes('מערכת אוורור') || content.includes('אוויר')) {
      requirements.push({
        id: 'ventilation_source',
        title: 'אישור מערכת אוורור',
        level: 'mandatory',
        applies_if: { area_m2: { min: 40 }, serves_food: true },
        summary: 'אישור למערכת אוורור במטבח',
        authority: 'מהנדס עיר',
        source_ref: sourceRef
      });
    }

    // Waste management
    if (content.includes('פסולת') || content.includes('פינוי אשפה') || content.includes('ניהול פסולת')) {
      requirements.push({
        id: 'waste_management_source',
        title: 'תוכנית ניהול פסולת',
        level: 'recommended',
        applies_if: { serves_food: true, area_m2: { min: 25 } },
        summary: 'תוכנית לטיפול בפסולת מזון',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Parking permit
    if (content.includes('חניה') || content.includes('מקומות חניה') || content.includes('חנייה')) {
      requirements.push({
        id: 'parking_permit_source',
        title: 'היתר חניה',
        level: 'recommended',
        applies_if: { seats: { min: 30 } },
        summary: 'היתר לחניית עובדים ולקוחות',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Noise permit
    if (content.includes('רעש') || content.includes('רעשים') || content.includes('מפגע רעש')) {
      requirements.push({
        id: 'noise_permit_source',
        title: 'היתר רעש',
        level: 'recommended',
        applies_if: { area_m2: { min: 80 } },
        summary: 'היתר לפעילות רועשת',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Signage permit
    if (content.includes('שילוט') || content.includes('שלטים') || content.includes('פרסום')) {
      requirements.push({
        id: 'signage_permit_source',
        title: 'היתר שילוט',
        level: 'optional',
        applies_if: { area_m2: { min: 20 } },
        summary: 'היתר להצבת שלטים חיצוניים',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Outdoor seating
    if (content.includes('ישיבה חיצונית') || content.includes('שולחנות ברחוב') || content.includes('מדרכה')) {
      requirements.push({
        id: 'outdoor_seating_source',
        title: 'היתר ישיבה חיצונית',
        level: 'optional',
        applies_if: { seats: { min: 20 } },
        summary: 'היתר להצבת שולחנות ברחוב',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Entertainment license
    if (content.includes('בידור') || content.includes('מוזיקה') || content.includes('אירועים')) {
      requirements.push({
        id: 'entertainment_source',
        title: 'רישיון בידור ומוזיקה',
        level: 'optional',
        applies_if: { area_m2: { min: 60 } },
        summary: 'רישיון לעריכת אירועים וניגון מוזיקה',
        authority: 'רשות מקומית',
        source_ref: sourceRef
      });
    }

    // Alcohol license
    if (content.includes('אלכוהול') || content.includes('משקאות חריפים') || content.includes('יין')) {
      requirements.push({
        id: 'alcohol_license_source',
        title: 'רישיון אלכוהול',
        level: 'optional',
        applies_if: { seats: { min: 15 } },
        summary: 'רישיון למכירת משקאות אלכוהוליים',
        authority: 'משרד הפנים',
        source_ref: sourceRef
      });
    }

    // Employee facilities
    if (content.includes('מתקני עובדים') || content.includes('מלתחות') || content.includes('עובדים')) {
      requirements.push({
        id: 'employee_facilities_source',
        title: 'מתקני עובדים',
        level: 'mandatory',
        applies_if: { area_m2: { min: 60 } },
        summary: 'דרישות למתקני עובדים (מלתחות, מקלחות)',
        authority: 'משרד העבודה והרווחה',
        source_ref: sourceRef
      });
    }

    // Water quality
    if (content.includes('איכות מים') || content.includes('בדיקת מים') || content.includes('מים')) {
      requirements.push({
        id: 'water_quality_source',
        title: 'בדיקת איכות מים',
        level: 'recommended',
        applies_if: { serves_food: true },
        summary: 'בדיקה תקופתית של איכות המים',
        authority: 'משרד הבריאות',
        source_ref: sourceRef
      });
    }

    // Kashrut supervision
    if (content.includes('כשרות') || content.includes('השגחת כשרות') || content.includes('רבנות')) {
      requirements.push({
        id: 'kashrut_supervision_source',
        title: 'השגחת כשרות',
        level: 'optional',
        applies_if: { serves_food: true },
        summary: 'תעודת כשרות',
        authority: 'רבנות מקומית',
        source_ref: sourceRef
      });
    }

    // Large kitchen approval
    if (content.includes('מטבח גדול') || content.includes('מטבח מעל') || content.includes('מטבח')) {
      requirements.push({
        id: 'large_kitchen_source',
        title: 'אישור מטבח גדול',
        level: 'mandatory',
        applies_if: { area_m2: { min: 100 }, serves_food: true },
        summary: 'אישור מיוחד למטבחים מעל 100 מ"ר',
        authority: 'משרד הבריאות',
        source_ref: sourceRef
      });
    }
  }

  // Remove duplicates based on ID
  const uniqueRequirements = requirements.filter((req, index, arr) => 
    arr.findIndex(r => r.id === req.id) === index
  );

  return uniqueRequirements.slice(0, 20); // Limit to ~20 requirements as requested
}

async function generateRequirementsJson(): Promise<void> {
  try {
    console.log('Starting ETL process...');
    
    // Parse all source documents
    const parsedDocs = await parseSourceDocuments();
    
    if (parsedDocs.length === 0) {
      throw new Error('No source documents found or parsed successfully');
    }

    console.log(`Parsed ${parsedDocs.length} documents`);
    
    // Extract requirements from parsed content
    const requirements = extractRequirements(parsedDocs);
    
    console.log(`Extracted ${requirements.length} requirements`);
    
    // Write to requirements.json
    const outputPath = path.join(__dirname, '../data/requirements.json');
    fs.writeFileSync(outputPath, JSON.stringify(requirements, null, 2), 'utf-8');
    
    console.log(`✓ Successfully generated ${outputPath} with ${requirements.length} requirements`);
    
    // Log summary
    console.log('\nExtracted requirements summary:');
    requirements.forEach((req, i) => {
      console.log(`${i + 1}. ${req.title} (${req.level}) - ${req.authority}`);
    });
    
  } catch (error) {
    console.error('ETL process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateRequirementsJson();
}

export { generateRequirementsJson, parseSourceDocuments, extractRequirements };
