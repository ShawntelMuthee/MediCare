import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from '../UI';
import { useToast } from '../../hooks/useToast';
import { useDarkMode } from '../../hooks/useDarkMode';

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
  const { isDarkMode, theme, toggleDarkMode } = useDarkMode();

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen bg-[#f5f3ed] transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#f5f3ed]/90 backdrop-blur-xl border-b border-slate-200/80 transition-colors duration-200">
          <div className="flex items-center gap-4 px-4 sm:px-8 lg:px-12 h-[76px]">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-600 font-bold">Care operations</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-900">{pageTitle}</h2>
            </div>

            {/* Header right */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label={`Theme: ${theme}. Activate to switch theme.`}
                title={`Theme: ${theme} · Click to switch`}
              >
                {isDarkMode ? (
                  <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                    <circle cx="12" cy="12" r="3.5" />
                    <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" />
                  </svg>
                )}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-5">
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
          <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-[1440px] mx-auto animate-fade-in">
            {typeof children === 'function' ? children(toast) : children}
          </div>
        </main>
      </div>

      {/* Toast container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}
