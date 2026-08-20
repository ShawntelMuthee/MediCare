import prisma from '../config/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

export interface CreateVitalsDTO {
  visitDate?: string;
  height: number; // in cm
  weight: number; // in kg
}

export class VitalsService {
  static async createVitals(patientId: string, data: CreateVitalsDTO) {
    // Verify patient exists
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const visitDate = data.visitDate ? new Date(data.visitDate) : new Date();
    // Normalize date to date-only comparison or exact timestamp check
    const visitDateStart = new Date(visitDate);
    visitDateStart.setHours(0, 0, 0, 0);
    const visitDateEnd = new Date(visitDate);
    visitDateEnd.setHours(23, 59, 59, 999);

    // Duplicate visit date validation for vitals
    const existingVitals = await prisma.vitals.findFirst({
      where: {
        patientId,
        visitDate: {
          gte: visitDateStart,
          lte: visitDateEnd,
        },
      },
    });

    if (existingVitals) {
      throw new AppError('A vitals record for this patient on this visit date already exists', 409);
    }

    // Calculate BMI: weight (kg) / [height (m)]^2
    const heightInMeters = data.height / 100;
    const bmi = Number((data.weight / (heightInMeters * heightInMeters)).toFixed(2));

    const vitals = await prisma.vitals.create({
      data: {
        patientId,
        visitDate,
        height: data.height,
        weight: data.weight,
        bmi,
      },
    });

    return vitals;
  }

  static async getVitalsByPatientId(patientId: string) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    return await prisma.vitals.findMany({
      where: { patientId },
      orderBy: { visitDate: 'desc' },
    });
  }
}
