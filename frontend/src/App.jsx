import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import PatientListing from './pages/PatientListing';
import PatientRegistration from './pages/PatientRegistration';
import Vitals from './pages/Vitals';
import OverweightAssessment from './pages/OverweightAssessment';
import GeneralAssessment from './pages/GeneralAssessment';

export default function App() {
  return (
    <Router>
      <DashboardLayout>
        {(toast) => (
          <Routes>
            <Route path="/" element={<PatientListing toast={toast} />} />
            <Route path="/register" element={<PatientRegistration toast={toast} />} />
            <Route path="/vitals" element={<Vitals toast={toast} />} />
            <Route path="/overweight-assessment" element={<OverweightAssessment toast={toast} />} />
            <Route path="/general-assessment" element={<GeneralAssessment toast={toast} />} />
          </Routes>
        )}
      </DashboardLayout>
    </Router>
  );
}
