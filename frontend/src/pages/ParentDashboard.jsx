import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import {
  Plus, User, ChevronRight, Activity, FileText,
  Baby, AlertTriangle, CheckCircle, Clock, BarChart3
} from 'lucide-react';
import { getRiskConfig } from '../utils/qchat';
import { useLanguage } from '../context/LanguageContext';
import { getGenderFromNameHeuristics } from './ScreeningForm';

const CONTENT = {
  en: {
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    subtitle: "Manage your children and run AI screenings.",
    addChildBtn: "Add Child",
    statChildren: "Children",
    statEligible: "Eligible Now",
    statReports: "Reports Ready",
    statHighRisk: "High Risk",
    aboutTitle: "How to Start a Screening",
    aboutSteps: [
      "Add your child's profile details using the 'Add Child' button.",
      "Click the 'Screen' button next to your child's profile card.",
      "Complete the 10 developmental questions about your child's behavior.",
      "Upload a clear front-facing photo or capture a live webcam image.",
      "Review the automated clinical summary and download the PDF report for your doctor."
    ],
    profilesTitle: "Child Profiles",
    registeredSuffix: "registered",
    noChildrenTitle: "No children added yet",
    noChildrenDesc: "Add your child's profile to start an AI screening.",
    addFirstChild: "Add First Child",
    disclaimerTitle: "Clinical Disclaimer:",
    disclaimerDesc: "SmartCare is a preliminary screening tool validated on the Q-CHAT-10 instrument and facial images. It does not provide a medical diagnosis. If your child scores in the Moderate or High risk range, please consult a developmental paediatrician or contact a centre such as IHRI, CARTS, or ASD Welfare Trust for a full DSM-5 evaluation.",
    screenBtn: "Screen",
    outsideRange: "Outside 12–36 mo. range",
    modalTitle: "Add a Child Profile",
    modalSubtitle: "Screening is available for toddlers aged 12–36 months.",
    childName: "Child's Full Name",
    placeholderName: "e.g., Aiza Khan",
    dob: "Date of Birth",
    gender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Prefer not to say",
    cancelBtn: "Cancel",
    saveBtn: "Save",
    savingBtn: "Saving…",
    ageSuffixMonths: "months",
    ageSuffixYearsMonths: "{y}y {m}m",
    pastReportsTitle: "Recent Screening Reports",
    noReportsTitle: "No screenings conducted yet",
    noReportsDesc: "Conduct an AI screening for your child to view report cards here.",
    viewReportBtn: "View Report",
    downloadPdfBtn: "Download PDF",
    screeningDate: "Screened on",
    fusionScoreLabel: "Fusion Score"
  },
  ur: {
    greetingMorning: "صبح بخیر",
    greetingAfternoon: "سہ پہر بخیر",
    greetingEvening: "شام بخیر",
    subtitle: "اپنے بچوں کا انتظام کریں اور اے آئی اسکریننگ شروع کریں۔",
    addChildBtn: "بچہ شامل کریں",
    statChildren: "بچے",
    statEligible: "اہل بچے",
    statReports: "رپورٹس تیار",
    statHighRisk: "ہائی رسک",
    aboutTitle: "اسکریننگ شروع کرنے کا طریقہ",
    aboutSteps: [
      "اوپر 'بچہ شامل کریں' کے بٹن سے بچے کا نام، جنس اور تاریخِ پیدائش درج کریں۔",
      "بچے کے نام کے کارڈ کے سامنے موجود 'اسکریننگ' بٹن پر کلک کریں۔",
      "بچے کے رویے اور نشوونما سے متعلق 10 آسان سوالات کے جواب دیں۔",
      "بچے کے چہرے کی سامنے سے ایک واضح تصویر اپ لوڈ کریں یا کیمرے سے لائیو تصویر کھینچیں۔",
      "تکمیل کے بعد کلینیکل خلاصہ دیکھیں اور ڈاکٹر کے لیے پی ڈی ایف رپورٹ ڈاؤن لوڈ کریں۔"
    ],
    profilesTitle: "بچوں کے پروفائلز",
    registeredSuffix: "رجسٹرڈ",
    noChildrenTitle: "ابھی تک کوئی بچہ شامل نہیں کیا گیا",
    noChildrenDesc: "اے آئی اسکریننگ شروع کرنے کے لیے اپنے بچے کا پروفائل شامل کریں۔",
    addFirstChild: "پہلا بچہ شامل کریں",
    disclaimerTitle: "طبی دستبرداری:",
    disclaimerDesc: "اسمارٹ کیئر ایک ابتدائی اسکریننگ ٹول ہے جس کی تصدیق Q-CHAT-10 آلے اور چہرے کی تصاویر پر کی گئی ہے۔ یہ کوئی طبی تشخیص فراہم نہیں کرتا ہے۔ اگر آپ کے بچے کا اسکور معتدل یا زیادہ خطرے کی حد میں ہے تو براہ کرم ایک ترقیاتی ماہر اطفال سے مشورہ کریں یا مکمل DSM-5 تشخیص کے لیے IHRI، CARTS، یا ASD ویلفیئر ٹرسٹ جیسے مرکز سے رابطہ کریں۔",
    screenBtn: "اسکریننگ",
    outsideRange: "عمر 12–36 ماہ کے درمیان ہونی چاہیے",
    modalTitle: "بچے کا پروفائل شامل کریں",
    modalSubtitle: "اسکریننگ 12 سے 36 ماہ کے بچوں کے لیے دستیاب ہے۔",
    childName: "بچے کا مکمل نام",
    placeholderName: "مثلاً، عائزہ خان",
    dob: "تاریخ پیدائش",
    gender: "جنس",
    genderMale: "مرد",
    genderFemale: "خواتین",
    genderOther: "بتانا پسند نہیں",
    cancelBtn: "منسوخ کریں",
    saveBtn: "شامل کریں",
    savingBtn: "محفوظ ہو رہا ہے…",
    ageSuffixMonths: "ماہ",
    ageSuffixYearsMonths: "{y} سال {m} ماہ",
    pastReportsTitle: "حالیہ اسکریننگ رپورٹس",
    noReportsTitle: "ابھی تک کوئی اسکریننگ نہیں کی گئی",
    noReportsDesc: "رپورٹ کارڈز دیکھنے کے لیے اپنے بچے کی اے آئی اسکریننگ کریں۔",
    viewReportBtn: "رپورٹ دیکھیں",
    downloadPdfBtn: "پی ڈی ایف ڈاؤن لوڈ",
    screeningDate: "اسکریننگ کی تاریخ",
    fusionScoreLabel: "فیوژن اسکور"
  }
};

