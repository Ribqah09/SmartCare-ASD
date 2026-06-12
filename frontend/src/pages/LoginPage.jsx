import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useLanguage } from '../context/LanguageContext';

const CONTENT = {
  en: {
    title: "Early detection changes everything.",
    subtitle: "AI-powered multimodal autism screening for toddlers aged 12–36 months. Clinically validated. Designed for families.",
    features: [
      'Validated Q-CHAT-10 questionnaire',
      'Vision + behavioral fusion scoring',
      'Clinical summaries of results',
      'Instant PDF reports',
    ],
    signIn: "Sign in",
    credentialsDesc: "Enter your credentials to access your dashboard.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    signInBtn: "Sign In",
    signingInBtn: "Signing in…",
    noAccount: "Don't have an account?",
    createOne: "Create one",
    demoHint: "Register as a Parent or Caregiver to start screening toddlers.",
    branding: "SmartCare ASD"
  },
  ur: {
    title: "بروقت تشخیص سب کچھ بدل دیتی ہے۔",
    subtitle: "12 سے 36 ماہ کے بچوں کے لیے اے آئی سے لیس کثیر جہتی آٹزم اسکریننگ۔ طبی طور پر تصدیق شدہ۔ خاندانوں کے لیے تیار کردہ۔",
    features: [
      'تصدیق شدہ Q-CHAT-10 سوالنامہ',
      'بصری اور رویے کے ملاپ کی اسکورنگ',
      'تفصیلی کلینیکل خلاصے',
      'فوری PDF رپورٹس',
    ],
    signIn: "سائن ان کریں",
    credentialsDesc: "اپنے ڈیش بورڈ تک رسائی کے لیے اپنی تفصیلات درج کریں۔",
    emailLabel: "ای میل ایڈریس",
    passwordLabel: "پاس ورڈ",
    forgotPassword: "پاس ورڈ بھول گئے؟",
    signInBtn: "سائن ان کریں",
    signingInBtn: "سائن ان ہو رہا ہے…",
    noAccount: "اکاؤنٹ نہیں ہے؟",
    createOne: "نیا بنائیں",
    demoHint: "بچوں کی اسکریننگ شروع کرنے کے لیے والدین یا دیکھ بھال کرنے والے کے طور پر رجسٹر ہوں۔",
    branding: "اسمارٹ کیئر ASD"
  }
};

export default function LoginPage() {
  const { login } = useAuth();
  const { language } = useLanguage();
  const t = CONTENT[language];
  
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.full_name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/30 to-slate-100 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-brand-700 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">{t.branding}</span>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              {language === 'ur' ? (
                <>بروقت تشخیص<br />سب کچھ بدل دیتی ہے۔</>
              ) : (
                <>Early detection<br />changes everything.</>
              )}
            </h1>
            <p className="mt-4 text-brand-200 text-lg leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {t.features.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-brand-100 text-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-300 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-brand-300 text-xs">
          {language === 'en' ? 'Designed for DUET Final Year Project · 2025' : 'DUET فائنل ایئر پروجیکٹ کے لیے تیار کردہ · 2025'}
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">{t.branding}</span>
          </div>

          <div className="card-md p-8">
            <h2 className="text-2xl font-bold text-slate-800">{t.signIn}</h2>
            <p className="text-slate-500 text-sm mt-1">{t.credentialsDesc}</p>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label">{t.emailLabel}</label>
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="label mb-0">{t.passwordLabel}</label>
                  <button type="button" className="text-xs text-brand-600 hover:underline">
                    {t.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    {t.signingInBtn}
                  </span>
                ) : (
                  <>{t.signInBtn} <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} /></>
                )}
              </button>
            </form>

            <GoogleLoginButton />

            <p className="text-center text-sm text-slate-500 mt-5">
              {t.noAccount}{' '}
              <Link to="/signup" className="text-brand-600 font-semibold hover:underline">
                {t.createOne}
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700">
              <strong>{language === 'en' ? 'Demo:' : 'ڈیمو:'}</strong> {t.demoHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
