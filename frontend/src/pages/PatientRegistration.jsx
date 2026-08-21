import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, FormField, Button } from '../components/ui';
import { createPatient } from '../api/patients';

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required').refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  gender: z.string().min(1, 'Gender is required'),
  registrationDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export default function PatientRegistration({ toast }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      registrationDate: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };
      if (!payload.registrationDate) delete payload.registrationDate;
      const res = await createPatient(payload);
      toast.success('Patient Registered', `${data.firstName} ${data.lastName} has been successfully registered.`);
      reset();
      
      // Navigate to Vitals page
      setTimeout(() => navigate('/vitals'), 1200);
    } catch (err) {
      toast.error('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary-600 font-bold mb-3">Patient registry / new record</p>
        <h1 className="display-serif text-4xl sm:text-5xl text-slate-900">Begin a patient record.</h1>
        <p className="text-sm text-slate-500 mt-3 max-w-lg">
          Add a new patient to the system. All fields marked with <span className="text-danger-500">*</span> are required.
        </p>
      </div>

      <Card className="border-slate-200/90">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="First Name"
              type="text"
              {...register('firstName')}
              error={errors.firstName?.message}
              placeholder="e.g. John"
              required
            />
            <FormField
              label="Last Name"
              type="text"
              {...register('lastName')}
              error={errors.lastName?.message}
              placeholder="e.g. Doe"
              required
            />
            <FormField
              label="Date of Birth"
              type="date"
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
              required
            />
            <FormField
              label="Gender"
              type="select"
              {...register('gender')}
              error={errors.gender?.message}
              options={genderOptions}
              required
            />
            <FormField
              label="Registration Date"
              type="date"
              {...register('registrationDate')}
              error={errors.registrationDate?.message}
              helpText="Defaults to today if left empty"
              className="sm:col-span-2"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button variant="secondary" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              Register Patient
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
