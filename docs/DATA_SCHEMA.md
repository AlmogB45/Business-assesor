# Data Schema Documentation

## Business Input Schema

The business questionnaire captures the following data:

```typescript
interface BusinessInput {
  area_m2: number;        // Business area in square meters (required, > 0)
  seats: number;          // Number of seats for customers (required, >= 0)
  gas: boolean;           // Whether the business uses gas (required)
  serves_meat: boolean;   // Whether the business serves meat (required)
  deliveries: boolean;    // Whether the business offers delivery services (required)
  serves_food?: boolean;  // Auto-inferred from serves_meat or can be set explicitly
}
```

## Requirements Schema

Requirements are stored in `backend/data/requirements.json`:

```typescript
interface Requirement {
  id: string;                    // Unique identifier
  title: string;                 // Display name in Hebrew
  level: 'mandatory' | 'recommended' | 'optional';  // Requirement priority
  applies_if: AppliesIf;        // Conditions for when this requirement applies
  summary: string;              // Detailed description in Hebrew
  authority: string;            // Issuing authority in Hebrew
  source_ref: string;           // Reference to source document (DOCX/PDF filename)
}

interface AppliesIf {
  area_m2?: { min?: number; max?: number };  // Area range conditions
  seats?: { min?: number; max?: number };    // Seating capacity conditions
  gas?: boolean;                             // Gas usage condition
  serves_meat?: boolean;                     // Meat serving condition
  serves_food?: boolean;                     // Food serving condition
  deliveries?: boolean;                      // Delivery service condition
}
```

## Requirement Levels

- **mandatory**: Must be obtained for legal operation
- **recommended**: Strongly advised for smooth operation
- **optional**: May be beneficial depending on business model

## Source References

Each requirement includes a `source_ref` field that points to the original source document:
- References the filename of the DOCX or PDF document
- Enables traceability back to official regulatory documents
- Supports compliance auditing and verification
- Displayed in frontend reports for transparency

Example source references:
- `"18-07-2022_4.2A.docx"` - Word document with licensing requirements
- `"18-07-2022_4.2A.pdf"` - PDF version of the same document

## Matching Logic

Requirements are matched based on the `applies_if` conditions:

1. **Numeric ranges**: Business value must be within min/max bounds
2. **Boolean flags**: Business flag must match requirement flag
3. **Auto-inference**: `serves_food` is automatically set to `true` if `serves_meat` is `true`

### Example Matching

```json
{
  "id": "large_kitchen_approval",
  "applies_if": {
    "area_m2": { "min": 100 },
    "serves_food": true
  }
}
```

This requirement matches if:
- Business area is 100 square meters or more, AND
- Business serves food (either explicitly set or inferred from serves_meat)

## Sample Data Structure

The system includes 20+ sample requirements covering:

- Basic business licenses
- Food service permits
- Gas installation approvals
- Fire safety certificates
- Accessibility compliance
- Employee facility requirements
- Specialized permits (meat handling, alcohol, entertainment)

## Data Localization

All user-facing text is in Hebrew:
- Requirement names and descriptions
- Authority names
- Time and cost estimates
- Generated reports
