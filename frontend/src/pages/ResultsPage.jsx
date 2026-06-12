import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRiskConfig, QCHAT_QUESTIONS } from '../utils/qchat';
import {
  AlertTriangle, CheckCircle2, Info, Download, RotateCcw,
  Brain, Activity, Eye, BarChart3, FileText, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Score ring SVG
function ScoreRing({ pct, color, size = 120 }) {
  const r = 46; const c = 2 * Math.PI * r;
  const fill = (pct / 100) * c;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${fill} ${c - fill}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease-out' }} />
    </svg>
  );
}

const RISK_COLORS = {
  High:     { ring: '#dc2626', bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',   badge: 'bg-red-100 text-red-800',   icon: AlertTriangle },
  Moderate: { ring: '#d97706', bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800', icon: Info },
  Low:      { ring: '#16a34a', bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800', icon: CheckCircle2 },
};

const RECOMMENDATIONS = {
  High: {
    centres: [
      {
        name: 'IHRI',
        full: 'Institute Of Holistic Rehabilitation and Inclusion, Karachi',
        website: 'https://ihri.org.pk/',
        map: 'https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIKCAIQABixAxiABDINCAMQLhivARjHARiABDINCAQQLhivARjHARiABDIHCAUQABiABDIHCAYQABiABDINCAcQLhjHARjRAxiABDIHCAgQABiABDIHCAkQABiABNIBCDc0OThqMGo3qAIHsAIB8QVw8l5LTsLVJA&um=1&ie=UTF-8&fb=1&gl=pk&sa=X&geocode=KYnhBNwTPbM-MS9Dmdj2tWQx&daddr=D+53/1+Block+1+Clifton,+Karachi,+75600'
      },
      {
        name: 'CARTS',
        full: 'Center for Autism Rehabilitation and Training, Sindh',
        website: 'https://c-arts.org.pk/',
        map: 'https://www.google.com/maps/dir//Center+for+Autism+Rehabilitation+and+Training,+Sindh+(C-ARTS),+W4CC%2BQQ2,+Street+%23+31,+Block+15+Gulistan-e-Johar,+Karachi,+75290,+Pakistan/@24.8676352,67.0564352,14z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x3eb3391b921af9cf:0x7f3b8bbdf3b1bd55!2m2!1d67.1218916!2d24.9218988?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D'
      },
      {
        name: 'ASD Welfare Trust',
        full: 'ASD Welfare Trust, Karachi',
        website: 'https://m.youtube.com/@ASDWT',
        map: 'https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBBzE3NGowajSoAgCwAgA&um=1&ie=UTF-8&fb=1&gl=pk&sa=X&geocode=KVG4m4Y2P7M-MRdSHw5OAjqv&daddr=1+/+2,+N+Extension,+Block-6+PECHS+Extension+Block+6+P.E.C.H.S.,+Karachi'
      },
    ],
  },
  Moderate: {
    centres: [
      {
        name: 'IHRI',
        full: 'Institute Of Holistic Rehabilitation and Inclusion, Karachi',
        website: 'https://ihri.org.pk/',
        map: 'https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIKCAIQABixAxiABDINCAMQLhivARjHARiABDINCAQQLhivARjHARiABDIHCAUQABiABDIHCAYQABiABDINCAcQLhjHARjRAxiABDIHCAgQABiABDIHCAkQABiABNIBCDc0OThqMGo3qAIHsAIB8QVw8l5LTsLVJA&um=1&ie=UTF-8&fb=1&gl=pk&sa=X&geocode=KYnhBNwTPbM-MS9Dmdj2tWQx&daddr=D+53/1+Block+1+Clifton,+Karachi,+75600'
      },
      {
        name: 'CARTS',
        full: 'Center for Autism Rehabilitation and Training, Sindh',
        website: 'https://c-arts.org.pk/',
        map: 'https://www.google.com/maps/dir//Center+for+Autism+Rehabilitation+and+Training,+Sindh+(C-ARTS),+W4CC%2BQQ2,+Street+%23+31,+Block+15+Gulistan-e-Johar,+Karachi,+75290,+Pakistan/@24.8676352,67.0564352,14z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x3eb3391b921af9cf:0x7f3b8bbdf3b1bd55!2m2!1d67.1218916!2d24.9218988?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D'
      },
    ],
  },
  Low: {
    centres: [],
  },
};

const CONTENT = {
  en: {
    complete: "Screening Complete",
    reportTitle: "Screening Report",
    screeningId: "Screening ID",
    riskClass: "Risk Classification",
    highRisk: "High Risk",
    modRisk: "Moderate Risk",
    lowRisk: "Low Risk",
    fusionScoreLabel: "Fusion Score",
    basedOn: "Based on Q-CHAT-10 + Facial Vision Analysis",
    scoreBreakdown: "Score Breakdown",
    vision: "Vision",
    behavior: "Behavior",
    fusion: "Fusion",
    cnnWeight: "CNN · 60% weight",
    svmWeight: "SVM · 40% weight",
    formula: "0.6V + 0.4B",
    clinicianSummary: "Clinical Summary",
    generatedBy: "Clinical Summary Engine",
    recommendedCentres: "Recommended Referral Centres (Pakistan)",
    clinicalDisclaimerTitle: "Clinical Disclaimer:",
    clinicalDisclaimerBody: "This AI screening result is for informational purposes only and does not constitute a medical diagnosis. Only a licensed developmental paediatrician or clinical psychologist can provide a formal ASD diagnosis using standardised instruments (ADOS-2, ADI-R) under DSM-5 criteria.",
    backToDashboard: "Back to Dashboard",
    newScreening: "New Screening",
    recommendations: {
      High: {
        title: 'Immediate Specialist Referral Recommended',
        body: 'The AI screening has identified a high probability of ASD indicators. We strongly recommend scheduling an appointment with a developmental paediatrician or a licensed psychologist for a full DSM-5 diagnostic evaluation as soon as possible.'
      },
      Moderate: {
        title: 'Monitoring & Consultation Advised',
        body: 'Some behavioural and visual markers were noted. While not conclusive, we recommend discussing these results with your paediatrician at the next well-child visit. Continue monitoring developmental milestones.'
      },
      Low: {
        title: 'Continue Routine Developmental Monitoring',
        body: 'The screening did not detect significant ASD indicators at this time. Continue regular well-child visits and developmental milestone tracking. Re-screen if new concerns arise.'
      }
    }
  },
  ur: {
    complete: "اسکریننگ مکمل",
    reportTitle: " اسکریننگ رپورٹ",
    screeningId: "اسکریننگ آئی ڈی",
    riskClass: "خطرہ کی درجہ بندی",
    highRisk: "اعلی خطرہ",
    modRisk: "معتدل خطرہ",
    lowRisk: "کم خطرہ",
    fusionScoreLabel: "فیوژن اسکور",
    basedOn: "Q-CHAT-10 + چہرے کے بصری تجزیہ کی بنیاد پر",
    scoreBreakdown: "اسکور کی تفصیل",
    vision: "بصارت",
    behavior: "رویہ",
    fusion: "فیوژن",
    cnnWeight: "CNN · 60% وزن",
    svmWeight: "SVM · 40% وزن",
    formula: "0.6V + 0.4B",
    clinicianSummary: "کلینیکل خلاصہ",
    generatedBy: "کلینیکل خلاصہ انجن",
    recommendedCentres: "تجویز کردہ ریفرل مراکز (پاکستان)",
    clinicalDisclaimerTitle: "طبی دستبرداری:",
    clinicalDisclaimerBody: "یہ اے آئی اسکریننگ کا نتیجہ صرف معلوماتی مقاصد کے لیے ہے اور یہ طبی تشخیص کی حیثیت نہیں رکھتا۔ صرف ایک لائسنس یافتہ ترقیاتی ماہر اطفال یا کلینیکل سائیکالوجسٹ ہی DSM-5 معیار کے تحت معیاری آلات (ADOS-2, ADI-R) کا استعمال کرتے ہوئے باضابطہ آٹزم کی تشخیص فراہم کر سکتا ہے۔",
    backToDashboard: "ڈیش بورڈ پر واپس جائیں",
    newScreening: "نئی اسکریننگ",
    recommendations: {
      High: {
        title: 'فوری طور پر ماہر سے رجوع کرنے کی سفارش کی جاتی ہے',
        body: 'اے آئی اسکریننگ نے آٹزم کے اشاروں کے اعلیٰ امکان کی نشاندہی کی ہے۔ ہم پرزور مشورہ دیتے ہیں کہ جلد از جلد مکمل تشخیصی جائزے کے لیے کسی ماہرِ اطفال یا لائسنس یافتہ سائیکالوجسٹ سے ملاقات طے کریں۔'
      },
      Moderate: {
        title: 'نگرانی اور مشاورت کا مشورہ دیا جاتا ہے',
        body: 'کچھ رویے اور بصری علامات نوٹ کی گئی ہیں۔ اگرچہ یہ حتمی نہیں ہیں، لیکن ہم مشورہ دیتے ہیں کہ اگلے باقاعدہ معائنے پر اپنے ڈاکٹر سے ان نتائج پر بات کریں۔ بچے کی نشوونما کی نگرانی جاری رکھیں۔'
      },
      Low: {
        title: 'نشوونما کی معمول کی نگرانی جاری رکھیں',
        body: 'اسکریننگ میں اس وقت آٹزم کے نمایاں اشارے نہیں پائے گئے۔ بچوں کے باقاعدہ معائنے اور نشوونما کے سنگ میل کی نگرانی جاری رکھیں۔ اگر نئے خدشات پیدا ہوں تو دوبارہ اسکریننگ کریں۔'
      }
    }
  }
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [result, setResult] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('sc_result');
    if (!raw) { navigate('/dashboard'); return; }
    setResult(JSON.parse(raw));
    setTimeout(() => setAnimated(true), 200);
  }, []);

  if (!result) return null;

  const { fusion_score, risk_label, vision_pct, behavior_pct, gemini_summary, pdf_url, screening_id, tracking_id } = result;
  const cfg   = RISK_COLORS[risk_label] || RISK_COLORS.Low;
  const RIcon = cfg.icon;
  const rec   = RECOMMENDATIONS[risk_label] || RECOMMENDATIONS.Low;

  const getRiskLabelText = () => {
    if (risk_label === 'High') return t.highRisk;
    if (risk_label === 'Moderate') return t.modRisk;
    return t.lowRisk;
  };

  const getRecTitle = () => {
    return t.recommendations[risk_label]?.title || t.recommendations.Low.title;
  };

  const getRecBody = () => {
    return t.recommendations[risk_label]?.body || t.recommendations.Low.body;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-12 py-10 animate-fade-in" dir={language === 'ur' ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-brand-600" />
          <span className="text-sm font-semibold text-brand-700 uppercase tracking-wide">{t.complete}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{t.reportTitle}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {t.screeningId}: <span className="font-mono">{tracking_id || `SC-${String(screening_id).padStart(5, '0')}`}</span>
        </p>
      </div>

      {/* Risk banner */}
      <div className={`rounded-2xl border ${cfg.bg} ${cfg.border} p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${cfg.badge}`}>
            <RIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">{t.riskClass}</p>
            <p className={`text-3xl font-bold ${cfg.text}`}>{getRiskLabelText()}</p>
            <p className="text-xs text-slate-500 mt-1">
              {t.fusionScoreLabel}: <strong>{(fusion_score * 100).toFixed(2)}%</strong> — {t.basedOn}
            </p>
          </div>
        </div>
        {pdf_url && (
          <a href={`http://localhost:5001${pdf_url}`} target="_blank" rel="noreferrer"
            className="btn-secondary w-full sm:w-auto flex-shrink-0 text-xs text-center justify-center py-2.5">
            <Download className="w-4 h-4" /> PDF
          </a>
        )}
      </div>

      {/* Score breakdown */}
      <div className="card p-6 mb-6">
        <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-600" /> {t.scoreBreakdown}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center">
          {/* Vision */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <ScoreRing pct={animated ? vision_pct : 0} color="#2e8fe8" size={100} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-brand-700">{vision_pct?.toFixed(2)}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center">
                <Eye className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-xs font-semibold text-slate-700">{t.vision}</span>
              </div>
              <p className="text-xs text-slate-400">{t.cnnWeight}</p>
            </div>
          </div>

          {/* Behavior */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <ScoreRing pct={animated ? behavior_pct : 0} color="#8b5cf6" size={100} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-purple-700">{behavior_pct?.toFixed(2)}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center">
                <Activity className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-semibold text-slate-700">{t.behavior}</span>
              </div>
              <p className="text-xs text-slate-400">{t.svmWeight}</p>
            </div>
          </div>

          {/* Fusion */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <ScoreRing pct={animated ? fusion_score * 100 : 0} color={cfg.ring} size={100} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-lg font-bold ${cfg.text}`}>{(fusion_score * 100).toFixed(2)}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center">
                <Brain className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">{t.fusion}</span>
              </div>
              <p className="text-xs text-slate-400">{t.formula}</p>
            </div>
          </div>
        </div>

        {/* Formula display */}
        <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-mono">
            S<sub>final</sub> = (0.6 × {vision_pct?.toFixed(2)}%) + (0.4 × {behavior_pct?.toFixed(2)}%) = <strong className={cfg.text}>{(fusion_score * 100).toFixed(2)}%</strong>
          </p>
        </div>
      </div>

      {/* Gemini summary */}
      {gemini_summary && (
        <div className="card p-6 mb-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-600" /> {t.clinicianSummary}
            <span className={`text-xs font-normal text-slate-400 ${language === 'ur' ? 'mr-auto' : 'ml-auto'}`}>{t.generatedBy}</span>
          </h2>
          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 rounded-xl p-4 border border-slate-100">
            {gemini_summary}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className={`card p-6 mb-6 border-l-4 ${cfg.border}`}>
        <h2 className="text-base font-bold text-slate-800 mb-2">{getRecTitle()}</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{getRecBody()}</p>

        {rec.centres.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              {t.recommendedCentres}
            </p>
            <div className="space-y-2">
              {rec.centres.map((c) => (
                <div key={c.name} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.full}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs">
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-700 font-medium hover:underline">
                          Website
                        </a>
                      )}
                      {c.map && (
                        <a href={c.map} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-700 font-medium hover:underline">
                          Location Map
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clinical disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>{t.clinicalDisclaimerTitle}</strong> {t.clinicalDisclaimerBody}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/dashboard" className="btn-secondary flex-1 justify-center">
          <RotateCcw className="w-4 h-4" /> {t.backToDashboard}
        </Link>
        <Link to="/screen" className="btn-primary flex-1 justify-center">
          {t.newScreening} <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </div>
  );
}
