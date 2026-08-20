import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPatientSchema, getPatientByIdSchema } from '../validators/patient.validator.js';

const router = Router();

router.post('/', validate(createPatientSchema), PatientController.create);
router.get('/report', PatientController.getReport);
router.get('/', PatientController.getAll);
router.get('/:id', validate(getPatientByIdSchema), PatientController.getById);

export default router;
