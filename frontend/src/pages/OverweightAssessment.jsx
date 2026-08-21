import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, FormField, Button, LoadingSkeleton } from '../components/UI';
import { getAllPatients } from '../api/patients';
import { createOverweightAssessment } from '../api/assessments';

const assessmentSchema = z.object({
  patient: z.string().min(1, 'Please select a patient'),
  visitDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  generalHealth: z.string().min(1, 'General health is required'),
  everBeenOnDiet: z.boolean(),
  comments: z.string().optional(),
});

const healthOptions = [
  { value: 'Good', label: 'Good' },
  { value: 'Poor', label: 'Poor' },
];

export default function OverweightAssessment({ toast }) {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      patient: '',
      visitDate: '',
      generalHealth: '',
      everBeenOnDiet: false,
      comments: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAllPatients();
        setPatients(res.data || []);
      } catch (err) {
        toast.error('Error', 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        generalHealth: data.generalHealth,
        everBeenOnDiet: data.everBeenOnDiet,
        comments: data.comments,
      };
      if (data.visitDate) payload.visitDate = data.visitDate;

      await createOverweightAssessment(data.patient, payload);
      toast.success('Assessment Saved', 'Overweight assessment recorded successfully.');
      reset();
      
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      toast.error('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`,
  }));

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary-600 font-bold mb-3">Clinical record / metabolic health</p>
        <h1 className="display-serif text-4xl sm:text-5xl text-slate-900">Understand the pattern.</h1>
        <p className="text-sm text-slate-500 mt-3">Add the context needed for a thoughtful weight and wellness assessment.</p>
      </div>
      <Card title="Overweight assessment" subtitle="Record details for an overweight assessment">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Select Patient"
              type="select"
              {...register('patient')}
              error={errors.patient?.message}
              options={patientOptions}
              placeholder="Choose a patient"
              required
              className="sm:col-span-2"
            />
            <FormField
              label="Visit Date"
              type="date"
              {...register('visitDate')}
              error={errors.visitDate?.message}
              helpText="Defaults to today if left empty"
            />
            <FormField
              label="General Health"
              type="select"
              {...register('generalHealth')}
              error={errors.generalHealth?.message}
              options={healthOptions}
              required
            />
            <FormField
              label="Ever Been On Diet"
              type="checkbox"
              {...register('everBeenOnDiet')}
              error={errors.everBeenOnDiet?.message}
              className="sm:col-span-2 mt-2"
            />
            <FormField
              label="Comments"
              type="textarea"
              {...register('comments')}
              error={errors.comments?.message}
              placeholder="Any additional notes..."
              className="sm:col-span-2"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button variant="secondary" onClick={() => reset()}>
              Clear
            </Button>
            <Button type="submit" loading={submitting} disabled={submitting}>
              Save Assessment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
