import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, getBmiColor, getBmiLabel, LoadingSkeleton, EmptyState } from '../components/UI';
import { getPatientById } from '../api/patients';

export default function PatientProfile({ toast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const res = await getPatientById(id);
        setPatient(res.data || null);
      } catch (err) {
        toast.error('Error', 'Failed to load patient profile.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPatient();
  }, [id, navigate, toast]);

  const calculateAge = (dobString) => {
    if (!dobString) return '-';
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <LoadingSkeleton type="card" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  if (!patient) return null;

  const vitals = patient.vitals || [];
  const overweight = patient.overweightAssess || [];
  const general = patient.generalAssess || [];
  
  // Combine assessments for a single timeline
  const assessments = [
    ...overweight.map(a => ({ ...a, type: 'Overweight' })),
    ...general.map(a => ({ ...a, type: 'General' }))
  ].sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Patient Profile</h2>
      </div>

      {/* Patient Info Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-800/30 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm flex-shrink-0">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white truncate">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                DOB: {new Date(patient.dateOfBirth).toLocaleDateString()} ({calculateAge(patient.dateOfBirth)} yrs)
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Gender: {patient.gender}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registered: {new Date(patient.registrationDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/vitals', { state: { patientId: patient.id } })}>
              Add Vitals
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vitals History */}
        <Card title="Vitals History" subtitle="Recent measurements and BMI tracking" padding={false}>
          {vitals.length === 0 ? (
            <EmptyState title="No vitals recorded" description="Start tracking this patient's vitals." className="py-12" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="text-left font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">Date</th>
                    <th className="text-left font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">Height/Weight</th>
                    <th className="text-left font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">BMI</th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.map((v) => (
                    <tr key={v.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {new Date(v.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {v.height}cm / {v.weight}kg
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={getBmiColor(v.bmi)} size="sm" dot>
                          {v.bmi.toFixed(1)} - {getBmiLabel(v.bmi)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Assessments History */}
        <Card title="Assessments" subtitle="General and Overweight records" padding={false}>
          {assessments.length === 0 ? (
            <EmptyState title="No assessments" description="No assessments have been recorded yet." className="py-12" />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {assessments.map((a) => (
                <div key={a.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge color={a.type === 'General' ? 'purple' : 'yellow'} size="sm">{a.type}</Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(a.visitDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        Health: {a.generalHealth}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {a.type === 'General' && (
                      <p><span className="font-medium">Using Drugs:</span> {a.currentlyUsingDrugs ? 'Yes' : 'No'}</p>
                    )}
                    {a.type === 'Overweight' && (
                      <p><span className="font-medium">Ever Dieted:</span> {a.everBeenOnDiet ? 'Yes' : 'No'}</p>
                    )}
                    {a.comments && (
                      <p className="mt-2 text-slate-500 dark:text-slate-400 italic">"{a.comments}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
