# API Documentation

Base URL: `/api/v1`

All responses follow this structure:
```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": [ ... ]
  }
}
```

## Patients

### `POST /patients`
Create a new patient.
- **Body**: 
  - `firstName` (string)
  - `lastName` (string)
  - `dateOfBirth` (string, ISO date)
  - `gender` (string)
  - `registrationDate` (optional string, ISO date)

### `GET /patients`
Get all patients.

### `GET /patients/:id`
Get a specific patient by ID, including their vitals and assessment history.

### `GET /patients/report`
Get dashboard statistics (total patients, recent registrations).

---

## Vitals

### `POST /patients/:patientId/vitals`
Record new vitals for a patient.
- **Body**:
  - `height` (number, > 0)
  - `weight` (number, > 0)
  - `visitDate` (optional string, ISO date)
- **Returns**: Vitals object with calculated `bmi`.

### `GET /patients/:patientId/vitals`
Get vitals history for a patient.

---

## Assessments

### `POST /patients/:patientId/general-assessments`
Record a general health assessment.
- **Body**:
  - `generalHealth` (string: "Good", "Poor")
  - `currentlyUsingDrugs` (boolean)
  - `comments` (optional string)
  - `visitDate` (optional string, ISO date)

### `POST /patients/:patientId/overweight-assessments`
Record an overweight health assessment.
- **Body**:
  - `generalHealth` (string: "Good", "Poor")
  - `everBeenOnDiet` (boolean)
  - `comments` (optional string)
  - `visitDate` (optional string, ISO date)