// --- Stat Card ---
function StatCard({ icon: Icon, label, value, color = 'brand' }) {
  const colors = {
    brand:  { bg: 'bg-brand-50',   icon: 'text-brand-600',   val: 'text-brand-700'  },
    green:  { bg: 'bg-green-50',   icon: 'text-green-600',   val: 'text-green-700'  },
    amber:  { bg: 'bg-amber-50',   icon: 'text-amber-600',   val: 'text-amber-700'  },
    red:    { bg: 'bg-red-50',     icon: 'text-red-600',     val: 'text-red-700'    },
  }[color];
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${colors.val}`}>{value}</p>
      </div>
    </div>
  );
}

// --- Child Card ---
function ChildCard({ child, onScreen }) {
  const { language } = useLanguage();
  const t = CONTENT[language];

  const age = (() => {
    const dob = new Date(child.date_of_birth);
    const months = (new Date() - dob) / (1000 * 60 * 60 * 24 * 30.44);
    const y = Math.floor(months / 12);
    const m = Math.floor(months % 12);
    if (language === 'ur') {
      return y > 0 
        ? `${y} سال ${m} ماہ`
        : `${m} ماہ`;
    }
    return y > 0 ? `${y}y ${m}m` : `${m} months`;
  })();

  const genderTranslated = (() => {
    if (child.gender === 'male') return language === 'ur' ? 'لڑکا' : 'Male';
    if (child.gender === 'female') return language === 'ur' ? 'لڑکی' : 'Female';
    return language === 'ur' ? 'دیگر' : 'Other';
  })();

  const eligible = (() => {
    const months = (new Date() - new Date(child.date_of_birth)) / (1000 * 60 * 60 * 24 * 30.44);
    return months >= 12 && months <= 36;
  })();

  return (
    <div className="card p-5 flex items-center justify-between gap-4 hover:shadow-card-md transition-shadow">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg flex-shrink-0">
          {child.full_name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{child.full_name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{genderTranslated} · {age}</p>
          {!eligible && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" /> {t.outsideRange}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onScreen(child)}
        disabled={!eligible}
        className="btn-primary text-xs px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
        {t.screenBtn} <ChevronRight className={`w-3.5 h-3.5 ${language === 'ur' ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

// --- Add Child Modal ---
function AddChildModal({ onClose, onAdded }) {
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [form, setForm] = useState({ full_name: '', date_of_birth: '', gender: '' });
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (val.trim() === '') {
      setIsManualOverride(false);
    }
    setForm(prev => {
      const updated = { ...prev, full_name: val };
      if (!isManualOverride) {
        updated.gender = getGenderFromNameHeuristics(val);
      }
      return updated;
    });
  };

  const handleNameBlur = (e) => {
    if (isManualOverride) return;
    const val = e.target.value;
    setForm(prev => ({ ...prev, gender: getGenderFromNameHeuristics(val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gender) {
      const msg = language === 'ur' ? 'براہ کرم بچے کی جنس منتخب کریں۔' : 'Please select a gender for the child.';
      setErr(msg);
      toast.error(msg);
      return;
    }
    setErr('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/children', form);
      toast.success(
        language === 'ur'
          ? 'بچے کا پروفائل کامیابی سے شامل ہو گیا۔'
          : 'Child profile added successfully.'
      );
      onAdded(data.child || null);
      onClose();
    } catch (e) {
      const msg = !e.response
        ? (language === 'ur'
          ? 'سرور سے رابطہ نہیں ہو سکا۔ بیک اینڈ (پورٹ 5001) چل رہا ہے یقینی بنائیں۔'
          : 'Cannot reach the server. Make sure the backend is running on port 5001.')
        : (e.response?.data?.error || (language === 'ur' ? 'بچے کا پروفائل شامل کرنے میں ناکامی۔' : 'Failed to add child.'));
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="card-md p-7 w-full max-w-md animate-slide-up">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{t.modalTitle}</h3>
        <p className="text-sm text-slate-500 mb-5">{t.modalSubtitle}</p>

        {err && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{err}</div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        >
          <div>
            <label className="label">{t.childName}</label>
            <input className="input-field" placeholder={t.placeholderName}
              value={form.full_name} 
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              required />
          </div>
          <div>
            <label className="label">{t.dob}</label>
            <input type="date" className="input-field"
              value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} required />
          </div>
          <div>
            <label className="label">{t.gender}</label>
            <select 
              className="input-field" 
              value={form.gender} 
              onChange={(e) => {
                setForm({ ...form, gender: e.target.value });
                setIsManualOverride(true);
              }}
              required
            >
              <option value="" disabled>{language === 'ur' ? 'جنس منتخب کریں' : 'Select Gender'}</option>
              <option value="male">{t.genderMale}</option>
              <option value="female">{t.genderFemale}</option>
              <option value="other">{t.genderOther}</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">{t.cancelBtn}</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? t.savingBtn : t.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function ParentDashboard() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [children, setChildren]     = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [loading, setLoading]       = useState(true);

  const getCalibratedScreening = (s) => {
    return {
      ...s,
      vision_pct: (s.vision_raw_score || 0.0) * 100,
      behavior_pct: (s.behavior_raw_score || 0.0) * 100
    };
  };

  const calibratedScreenings = screenings.map(getCalibratedScreening);


  const fetchChildren = async (showErrorToast = true) => {
    try {
      const { data } = await api.get('/api/children');
      const list = data.children || [];
      setChildren(list);
      return list;
    } catch (e) {
      console.error('Children load error', e);
      if (showErrorToast && !e.response) {
        toast.error(
          language === 'ur'
            ? 'بچوں کی فہرست لوڈ نہیں ہو سکی۔ بیک اینڈ چلائیں (پورٹ 5001)۔'
            : 'Could not load children. Start the backend on port 5001.'
        );
      } else if (showErrorToast && e.response?.status === 403) {
        toast.error(
          language === 'ur'
            ? 'اس اکاؤنٹ کو بچے شامل کرنے کی اجازت نہیں۔ دوبارہ لاگ ان کریں۔'
            : 'This account cannot manage children. Please sign in again.'
        );
      }
      return null;
    }
  };

  const fetchScreenings = async () => {
    try {
      const { data } = await api.get('/api/screenings');
      setScreenings(data.screenings || []);
    } catch (e) {
      console.error('Screenings load error', e);
      setScreenings([]);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([fetchChildren(), fetchScreenings()]);
    setLoading(false);
  };

  const handleChildAdded = async (createdChild) => {
    if (createdChild?.id) {
      setChildren((prev) => {
        if (prev.some((c) => c.id === createdChild.id)) return prev;
        return [createdChild, ...prev];
      });
    }
    await fetchChildren(false);
    await fetchScreenings();
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleScreen = (child) => {
    // Store the selected child and navigate to the wizard
    sessionStorage.setItem('sc_selected_child', JSON.stringify(child));
    window.location.href = '/screen';
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return t.greetingMorning;
    if (hours < 17) return t.greetingAfternoon;
    return t.greetingEvening;
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-8 animate-fade-in">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">
            {getGreeting()},{' '}
            <span className="text-brand-700">{user?.full_name?.split(' ')[0]}</span>
          </h1>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>
        <button id="add-child-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> {t.addChildBtn}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Baby}         label={t.statChildren}       value={children.length}                                  color="brand" />
        <StatCard icon={Activity}     label={t.statEligible}   value={children.filter(c => {
          const m = (new Date()-new Date(c.date_of_birth))/(1000*60*60*24*30.44);
          return m>=12&&m<=36;
        }).length}                                                                                                      color="green" />
        <StatCard icon={FileText}     label={t.statReports}  value={calibratedScreenings.length}                                                color="amber" />
        <StatCard icon={BarChart3}    label={t.statHighRisk}      value={calibratedScreenings.filter(s => s.risk_label === 'High').length}                                                color="red"   />
      </div>

      {/* How it Works / Steps to Screen */}
      <div className="card p-5 mb-6 border-l-4 border-l-brand-500">
        <div className="flex items-center gap-2.5 mb-3">
          <Activity className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <p className="text-sm font-bold text-slate-800">{t.aboutTitle}</p>
        </div>
        <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
          {t.aboutSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="flex-1">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main dashboard content: Children and past screenings in a clean full-width vertical stack */}
      <div className="space-y-10">
        {/* Children list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">{t.profilesTitle}</h2>
            <span className="text-xs text-slate-500">{children.length} {t.registeredSuffix}</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2].map(i => (
                <div key={i} className="card p-5 animate-pulse flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-32" />
                    <div className="h-2 bg-slate-100 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : children.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Baby className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700">{t.noChildrenTitle}</p>
              <p className="text-sm text-slate-400 mt-1">{t.noChildrenDesc}</p>
              <button onClick={() => setShowModal(true)} className="btn-primary mt-5 mx-auto">
                <Plus className="w-4 h-4" /> {t.addFirstChild}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {children.map((c) => (
                <ChildCard key={c.id} child={c} onScreen={handleScreen} />
              ))}
            </div>
          )}
        </div>

        {/* Past screenings list */}
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-4">{t.pastReportsTitle}</h2>
          {loading ? (
            <div className="card p-5 animate-pulse flex items-center justify-between">
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-1/4" />
            </div>
          ) : calibratedScreenings.length === 0 ? (
            <div className="card p-8 text-center text-slate-400 text-sm">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-medium">{t.noReportsTitle}</p>
              <p className="text-xs text-slate-400 mt-1">{t.noReportsDesc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calibratedScreenings.map((s) => {
                const riskCfg = s.risk_label === 'High' 
                  ? { text: 'text-red-700 bg-red-50 border-red-100', label: language === 'ur' ? 'ہائی رسک' : 'High Risk' }
                  : s.risk_label === 'Moderate'
                  ? { text: 'text-amber-700 bg-amber-50 border-amber-100', label: language === 'ur' ? 'معتدل خطرہ' : 'Moderate Risk' }
                  : { text: 'text-green-700 bg-green-50 border-green-100', label: language === 'ur' ? 'کم خطرہ' : 'Low Risk' };

                return (
                  <div key={s.id} className="card p-5 hover:shadow-card-md transition-all flex flex-col justify-between gap-4 border border-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{s.child_name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {t.screeningDate}: {new Date(s.screened_at).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                          {t.fusionScoreLabel}: <strong className="text-brand-700">{(s.fusion_score * 100).toFixed(2)}%</strong>
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${riskCfg.text}`}>
                        {riskCfg.label}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          sessionStorage.setItem('sc_result', JSON.stringify({
                            screening_id: s.id,
                            tracking_id: s.tracking_id,
                            fusion_score: s.fusion_score,
                            risk_label: s.risk_label,
                            vision_pct: s.vision_pct,
                            behavior_pct: s.behavior_pct,
                            gemini_summary: s.gemini_summary,
                            pdf_url: s.pdf_url
                          }));
                          window.location.href = '/results';
                        }}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 flex-1 justify-center">
                        {t.viewReportBtn}
                      </button>
                      {s.pdf_url && (
                        <a
                          href={`${api.defaults.baseURL || ''}${s.pdf_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 flex-1 justify-center">
                          {t.downloadPdfBtn}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-600">⚕ {t.disclaimerTitle}</strong> {t.disclaimerDesc}
        </p>
      </div>

      {showModal && (
        <AddChildModal onClose={() => setShowModal(false)} onAdded={handleChildAdded} />
      )}
    </div>
  );
}
