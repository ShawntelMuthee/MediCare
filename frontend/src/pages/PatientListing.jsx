import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, getBmiColor, getBmiLabel, LoadingSkeleton, EmptyState, FormField } from '../components/UI';
import { getAllPatients } from '../api/patients';

export default function PatientListing({ toast }) {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [visitDateFilter, setVisitDateFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await getAllPatients();
        setPatients(res.data || []);
      } catch (err) {
        toast.error('Error', 'Failed to load patients list.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [toast]);

  const calculateAge = (dobString) => {
    if (!dobString) return '-';
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Name Search
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());

      // Visit Date Filter
      let matchesDate = true;
      if (visitDateFilter) {
        const lastVisitDate = patient.vitals && patient.vitals.length > 0 
          ? new Date(patient.vitals[0].visitDate).toISOString().split('T')[0] 
          : null;
        matchesDate = lastVisitDate === visitDateFilter;
      }

      return matchesSearch && matchesDate;
    });
  }, [patients, search, visitDateFilter]);

  // Statistics
  const stats = useMemo(() => {
    let overweightCount = 0;
    let normalCount = 0;
    
    patients.forEach(p => {
      if (p.vitals && p.vitals.length > 0) {
        const bmi = p.vitals[0].bmi;
        if (bmi >= 25) overweightCount++;
        else if (bmi >= 18.5) normalCount++;
      }
    });

    const newThisWeek = patients.filter(p => {
      const regDate = new Date(p.registrationDate);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return regDate >= oneWeekAgo;
    }).length;

    return {
      total: patients.length,
      newThisWeek,
      overweight: overweightCount,
      normal: normalCount,
    };
  }, [patients]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);
  const currentPatients = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPatients.slice(start, start + rowsPerPage);
  }, [filteredPatients, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, visitDateFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
        <LoadingSkeleton type="table" rows={10} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Patients Dashboard</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and view all registered patients.</p>
        </div>
        <Button onClick={() => navigate('/register')} icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        }>
          Register Patient
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Patients</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success-50 dark:bg-success-900/30 flex items-center justify-center text-success-600 dark:text-success-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">New This Week</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.newThisWeek}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning-50 dark:bg-warning-900/30 flex items-center justify-center text-warning-600 dark:text-warning-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Overweight/Obese</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.overweight}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Normal Weight</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.normal}</p>
          </div>
        </Card>
      </div>

      <Card padding={false}>
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
          <div className="flex-1">
            <FormField
              label="Search Patients"
              name="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm"
            />
          </div>
          <div>
            <FormField
              label="Filter by Last Visit Date"
              name="visitDateFilter"
              type="date"
              value={visitDateFilter}
              onChange={(e) => setVisitDateFilter(e.target.value)}
            />
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <EmptyState 
            title="No patients found" 
            description={patients.length === 0 ? "You haven't registered any patients yet." : "No patients match your search criteria."}
            action={
              search || visitDateFilter ? (
                <Button variant="ghost" onClick={() => { setSearch(''); setVisitDateFilter(''); }}>
                  Clear Filters
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="text-left font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">Patient Name</th>
                  <th className="text-left font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">Age</th>
                  <th className="text-left font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">Registration Date</th>
                  <th className="text-left font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">Last Visit</th>
                  <th className="text-left font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">BMI Status</th>
                  <th className="text-right font-semibold text-slate-600 dark:text-slate-300 px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient) => {
                  const lastVital = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;
                  return (
                    <tr key={patient.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors last:border-b-0 group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{patient.firstName} {patient.lastName}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {calculateAge(patient.dateOfBirth)} yrs
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {new Date(patient.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {lastVital ? new Date(lastVital.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {lastVital && lastVital.bmi ? (
                          <Badge color={getBmiColor(lastVital.bmi)} size="sm" dot>
                            {getBmiLabel(lastVital.bmi)}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs italic">No vitals</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${patient.id}`)}>
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-medium text-slate-800 dark:text-slate-200">{(currentPage - 1) * rowsPerPage + 1}</span> to{' '}
              <span className="font-medium text-slate-800 dark:text-slate-200">{Math.min(currentPage * rowsPerPage, filteredPatients.length)}</span> of{' '}
              <span className="font-medium text-slate-800 dark:text-slate-200">{filteredPatients.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
