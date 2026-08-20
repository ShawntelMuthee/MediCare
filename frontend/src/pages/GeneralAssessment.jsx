import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, FormField, Button, LoadingSkeleton } from '../components/UI';
import { getAllPatients } from '../api/patients';
import { createGeneralAssessment } from '../api/assessments';

const assessmentSchema = z.object({
  patient: z.string().min(1, 'Please select a patient'),
  visitDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  generalHealth: z.string().min(1, 'General health is required'),
  currentlyUsingDrugs: z.boolean(),
  comments: z.string().optional(),
});

const healthOptions = [
  { value: 'Good', label: 'Good' },
  { value: 'Poor', label: 'Poor' },
];

export default function GeneralAssessment({ toast }) {
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
      currentlyUsingDrugs: false,
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
        currentlyUsingDrugs: data.currentlyUsingDrugs,
        comments: data.comments,
      };
      if (data.visitDate) payload.visitDate = data.visitDate;

      await createGeneralAssessment(data.patient, payload);
      toast.success('Assessment Saved', 'General assessment recorded successfully.');
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
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="General Assessment" subtitle="Record details for a general assessment">
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
              label="Currently Using Drugs"
              type="checkbox"
              {...register('currentlyUsingDrugs')}
              error={errors.currentlyUsingDrugs?.message}
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
