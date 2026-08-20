import { z } from 'zod';

export const createPatientSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date of birth format',
    }),
    gender: z.string().min(1, 'Gender is required'),
    registrationDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid registration date format',
    }),
  }),
});

export const getPatientByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid patient ID format'),
  }),
});
