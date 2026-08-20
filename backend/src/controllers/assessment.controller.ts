import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services/assessment.service.js';

export class AssessmentController {
  static async createOverweight(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.params.id;
      const assessment = await AssessmentService.createOverweightAssessment(patientId, req.body);
      return res.status(201).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createGeneral(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.params.id;
      const assessment = await AssessmentService.createGeneralAssessment(patientId, req.body);
      return res.status(201).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      return next(error);
    }
  }
}
