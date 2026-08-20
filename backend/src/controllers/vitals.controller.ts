import { Request, Response, NextFunction } from 'express';
import { VitalsService } from '../services/vitals.service.js';

export class VitalsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.params.id;
      const vitals = await VitalsService.createVitals(patientId, req.body);
      return res.status(201).json({
        success: true,
        data: vitals,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getByPatientId(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.params.id;
      const vitals = await VitalsService.getVitalsByPatientId(patientId);
      return res.status(200).json({
        success: true,
        data: vitals,
      });
    } catch (error) {
      return next(error);
    }
  }
}
