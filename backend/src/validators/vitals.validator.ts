import { z } from 'zod';

export const createVitalsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid patient ID format'),
  }),
  body: z.object({
    visitDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid visit date format',
    }),
    height: z.number().positive('Height must be greater than 0'),
    weight: z.number().positive('Weight must be greater than 0'),
  }),
});

export const getVitalsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid patient ID format'),
  }),
});
