import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from '../UI';
import { useToast } from '../../hooks/useToast';

const pageTitles = {
  '/': 'Patient Listing',
  '/register': 'Register Patient',
  '/vitals': 'Vitals',
  '/overweight-assessment': 'Overweight Assessment',
  '/general-assessment': 'General Assessment',
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const toast = useToast();

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen bg-slate-50 transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-colors duration-200">
          <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors lg:hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-800">{pageTitle}</h2>
            </div>

            {/* Header right */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto animate-fade-in">
            {typeof children === 'function' ? children(toast) : children}
          </div>
        </main>
      </div>

      {/* Toast container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}
