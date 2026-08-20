import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createOverweightAssessmentSchema,
  createGeneralAssessmentSchema,
} from '../validators/assessment.validator.js';

const router = Router();

router.post(
  '/:id/overweight-assessments',
  validate(createOverweightAssessmentSchema),
  AssessmentController.createOverweight
);

router.post(
  '/:id/general-assessments',
  validate(createGeneralAssessmentSchema),
  AssessmentController.createGeneral
);

export default router;
