# API Documentation

## Base URL
```
http://localhost:3001
```

## Endpoints

### Health Check
**GET** `/api/health`

Returns the server status and number of loaded requirements.

**Response:**
```json
{
  "status": "ok",
  "requirements_count": 20
}
```

### Match Requirements
**POST** `/api/match`

Filters and returns requirements that match the given business criteria.

**Request Body:**
```json
{
  "area_m2": 100,
  "seats": 50,
  "gas": true,
  "serves_meat": true,
  "deliveries": false
}
```

**Response:**
```json
{
  "matched_requirements": [
    {
      "id": "license_basic",
      "name": "רישיון עסק בסיסי",
      "description": "רישיון עסק כללי הנדרש לכל בית עסק",
      "type": "mandatory",
      "applies_if": {
        "area_m2": { "min": 1 }
      },
      "authority": "עיריית תל אביב",
      "estimated_time": "2-4 שבועות",
      "cost": "₪500-1500"
    }
  ],
  "business_input": {
    "area_m2": 100,
    "seats": 50,
    "gas": true,
    "serves_meat": true,
    "deliveries": false
  }
}
```

### Generate Report
**POST** `/api/report`

Generates an AI-powered licensing report based on matched requirements.

**Request Body:**
```json
{
  "area_m2": 100,
  "seats": 50,
  "gas": true,
  "serves_meat": true,
  "deliveries": false
}
```

**Response:**
```json
{
  "report": "# דוח רישוי עסק\n\n## תקציר מנהלים\n...",
  "matched_requirements": [...],
  "business_input": {...}
}
```

## Request Validation

All fields in the request body are required:

- `area_m2`: Positive number (square meters)
- `seats`: Non-negative number (seating capacity)
- `gas`: Boolean (uses gas)
- `serves_meat`: Boolean (serves meat)
- `deliveries`: Boolean (offers delivery service)

## Error Responses

**400 Bad Request:**
```json
{
  "error": "area_m2 must be a positive number"
}
```

**500 Internal Server Error:**
```json
{
  "error": "OpenAI API key not configured"
}
```

## Environment Variables

- `OPENAI_API_KEY`: Required for report generation
- `MODEL`: OpenAI model to use (default: gpt-4o-mini)
- `PORT`: Server port (default: 3001)
