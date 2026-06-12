import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, EyeOff, AlertCircle, ArrowRight, Users, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useLanguage } from '../context/LanguageContext';

const CONTENT = {
  en: {
    branding: 'SmartCare ASD',
    title: 'Create your account',
    subtitle: 'Free access — no credit card required.',
    stepRole: 'Select Role',
    stepDetails: 'Your Details',
    iamLabel: 'I am a…',
    roleDesc: 'Select your role to get the right experience.',
    continueBtn: 'Continue',
    backBtn: 'Back',
    roleAccount: 'account',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Dr. / Mr. / Ms. Full Name',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Min. 8 characters',
    termsText: 'By creating an account you agree to our Terms of Service and Privacy Policy.',
    createAccountBtn: 'Create Account',
    creatingBtn: 'Creating account…',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    roles: {
      parent: {
        title: 'Parent / Guardian',
        desc: 'Screen your child and track results'
      },
      caregiver: {
        title: 'Caregiver / Educator',
        desc: 'Screen children in your care and track results'
      }
    }
  },
  ur: {
    branding: 'اسمارٹ کیئر ASD',
    title: 'نیا اکاؤنٹ بنائیں',
    subtitle: 'مفت رسائی — کسی کریڈٹ کارڈ کی ضرورت نہیں ہے۔',
    stepRole: 'کردار منتخب کریں',
    stepDetails: 'تفصیلات درج کریں',
    iamLabel: 'میں ایک ہوں…',
    roleDesc: 'صحیح تجربہ حاصل کرنے کے لیے اپنا کردار منتخب کریں۔',
    continueBtn: 'جاری رکھیں',
    backBtn: 'پیچھے',
    roleAccount: 'اکاؤنٹ',
    fullNameLabel: 'مکمل نام',
    fullNamePlaceholder: 'ڈاکٹر / جناب / محترمہ مکمل نام',
    emailLabel: 'ای میل ایڈریس',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'پاس ورڈ',
    passwordPlaceholder: 'کم از کم 8 حروف',
    termsText: 'نیا اکاؤنٹ بنا کر آپ ہماری سروس کی شرائط اور رازداری کی پالیسی سے اتفاق کرتے ہیں۔',
    createAccountBtn: 'اکاؤنٹ بنائیں',
    creatingBtn: 'اکاؤنٹ بن رہا ہے…',
    alreadyHaveAccount: 'پہلے سے ہی اکاؤنٹ موجود ہے؟',
    signInLink: 'سائن ان کریں',
    roles: {
      parent: {
        title: 'والدین / سرپرست',
        desc: 'اپنے بچے کی اسکریننگ کریں اور نتائج دیکھیں'
      },
      caregiver: {
        title: 'دیکھ بھال کرنے والے / معلم',
        desc: 'بچوں کی اسکریننگ کریں اور نتائج کا انتظام کریں'
      }
    }
  }
};

export default function SignupPage() {
  const { register } = useAuth();
  const { language } = useLanguage();
  const t = CONTENT[language];

  const rolesTranslated = [
    {
      id: 'parent',
      icon: Users,
      title: t.roles.parent.title,
      desc: t.roles.parent.desc,
    },
    {
      id: 'caregiver',
      icon: Users,
      title: t.roles.caregiver.title,
      desc: t.roles.caregiver.desc,
    },
  ];

  const navigate = useNavigate();
  const [step, setStep]     = useState(1); // 1 = role, 2 = form
  const [role, setRole]     = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [form, setForm]     = useState({
    full_name: '', email: '', password: '',
    license_no: '', hospital_affiliate: '',
  });

  const handleRoleNext = () => {
    if (!role) return;
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, role });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/30 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-slide-up">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">{t.branding}</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${step > s ? 'bg-brand-600 text-white' : step === s ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-slate-200 text-slate-500'}`}>
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              <span className={`text-xs font-medium ${step >= s ? 'text-brand-700' : 'text-slate-400'}`}>
                {s === 1 ? t.stepRole : t.stepDetails}
              </span>
              {s < 2 && <div className="w-8 h-px bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="card-md p-8">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1 — Role selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">{t.iamLabel}</h2>
              <p className="text-sm text-slate-500 mb-5">
                {t.roleDesc}
              </p>
              <div className="space-y-3">
                {rolesTranslated.map(({ id, icon: Icon, title, desc }) => (
                  <button
                    key={id}
                    id={`role-${id}`}
                    onClick={() => setRole(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150
                      ${role === id
                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
                      }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${role === id ? 'bg-brand-600' : 'bg-slate-100'}`}>
                      <Icon className={`w-5 h-5 ${role === id ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${role === id ? 'text-brand-800' : 'text-slate-800'}`}>
                        {title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    {role === id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                id="role-next"
                onClick={handleRoleNext}
                disabled={!role}
                className="btn-primary w-full mt-6">
                {t.continueBtn} <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
              </button>

              <GoogleLoginButton />
            </div>
          )}

          {/* Step 2 — Form */}
          {step === 2 && (
            <>
              <form onSubmit={handleSubmit} className="animate-slide-in space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1">
                  ← {t.backBtn}
                </button>
                <span className="text-sm font-semibold text-slate-700 capitalize">
                  {role === 'parent' ? t.roles.parent.title : t.roles.caregiver.title} {t.roleAccount}
                </span>
              </div>

              <div>
                <label className="label">{t.fullNameLabel}</label>
                <input id="signup-name" type="text" className="input-field" placeholder={t.fullNamePlaceholder}
                  value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>

              <div>
                <label className="label">{t.emailLabel}</label>
                <input id="signup-email" type="email" className="input-field" placeholder={t.emailPlaceholder}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div>
                <label className="label">{t.passwordLabel}</label>
                <div className="relative">
                  <input id="signup-password"
                    type={showPw ? 'text' : 'password'} className="input-field pr-10"
                    placeholder={t.passwordPlaceholder}
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength indicator */}
                <div className="mt-1.5 flex gap-1">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all
                      ${form.password.length >= i * 3
                        ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                        : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>


              <p className="text-xs text-slate-400">
                {t.termsText}
              </p>

              <button id="signup-submit" type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    {t.creatingBtn}
                  </span>
                ) : (
                  <>{t.createAccountBtn} <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} /></>
                )}
              </button>
            </form>

            <GoogleLoginButton />
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
