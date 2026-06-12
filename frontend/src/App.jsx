import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, GuestOnly } from './components/RouteGuards';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage     from './pages/LandingPage';
import LoginPage       from './pages/LoginPage';
import SignupPage      from './pages/SignupPage';
import ParentDashboard from './pages/ParentDashboard';
import ScreeningWizard from './pages/ScreeningForm';
import ResultsPage     from './pages/ResultsPage';
import AutismEvaluations from './pages/AutismEvaluations';
import SpeechTherapy from './pages/SpeechTherapy';
import OccupationalTherapy from './pages/OccupationalTherapy';


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout with nav + footer (for public & app pages)
function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Auth pages — no nav/footer
function AuthLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Inter, sans-serif', fontSize: 14, borderRadius: 10 },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* ── Public landing ── */}
          <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />

          {/* ── Public info pages (navbar links) ── */}
          <Route path="/about"      element={<AppLayout><LandingPage /></AppLayout>} />
          <Route path="/guidelines" element={<AppLayout><LandingPage /></AppLayout>} />
          <Route path="/contact"    element={<AppLayout><LandingPage /></AppLayout>} />

          {/* ── Auth routes (no nav) ── */}
          <Route path="/login"  element={<AuthLayout><GuestOnly><LoginPage  /></GuestOnly></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><GuestOnly><SignupPage /></GuestOnly></AuthLayout>} />

          {/* ── Parent routes ── */}
          <Route path="/dashboard" element={
            <AppLayout><RequireAuth roles={['parent','admin']}><ParentDashboard /></RequireAuth></AppLayout>
          } />
          <Route path="/screen" element={
            <AppLayout><RequireAuth roles={['parent','admin']}><ScreeningWizard /></RequireAuth></AppLayout>
          } />
          <Route path="/results" element={
            <AppLayout><RequireAuth><ResultsPage /></RequireAuth></AppLayout>
          } />


          <Route path="/guidelines/evaluations" element={<AppLayout><AutismEvaluations /></AppLayout>} />
          <Route path="/guidelines/speech-therapy" element={<AppLayout><SpeechTherapy /></AppLayout>} />
          <Route path="/guidelines/occupational-therapy" element={<AppLayout><OccupationalTherapy /></AppLayout>} />

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </LanguageProvider>
  );
}
