import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, FormField, Button, Badge, getBmiColor, getBmiLabel, LoadingSkeleton, EmptyState } from '../components/UI';
import { getAllPatients } from '../api/patients';
import { createVitals, getVitalsByPatientId } from '../api/vitals';

const vitalsSchema = z.object({
  patient: z.string().min(1, 'Please select a patient'),
  height: z.preprocess((a) => parseFloat(a), z.number({ invalid_type_error: 'Must be a number' }).positive('Height must be greater than 0')),
  weight: z.preprocess((a) => parseFloat(a), z.number({ invalid_type_error: 'Must be a number' }).positive('Weight must be greater than 0')),
  visitDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

export default function Vitals({ toast }) {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [vitals, setVitals] = useState([]);
  const [vitalsLoading, setVitalsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      patient: '',
      height: '',
      weight: '',
      visitDate: '',
    },
  });

  const selectedPatientId = watch('patient');
  const height = watch('height');
  const weight = watch('weight');

  // Live BMI calculation
  const liveBmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      return (w / ((h / 100) ** 2)).toFixed(1);
    }
    return null;
  }, [height, weight]);

  // Load patients on mount
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

  // Load vitals when patient selected
  useEffect(() => {
    if (!selectedPatientId) {
      setVitals([]);
      return;
    }
    const load = async () => {
      setVitalsLoading(true);
      try {
        const res = await getVitalsByPatientId(selectedPatientId);
        setVitals(res.data || []);
      } catch (err) {
        toast.error('Error', 'Failed to load vitals history');
      } finally {
        setVitalsLoading(false);
      }
    };
    load();
  }, [selectedPatientId]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        height: data.height,
        weight: data.weight,
      };
      if (data.visitDate) payload.visitDate = data.visitDate;
      const res = await createVitals(data.patient, payload);
      
      const newBmi = res.data.bmi;
      toast.success('Vitals Recorded', 'Patient vitals have been saved successfully.');
      reset();
      
      // Navigate based on BMI
      if (newBmi <= 25) {
        setTimeout(() => navigate('/general-assessment'), 1200);
      } else {
        setTimeout(() => navigate('/overweight-assessment'), 1200);
      }
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
      <div className="max-w-4xl mx-auto space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" rows={3} cols={4} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Vitals Form */}
      <Card title="Record Vitals" subtitle="Enter height and weight to calculate BMI">
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
              label="Height (cm)"
              type="number"
              {...register('height')}
              error={errors.height?.message}
              placeholder="e.g. 175"
              required
            />
            <FormField
              label="Weight (kg)"
              type="number"
              {...register('weight')}
              error={errors.weight?.message}
              placeholder="e.g. 70"
              required
            />
            <FormField
              label="Visit Date"
              type="date"
              {...register('visitDate')}
              error={errors.visitDate?.message}
              helpText="Defaults to today if left empty"
            />

            {/* Live BMI Display */}
            <div className="flex items-end">
              {liveBmi && (
                <div className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 animate-fade-in">
                  <p className="text-xs text-slate-400 mb-1 font-medium">Calculated BMI</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-800">{liveBmi}</span>
                    <Badge color={getBmiColor(parseFloat(liveBmi))} dot>
                      {getBmiLabel(parseFloat(liveBmi))}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button variant="secondary" onClick={() => reset()}>
              Clear
            </Button>
            <Button type="submit" loading={submitting} disabled={submitting}>
              Save Vitals
            </Button>
          </div>
        </form>
      </Card>

      {/* Vitals History */}
      {selectedPatientId && (
        <Card title="Vitals History" subtitle="Previous vitals records for this patient">
          {vitalsLoading ? (
            <LoadingSkeleton type="table" rows={3} cols={5} />
          ) : vitals.length === 0 ? (
            <EmptyState
              title="No vitals recorded"
              description="This patient has no vitals records yet. Use the form above to add the first record."
            />
          ) : (
            <div className="overflow-x-auto -mx-6 -mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left font-medium text-slate-500 px-6 py-3">Date</th>
                    <th className="text-left font-medium text-slate-500 px-6 py-3">Height (cm)</th>
                    <th className="text-left font-medium text-slate-500 px-6 py-3">Weight (kg)</th>
                    <th className="text-left font-medium text-slate-500 px-6 py-3">BMI</th>
                    <th className="text-left font-medium text-slate-500 px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.map((v) => (
                    <tr key={v.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 text-slate-700">
                        {new Date(v.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5 text-slate-700">{v.height}</td>
                      <td className="px-6 py-3.5 text-slate-700">{v.weight}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">{v.bmi?.toFixed(1)}</td>
                      <td className="px-6 py-3.5">
                        <Badge color={getBmiColor(v.bmi)} size="sm" dot>
                          {getBmiLabel(v.bmi)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
