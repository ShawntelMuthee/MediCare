import { Request, Response, NextFunction } from 'express';
import { PatientService } from '../services/patient.service.js';

export class PatientController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.createPatient(req.body);
      return res.status(201).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const patients = await PatientService.getAllPatients();
      return res.status(200).json({
        success: true,
        data: patients,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.getPatientById(req.params.id);
      return res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await PatientService.getPatientReport();
      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      return next(error);
    }
  }
}
