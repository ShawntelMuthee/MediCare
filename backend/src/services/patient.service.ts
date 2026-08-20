import prisma from '../config/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

export interface CreatePatientDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  registrationDate?: string;
}

export class PatientService {
  static async createPatient(data: CreatePatientDTO) {
    const dob = new Date(data.dateOfBirth);

    // Duplicate patient check (same first name, last name, date of birth)
    const existing = await prisma.patient.findFirst({
      where: {
        firstName: { equals: data.firstName, mode: 'insensitive' },
        lastName: { equals: data.lastName, mode: 'insensitive' },
        dateOfBirth: dob,
      },
    });

    if (existing) {
      throw new AppError('A patient with the same name and date of birth already exists', 409);
    }

    const patient = await prisma.patient.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: dob,
        gender: data.gender,
        registrationDate: data.registrationDate ? new Date(data.registrationDate) : undefined,
      },
    });

    return patient;
  }

  static async getAllPatients() {
    return await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vitals: { orderBy: { visitDate: 'desc' }, take: 1 },
      },
    });
  }

  static async getPatientById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        vitals: { orderBy: { visitDate: 'desc' } },
        overweightAssess: { orderBy: { visitDate: 'desc' } },
        generalAssess: { orderBy: { visitDate: 'desc' } },
      },
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    return patient;
  }

  static async getPatientReport() {
    const totalPatients = await prisma.patient.count();
    const recentPatients = await prisma.patient.findMany({
      take: 10,
      orderBy: { registrationDate: 'desc' },
    });

    return {
      totalPatients,
      recentPatients,
    };
  }
}
