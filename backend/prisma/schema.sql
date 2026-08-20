-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients Table
CREATE TABLE "Patient" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "registrationDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "gender" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Vitals Table
CREATE TABLE "Vitals" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "patientId" UUID NOT NULL,
    "visitDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_patient_vitals" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

-- Overweight Assessment Table
CREATE TABLE "OverweightAssessment" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "patientId" UUID NOT NULL,
    "visitDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generalHealth" VARCHAR(255) NOT NULL,
    "everBeenOnDiet" BOOLEAN NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_patient_overweight_assess" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

-- General Assessment Table
CREATE TABLE "GeneralAssessment" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "patientId" UUID NOT NULL,
    "visitDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generalHealth" VARCHAR(255) NOT NULL,
    "currentlyUsingDrugs" BOOLEAN NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_patient_general_assess" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

-- Recommended Indexes
CREATE INDEX "idx_patient_name" ON "Patient"("lastName", "firstName");
CREATE INDEX "idx_patient_reg_date" ON "Patient"("registrationDate");

CREATE INDEX "idx_vitals_patient_id" ON "Vitals"("patientId");
CREATE INDEX "idx_vitals_visit_date" ON "Vitals"("visitDate");

CREATE INDEX "idx_overweight_assess_patient_id" ON "OverweightAssessment"("patientId");
CREATE INDEX "idx_overweight_assess_visit_date" ON "OverweightAssessment"("visitDate");

CREATE INDEX "idx_general_assess_patient_id" ON "GeneralAssessment"("patientId");
CREATE INDEX "idx_general_assess_visit_date" ON "GeneralAssessment"("visitDate");
