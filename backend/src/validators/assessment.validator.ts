import { z } from 'zod';

export const createOverweightAssessmentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid patient ID format'),
  }),
  body: z.object({
    visitDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid visit date format',
    }),
    generalHealth: z.string().min(1, 'General health status is required'),
    everBeenOnDiet: z.boolean({ required_error: 'everBeenOnDiet boolean is required' }),
    comments: z.string().optional(),
  }),
});

export const createGeneralAssessmentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid patient ID format'),
  }),
  body: z.object({
    visitDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid visit date format',
    }),
    generalHealth: z.string().min(1, 'General health status is required'),
    currentlyUsingDrugs: z.boolean({ required_error: 'currentlyUsingDrugs boolean is required' }),
    comments: z.string().optional(),
  }),
});
