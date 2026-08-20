import { useState, useEffect, useMemo } from 'react';
import { Card, FormField, Button, Badge, getBmiColor, getBmiLabel, LoadingSkeleton, EmptyState } from '../components/ui';
import { getAllPatients } from '../api/patients';
import { createVitals, getVitalsByPatientId } from '../api/vitals';

const initialForm = {
  height: '',
  weight: '',
  visitDate: '',
};

export default function Vitals({ toast }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [vitals, setVitals] = useState([]);
  const [vitalsLoading, setVitalsLoading] = useState(false);

  // Live BMI calculation
  const liveBmi = useMemo(() => {
    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);
    if (h > 0 && w > 0) {
      return (w / ((h / 100) ** 2)).toFixed(1);
    }
    return null;
  }, [form.height, form.weight]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedPatientId) newErrors.patient = 'Please select a patient';
    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);
    if (!form.height || isNaN(h) || h <= 0) newErrors.height = 'Height must be greater than 0';
    if (!form.weight || isNaN(w) || w <= 0) newErrors.weight = 'Weight must be greater than 0';
    if (form.visitDate && isNaN(Date.parse(form.visitDate))) newErrors.visitDate = 'Invalid date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
      };
      if (form.visitDate) payload.visitDate = form.visitDate;
      await createVitals(selectedPatientId, payload);
      toast.success('Vitals Recorded', 'Patient vitals have been saved successfully.');
      setForm(initialForm);
      setErrors({});
      // Refresh history
      const res = await getVitalsByPatientId(selectedPatientId);
      setVitals(res.data || []);
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
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Select Patient"
              name="patient"
              type="select"
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                if (errors.patient) setErrors((prev) => ({ ...prev, patient: '' }));
              }}
              error={errors.patient}
              options={patientOptions}
              placeholder="Choose a patient"
              required
              className="sm:col-span-2"
            />
            <FormField
              label="Height (cm)"
              name="height"
              type="number"
              value={form.height}
              onChange={handleChange}
              error={errors.height}
              placeholder="e.g. 175"
              required
            />
            <FormField
              label="Weight (kg)"
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              error={errors.weight}
              placeholder="e.g. 70"
              required
            />
            <FormField
              label="Visit Date"
              name="visitDate"
              type="date"
              value={form.visitDate}
              onChange={handleChange}
              error={errors.visitDate}
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
            <Button variant="secondary" onClick={() => { setForm(initialForm); setErrors({}); }}>
              Clear
            </Button>
            <Button type="submit" loading={submitting}>
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
              icon={
                <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
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
