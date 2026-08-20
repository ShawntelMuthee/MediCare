import prisma from '../config/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

export interface CreateOverweightAssessmentDTO {
  visitDate?: string;
  generalHealth: string;
  everBeenOnDiet: boolean;
  comments?: string;
}

export interface CreateGeneralAssessmentDTO {
  visitDate?: string;
  generalHealth: string;
  currentlyUsingDrugs: boolean;
  comments?: string;
}

export class AssessmentService {
  static async createOverweightAssessment(patientId: string, data: CreateOverweightAssessmentDTO) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const visitDate = data.visitDate ? new Date(data.visitDate) : new Date();
    const visitDateStart = new Date(visitDate);
    visitDateStart.setHours(0, 0, 0, 0);
    const visitDateEnd = new Date(visitDate);
    visitDateEnd.setHours(23, 59, 59, 999);

    const existing = await prisma.overweightAssessment.findFirst({
      where: {
        patientId,
        visitDate: {
          gte: visitDateStart,
          lte: visitDateEnd,
        },
      },
    });

    if (existing) {
      throw new AppError('An overweight assessment for this patient on this visit date already exists', 409);
    }

    return await prisma.overweightAssessment.create({
      data: {
        patientId,
        visitDate,
        generalHealth: data.generalHealth,
        everBeenOnDiet: data.everBeenOnDiet,
        comments: data.comments,
      },
    });
  }

  static async createGeneralAssessment(patientId: string, data: CreateGeneralAssessmentDTO) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const visitDate = data.visitDate ? new Date(data.visitDate) : new Date();
    const visitDateStart = new Date(visitDate);
    visitDateStart.setHours(0, 0, 0, 0);
    const visitDateEnd = new Date(visitDate);
    visitDateEnd.setHours(23, 59, 59, 999);

    const existing = await prisma.generalAssessment.findFirst({
      where: {
        patientId,
        visitDate: {
          gte: visitDateStart,
          lte: visitDateEnd,
        },
      },
    });

    if (existing) {
      throw new AppError('A general assessment for this patient on this visit date already exists', 409);
    }

    return await prisma.generalAssessment.create({
      data: {
        patientId,
        visitDate,
        generalHealth: data.generalHealth,
        currentlyUsingDrugs: data.currentlyUsingDrugs,
        comments: data.comments,
      },
    });
  }
}
