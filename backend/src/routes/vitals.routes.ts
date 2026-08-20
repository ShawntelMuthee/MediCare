import { Router } from 'express';
import { VitalsController } from '../controllers/vitals.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createVitalsSchema, getVitalsSchema } from '../validators/vitals.validator.js';

const router = Router();

router.post('/:id/vitals', validate(createVitalsSchema), VitalsController.create);
router.get('/:id/vitals', validate(getVitalsSchema), VitalsController.getByPatientId);

export default router;
