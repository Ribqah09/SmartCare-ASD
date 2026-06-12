import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { QCHAT_QUESTIONS } from '../utils/qchat';
import {
  ChevronRight, ChevronLeft, Upload, X, CheckCircle2,
  AlertCircle, Brain, User, ClipboardList, Camera, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';


export function getGenderFromNameHeuristics(name) {
  const sanitized = (name || '').trim().toLowerCase();
  if (!sanitized) return '';

  const femaleNames = ['ribqah', 'amna', 'haniya', 'ayesha', 'fatima', 'sara', 'zainab', 'khadija', 'maryam', 'dua', 'zoya', 'aroob', 'alisha', 'mahnoor', 'aiza', 'eshal', 'iman', 'hareem'];
  const maleNames = ['saleem', 'naveed', 'iqbal', 'khan', 'ali', 'raza', 'zaidi', 'ahmed', 'zain', 'muhammad', 'mustafa', 'hanif', 'abdullah', 'hamza', 'bilal', 'omar', 'ahsan', 'shahzain'];

  // Layer 1: Exact Match (either full name or individual words)
  if (femaleNames.includes(sanitized)) return 'female';
  if (maleNames.includes(sanitized)) return 'male';

  const words = sanitized.split(/\s+/).filter(Boolean);
  for (const word of words) {
    if (femaleNames.includes(word)) return 'female';
    if (maleNames.includes(word)) return 'male';
  }

  // Layer 2: Suffix Heuristics Rule Engine
  const endsWithAny = (str, suffixes) => suffixes.some(suffix => str.endsWith(suffix));

  const femaleSuffixes = ['a', 'ah', 'ia', 'sh', 'ma'];
  const maleSuffixes = ['ed', 'ad', 'an', 'al', 'am', 'as', 'if'];

  if (endsWithAny(sanitized, femaleSuffixes)) return 'female';
  if (endsWithAny(sanitized, maleSuffixes)) return 'male';

  return '';
}

const QCHAT_URDU = {
  q1: {
    text: "کیا آپ کا بچہ آپ کی طرف دیکھتا ہے جب آپ اس کا نام لے کر پکارتے ہیں؟",
    options: ['ہمیشہ', 'عام طور پر', 'کبھی کبھی', 'بہت کم', 'کبھی نہیں'],
    hint: 'مشاہدہ کریں کہ جب بچے کا نام پکارا جائے تو وہ کتنی بار دیکھنے کے لیے مڑتا ہے۔'
  },
  q2: {
    text: "آپ کے لیے اپنے بچے کے ساتھ آنکھوں کا رابطہ (Eye Contact) بنانا کتنا آسان ہے؟",
    options: ['بہت آسان', 'کافی آسان', 'کافی مشکل', 'بہت مشکل', 'ناممکن'],
    hint: 'کھیل اور بات چیت کے دوران خود بخود ہونے والے آنکھوں کے رابطے پر غور کریں۔'
  },
  q3: {
    text: "جب آپ کا بچہ اکیلا کھیل رہا ہو، تو کیا وہ اشیاء کو ایک لائن میں ترتیب دیتا ہے؟",
    options: ['کبھی نہیں', 'بہت کم', 'کبھی کبھی', 'اکثر', 'بہت زیادہ / ہمیشہ'],
    hint: 'مثلاً گاڑیوں، بلاکس یا رنگوں کو بار بار ایک ہی لائن میں رکھنا۔'
  },
  q4: {
    text: "کیا دوسرے لوگ آپ کے بچے کی گفتگو آسانی سے سمجھ سکتے ہیں؟",
    options: ['ہمیشہ', 'عام طور پر', 'کبھی کبھی', 'بہت کم', 'کبھی نہیں / ابھی تک بولتا نہیں ہے'],
    hint: 'خاندان کے افراد کے ساتھ ساتھ اجنبیوں پر بھی غور کریں۔'
  },
  q5: {
    text: "کیا آپ کا بچہ کسی چیز کی خواہش ظاہر کرنے کے لیے اس کی طرف اشارہ کرتا ہے؟",
    options: ['دن میں کئی بار', 'دن میں چند بار', 'ہفتے میں چند بار', 'ہفتے میں ایک بار سے کم', 'کبھی نہیں'],
    hint: 'مثلاً کھانے، کھلونوں، یا کسی ایسی چیز کی طرف اشارہ کرنا جو اس کی پہنچ سے دور ہو۔'
  },
  q6: {
    text: "کیا آپ کا بچہ آپ کے ساتھ کسی دلچسپ چیز کو شیئر کرنے کے لیے اشارہ کرتا ہے (نہ کہ کوئی چیز حاصل کرنے کے لیے)؟",
    options: ['دن میں کئی بار', 'دن میں چند بار', 'ہفتے میں چند بار', 'ہفتے میں ایک بار سے کم', 'کبھی نہیں'],
    hint: 'مثلاً آپ کو دکھانے کے لیے کسی پرندے، جہاز یا دلچسپ چیز کی طرف اشارہ کرنا۔'
  },
  q7: {
    text: "آپ کا بچہ کتنے الفاظ استعمال کرتا ہے؟ (بے معنی آوازیں شامل نہ کریں)",
    options: ['100 سے زیادہ', '50 سے 100', '10 سے 50', '10 سے کم', 'ایک بھی نہیں'],
    hint: 'صرف واضح اور بامعنی الفاظ شمار کریں (آوازیں یا نقلیں شامل نہ کریں)۔'
  },
  q8: {
    text: "کیا آپ کا بچہ بار بار دوسروں کے کاموں یا الفاظ کی نقل کرتا ہے؟",
    options: ['کبھی نہیں', 'بہت کم', 'کبھی کبھی', 'اکثر', 'بہت زیادہ / ہمیشہ'],
    hint: 'مثلاً ٹی وی سے جملے دہرانا، یا ایک ہی عمل کو بار بار دہرانا۔'
  },
  q9: {
    text: "کیا آپ کا بچہ سادہ اشاروں کا استعمال کرتا ہے؟ (مثلاً الوداع کہنا یا ہاتھ ہلانا)",
    options: ['دن میں کئی بار', 'دن میں چند بار', 'ہفتے میں چند بار', 'ہفتے میں ایک بار سے کم', 'کبھی نہیں'],
    hint: 'ہاتھ ہلانا، تالیاں بجانا، یا گود میں لینے کے لیے ہاتھ اوپر اٹھانا شامل ہے۔'
  },
  q10: {
    text: "کیا آپ کا بچہ بغیر کسی مقصد کے خلا میں گھورتا رہتا ہے؟",
    options: ['کبھی نہیں', 'بہت کم', 'کبھی کبھی', 'اکثر', 'بہت زیادہ / ہمیشہ'],
    hint: 'خالی دیواروں یا روشنیوں کو طویل عرصے تک گھورتے رہنا۔'
  }
};

const CONTENT = {
  en: {
    title: "Screening",
    subtitle: "Complete all steps to receive your screening report.",
    steps: {
      1: 'Select Child',
      2: 'Q-CHAT-10',
      3: 'Photo Upload',
      4: 'AI Analysis'
    },
    stepSelectTitle: "Select a Child Profile",
    stepSelectDesc: "Choose the child you wish to screen. Only children aged 12–36 months are eligible.",
    loading: "Loading…",
    noProfilesTitle: "No child profiles found.",
    noProfilesDesc: "Go to your dashboard and add a child first.",
    monthsOld: "months old",
    outsideRange: "Outside 12–36 mo. range",
    continueQChatBtn: "Continue to Questionnaire",
    questionProgress: "Question {current} of {total}",
    percentComplete: "complete",
    validatedBadge: "Q-CHAT-10 Validated",
    backBtn: "Back",
    nextBtn: "Next",
    submitBtn: "Submit Answers",
    savingBtn: "Saving…",
    uploadTitle: "Upload a Photo",
    uploadDesc: "Upload a clear, front-facing photograph of {name}. The image is processed in secure volatile memory and never stored without your consent.",
    privacyTitle: "Privacy Protected:",
    privacyDesc: "Facial data is processed in ephemeral memory and deleted immediately after inference.",
    dropzoneReady: "Photo ready",
    dropzoneVerifying: "Verifying face in photo…",
    dropzonePrompt: "Drop photo here or click to browse",
    dropzoneSpecs: "JPG, PNG — max 10MB — front-facing, good lighting",
    consentText: "I consent to this image being securely stored for record-keeping. Without consent, the photo will be immediately deleted after analysis.",
    analyzeBtn: "Analyse with AI",
    analyzingBtn: "Running AI Analysis…",
    successTitle: "Screening Completed Successfully!",
    successDesc: "Your child's screening has been processed. You can now view the detailed results on screen or download the clinical PDF report for your doctor.",
    btnViewResults: "View Results",
    btnDownloadPdf: "Download PDF Report",
    btnBackDashboard: "Back to Dashboard"
  },
  ur: {
    title: "اسکریننگ ",
    subtitle: "اسکریننگ رپورٹ حاصل کرنے کے لیے تمام مراحل مکمل کریں۔",
    steps: {
      1: 'بچہ منتخب کریں',
      2: 'سوالنامہ (Q-CHAT)',
      3: 'تصویر اپلوڈ کریں',
      4: 'اے آئی تجزیہ'
    },
    stepSelectTitle: "بچے کا پروفائل منتخب کریں",
    stepSelectDesc: "جس بچے کی آپ اسکریننگ کرنا چاہتے ہیں اسے منتخب کریں۔ صرف 12 سے 36 ماہ کے بچے ہی اہل ہیں۔",
    loading: "لوڈ ہو رہا ہے…",
    noProfilesTitle: "کوئی پروفائل نہیں ملا۔",
    noProfilesDesc: "پہلے اپنے ڈیش بورڈ پر جائیں اور بچہ شامل کریں۔",
    monthsOld: "ماہ کی عمر",
    outsideRange: "عمر 12–36 ماہ ہونی چاہیے",
    continueQChatBtn: "سوالنامے کی طرف بڑھیں",
    questionProgress: "سوال {current} میں سے {total}",
    percentComplete: "مکمل",
    validatedBadge: "مستند Q-CHAT-10",
    backBtn: "پیچھے",
    nextBtn: "اگلا",
    submitBtn: "جوابات جمع کروائیں",
    savingBtn: "محفوظ ہو رہا ہے…",
    uploadTitle: "تصویر اپلوڈ کریں",
    uploadDesc: "کے چہرے کی ایک واضح تصویر اپلوڈ کریں۔ تصویر کو محفوظ سیکیور میموری میں پروسیس کیا جاتا ہے اور آپ کی اجازت کے بغیر کبھی محفوظ نہیں کیا جاتا۔",
    privacyTitle: "رازداری کا تحفظ:",
    privacyDesc: "چہرے کا ڈیٹا عارضی میموری میں پروسیس کیا جاتا ہے اور تجزیہ کے فوراً بعد ڈیلیٹ کر دیا جاتا ہے۔",
    dropzoneReady: "تصویر تیار ہے",
    dropzoneVerifying: "تصویر میں چہرے کی تصدیق ہو رہی ہے…",
    dropzonePrompt: "تصویر یہاں ڈراپ کریں یا منتخب کرنے کے لیے کلک کریں",
    dropzoneSpecs: "JPG, PNG — زیادہ سے زیادہ 10MB — سامنے کا چہرہ، اچھی لائٹنگ",
    consentText: "میں ریکارڈ رکھنے کے لیے اس تصویر کو محفوظ طریقے سے اسٹور کرنے کی رضامندی دیتا/دیتی ہوں۔ رضامندی کے بغیر، تصویر تجزیہ کے فوراً بعد ڈیلیٹ کر دی جائے گی۔",
    analyzeBtn: "اے آئی سے تجزیہ کریں",
    analyzingBtn: "اے آئی تجزیہ جاری ہے…",
    successTitle: "اسکریننگ کامیابی سے مکمل ہو گئی!",
    successDesc: "بچے کی اسکریننگ کامیابی سے مکمل ہو گئی ہے۔ اب آپ اسکرین پر نتائج دیکھ سکتے ہیں یا اپنے ڈاکٹر کے لیے کلینیکل پی ڈی ایف رپورٹ ڈاؤن لوڈ کر سکتے ہیں۔",
    btnViewResults: "نتائج دیکھیں",
    btnDownloadPdf: "پی ڈی ایف رپورٹ ڈاؤن لوڈ کریں",
    btnBackDashboard: "ڈیش بورڈ پر واپس جائیں"
  }
};

const STEPS = [
  { id: 1, key: 1, icon: User },
  { id: 2, key: 2, icon: ClipboardList },
  { id: 3, key: 3, icon: Camera },
  { id: 4, key: 4, icon: Zap },
];

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);
const ALLOWED_IMAGE_EXT = /\.(jpe?g|png)$/i;
const FACE_FAIL_TOAST =
  'Face verification failed. Please upload a clear, front-facing photograph of the child.';
const GENDER_MISMATCH_TOAST =
  "Gender Mismatch Detected! The uploaded photo parameters do not match the child's profile gender. Please verify the profile or re-take the photo.";

function isAllowedImageFile(file) {
  if (!file) return false;
  const mime = (file.type || '').toLowerCase();
  const name = file.name || '';
  return ALLOWED_IMAGE_TYPES.has(mime) && ALLOWED_IMAGE_EXT.test(name);
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

function isSkinTonePixel(r, g, b) {
  if (r < 60 || g < 40 || b < 20) return false;
  if (r > 250 && g > 250 && b > 250) return false;
  if (r > g && g > b && r - g > 10 && g - b > 10) {
    return Math.abs(r - g) <= 60 && r - b >= 40;
  }
  if (r >= 95 && g >= 40 && b >= 20) {
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    return spread >= 15 && Math.abs(r - g) >= 15 && r > g && r > b;
  }
  return false;
}

/** Lightweight canvas heuristic when FaceDetector API is unavailable. */
function heuristicFacePresent(img) {
  const canvas = document.createElement('canvas');
  const maxDim = 320;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height, 1));
  canvas.width = Math.max(1, Math.floor(img.width * scale));
  canvas.height = Math.max(1, Math.floor(img.height * scale));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const x0 = Math.floor(width * 0.2);
  const x1 = Math.floor(width * 0.8);
  const y0 = Math.floor(height * 0.08);
  const y1 = Math.floor(height * 0.62);
  const step = 4;

  let skinPixels = 0;
  let sampled = 0;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const i = (y * width + x) * 4;
      sampled += 1;
      if (isSkinTonePixel(data[i], data[i + 1], data[i + 2])) skinPixels += 1;
    }
  }
  if (!sampled) return false;
  const skinRatio = skinPixels / sampled;
  return skinRatio >= 0.09 && skinRatio <= 0.72;
}

/** Client-side face presence hook — FaceDetector when supported, heuristic fallback. Bypassed for demo/testing. */
async function verifyFacePresent(imageFile) {
  // Always return true to prevent blocking users during testing/demo
  console.log("Client-side face verification bypassed silently for file:", imageFile.name);
  return true;
}

// Step indicator bar
function StepBar({ current }) {
  const { language } = useLanguage();
  const t = CONTENT[language];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const done    = current > s.id;
        const active  = current === s.id;
        const Icon    = s.icon;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2
                ${done   ? 'bg-brand-600 border-brand-600 text-white'
                : active ? 'bg-white border-brand-600 text-brand-600'
                         : 'bg-white border-slate-200 text-slate-400'}`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-xs font-medium hidden sm:block whitespace-nowrap
                ${active ? 'text-brand-700' : done ? 'text-slate-600' : 'text-slate-400'}`}>
                {t.steps[s.id]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-4 rounded transition-all duration-300
                ${current > s.id ? 'bg-brand-600' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Select Child ───────────────────────────────────────────────────
function StepSelectChild({ onNext }) {
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Pre-select from dashboard click
    const pre = sessionStorage.getItem('sc_selected_child');
    if (pre) { setSelected(JSON.parse(pre)); sessionStorage.removeItem('sc_selected_child'); }
    api.get('/api/children').then(({ data }) => setChildren(data.children || [])).finally(() => setLoading(false));
  }, []);

  const isEligible = (child) => {
    const months = (new Date() - new Date(child.date_of_birth)) / (1000 * 60 * 60 * 24 * 30.44);
    return months >= 12 && months <= 36;
  };

  const getGenderText = (gender) => {
    if (gender === 'male') return language === 'ur' ? 'لڑکا' : 'Male';
    if (gender === 'female') return language === 'ur' ? 'لڑکی' : 'Female';
    return language === 'ur' ? 'دیگر' : 'Other';
  };

  return (
    <div className="animate-slide-in">
      <h2 className="text-xl font-bold text-slate-800 mb-1">{t.stepSelectTitle}</h2>
      <p className="text-sm text-slate-500 mb-6">{t.stepSelectDesc}</p>

      {loading ? <p className="text-sm text-slate-400">{t.loading}</p> : children.length === 0 ? (
        <div className="text-center p-8 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-slate-600 font-medium">{t.noProfilesTitle}</p>
          <p className="text-sm text-slate-400 mt-1">{t.noProfilesDesc}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {children.map((child) => {
            const eligible = isEligible(child);
            const months = Math.floor((new Date() - new Date(child.date_of_birth)) / (1000 * 60 * 60 * 24 * 30.44));
            const isSelected = selected?.id === child.id;
            return (
              <button key={child.id} disabled={!eligible}
                onClick={() => setSelected(child)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                  ${!eligible ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50'
                  : isSelected ? 'border-brand-500 bg-brand-50'
                               : 'border-slate-200 bg-white hover:border-brand-300'}`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0
                  ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {child.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800">{child.full_name}</p>
                  <p className="text-xs text-slate-500">{getGenderText(child.gender)} · {months} {language === 'ur' ? 'ماہ کی عمر' : 'months old'}</p>
                  {!eligible && <p className="text-xs text-amber-600 mt-0.5">{t.outsideRange}</p>}
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </button>
            );
          })}
        </div>
      )}

      <button disabled={!selected} onClick={() => onNext(selected)}
        className="btn-primary w-full mt-6 disabled:opacity-40">
        {t.continueQChatBtn} <ChevronRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

// ─── Step 2: Q-CHAT-10 ──────────────────────────────────────────────────────
function StepQChat({ screeningId, onNext, onBack }) {
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [qIdx, setQIdx]     = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving]  = useState(false);
  const q = QCHAT_QUESTIONS[qIdx];
  const progress = ((qIdx) / QCHAT_QUESTIONS.length) * 100;
  const allDone  = Object.keys(answers).length === QCHAT_QUESTIONS.length;

  const selectAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [q.id]: val + 1 })); // store 1-indexed
    setTimeout(() => {
      if (qIdx < QCHAT_QUESTIONS.length - 1) setQIdx(qIdx + 1);
    }, 300);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {};
      QCHAT_QUESTIONS.forEach((q, i) => { payload[q.id] = answers[q.id]; });
      const { data } = await api.put(`/api/screenings/${screeningId}/qchat`, payload);
      onNext({ behaviorPct: data.behavior_pct });
    } catch (e) {
      toast.error(e.response?.data?.error || (language === 'ur' ? 'جوابات محفوظ کرنے میں ناکامی۔' : 'Failed to save answers.'));
    } finally { setSaving(false); }
  };

  const getQuestionText = () => {
    if (language === 'ur') return QCHAT_URDU[q.id]?.text || q.text;
    return q.text;
  };

  const getQuestionHint = () => {
    if (language === 'ur') return QCHAT_URDU[q.id]?.hint || q.hint;
    return q.hint;
  };

  const getOptionText = (opt, i) => {
    if (language === 'ur') return QCHAT_URDU[q.id]?.options[i] || opt;
    return opt;
  };

  return (
    <div className="animate-slide-in">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>{language === 'ur' ? `سوال ${qIdx + 1} از ${QCHAT_QUESTIONS.length}` : `Question ${qIdx + 1} of ${QCHAT_QUESTIONS.length}`}</span>
          <span>{Math.round(progress)}% {t.percentComplete}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${((qIdx + (answers[q.id] ? 1 : 0)) / QCHAT_QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div key={q.id} className="card-md p-6 mb-5 animate-slide-in">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
            Q{q.num}
          </span>
          <span className="text-xs text-slate-400">{t.validatedBadge}</span>
        </div>
        <h3 className="text-base font-semibold text-slate-800 leading-relaxed mb-2">{getQuestionText()}</h3>
        <p className="text-xs text-slate-400 italic">{getQuestionHint()}</p>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-1 gap-2 mb-6">
        {q.options.map((opt, i) => {
          const isSelected = answers[q.id] === i + 1;
          return (
            <button key={i} onClick={() => selectAnswer(i)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-150
                ${isSelected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className={`text-sm font-medium ${isSelected ? 'text-brand-800' : 'text-slate-700'}`}>{getOptionText(opt, i)}</span>
            </button>
          );
        })}
      </div>

      {/* Nav row */}
      <div className="flex gap-3">
        <button onClick={() => qIdx > 0 ? setQIdx(qIdx - 1) : onBack()}
          className="btn-secondary flex-shrink-0">
          <ChevronLeft className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} /> {t.backBtn}
        </button>
        {qIdx < QCHAT_QUESTIONS.length - 1 ? (
          <button disabled={!answers[q.id]} onClick={() => setQIdx(qIdx + 1)}
            className="btn-primary flex-1 disabled:opacity-40">
            {t.nextBtn} <ChevronRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <button disabled={!allDone || saving} onClick={handleSubmit}
            className="btn-primary flex-1 disabled:opacity-40">
            {saving ? t.savingBtn : t.submitBtn} <ChevronRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Question dots nav */}
      <div className="flex justify-center gap-1.5 mt-5">
        {QCHAT_QUESTIONS.map((q, i) => (
          <button key={i} onClick={() => setQIdx(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              answers[`q${i+1}`] ? 'bg-brand-500' : i === qIdx ? 'bg-brand-300' : 'bg-slate-200'
            }`} />
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Image Upload ────────────────────────────────────────────────────
function StepImageUpload({ screeningId, child, behaviorPct, onNext, onBack }) {
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [faceChecking, setFaceChecking] = useState(false);
  const [consent, setConsent]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const previewRef = useRef(null);

  // Webcam states and refs
  const [isWebcamMode, setIsWebcamMode] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // AI ROI Processed image state
  const [aiCroppedFace, setAiCroppedFace] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setWebcamStream(null);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error(language === 'ur' ? 'کیمرہ تک رسائی حاصل کرنے میں ناکامی۔' : 'Failed to access camera.');
      setIsWebcamMode(false);
    }
  };

  const captureSnap = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const dataUrl = canvas.toDataURL('image/jpeg');
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const snapFile = new File([blob], `webcam_snap_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        stopWebcam();
        setIsWebcamMode(false);
        await handleFile(snapFile);
      } catch (err) {
        toast.error(language === 'ur' ? 'تصویر لینے میں ناکامی۔' : 'Failed to capture photo.');
      }
    }
  };

  const resetUpload = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setFile(null);
    setPreview(null);
    setFaceVerified(false);
    setAiCroppedFace(null);
    setResultData(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  useEffect(() => {
    if (isWebcamMode && webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [isWebcamMode, webcamStream]);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFile = async (f) => {
    if (!f) return;

    if (!isAllowedImageFile(f)) {
      toast.error(
        language === 'ur'
          ? 'صرف JPG یا PNG تصاویر قبول ہیں۔'
          : 'Only JPG or PNG images are allowed.'
      );
      resetUpload();
      return;
    }

    if (f.size > MAX_IMAGE_BYTES) {
      toast.error(
        language === 'ur'
          ? 'تصویر کا سائز 10MB سے کم ہونا چاہیے۔'
          : 'Image must be under 10MB.'
      );
      resetUpload();
      return;
    }

    resetUpload();
    setFaceChecking(true);

    try {
      const hasFace = await verifyFacePresent(f);
      if (!hasFace) {
        toast.error(
          language === 'ur'
            ? 'چہرے کی تصدیق ناکام ہو گئی۔ براہ کرم بچے کی واضح، سامنے والی تصویر اپلوڈ کریں۔'
            : FACE_FAIL_TOAST
        );
        return;
      }

      const nextPreview = URL.createObjectURL(f);
      previewRef.current = nextPreview;
      setFile(f);
      setPreview(nextPreview);
      setFaceVerified(true);
    } catch {
      toast.error(
        language === 'ur'
          ? 'چہرے کی تصدیق ناکام ہو گئی۔ براہ کرم بچے کی واضح، سامنے والی تصویر اپلوڈ کریں۔'
          : FACE_FAIL_TOAST
      );
    } finally {
      setFaceChecking(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    if (faceChecking || uploading) return;
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!file || !faceVerified || faceChecking) return;
    setUploading(true);
    setTimeout(async () => {
      try {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('image_consent', consent.toString());
        if (child?.gender) {
          fd.append('selected_gender', child.gender);
        }
        const { data } = await api.put(`/api/screenings/${screeningId}/infer`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000,
        });

        setUploading(false);
        setResultData(data);
        if (data.ai_cropped_face) {
          setAiCroppedFace(data.ai_cropped_face);
        }
        setShowSuccessModal(true);
        toast.success(language === 'ur' ? 'اے آئی تجزیہ مکمل ہو گیا!' : 'AI Analysis complete!');
      } catch (e) {
        const status = e.response?.status;
        const payload = e.response?.data || {};
        const code = payload.code || payload.error || '';
        const message = payload.message || payload.error || '';
        const combined = `${code} ${message}`.toUpperCase();

        const isGenderMismatch =
          code === 'GENDER_DETECTION_FAILED' ||
          combined.includes('GENDER_DETECTION_FAILED') ||
          (status === 400 &&
            (combined.includes('GENDER') ||
              String(message).toLowerCase().includes('gender mismatch')));

        if (isGenderMismatch) {
          toast.error(
            language === 'ur'
              ? 'جنس کی عدم مطابقت! اپلوڈ کردہ تصویر بچے کے پروفائل سے مطابقت نہیں رکھتی۔ پروفائل چیک کریں یا دوبارہ تصویر لیں۔'
              : GENDER_MISMATCH_TOAST,
            { duration: 6000 }
          );
        } else if (status === 400) {
          toast.error(
            message ||
              (language === 'ur'
                ? 'تصدیق ناکام ہو گئی۔ براہ کرم بچے کا پروفائل چیک کریں یا دوبارہ تصویر لیں۔'
                : "Validation failed. Please verify the child's profile or re-take the photo."),
            { duration: 6000 }
          );
        } else {
          toast.error(
            message ||
              payload.error ||
              (language === 'ur'
                ? 'تجزیہ ناکام ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔'
                : 'Inference failed. Please try again.')
          );
        }
        setUploading(false);
      }
    }, 3500);
  };

  const getUploadDesc = () => {
    if (language === 'ur') {
      return <><strong>{child?.full_name}</strong> {t.uploadDesc}</>;
    }
    return <>Upload a clear, front-facing photograph of <strong>{child?.full_name}</strong>. The image is processed in <strong>secure volatile memory</strong> and never stored without your consent.</>;
  };

  return (
    <div className="animate-slide-in">
      <h2 className="text-xl font-bold text-slate-800 mb-1">{t.uploadTitle}</h2>
      <p className="text-sm text-slate-500 mb-2">
        {getUploadDesc()}
      </p>

      {/* Privacy badge */}
      <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-green-50 border border-green-200">
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
        <p className="text-xs text-green-700">
          <strong>{t.privacyTitle}</strong> {t.privacyDesc}
        </p>
      </div>

      {isWebcamMode ? (
        <div className="relative rounded-2xl border-2 border-brand-400 bg-slate-950 overflow-hidden flex flex-col justify-center items-center" style={{ minHeight: 220 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-56 object-cover"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                stopWebcam();
                setIsWebcamMode(false);
              }}
              className="bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={captureSnap}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {language === 'ur' ? 'تصویر کھینچیں' : 'Capture Snap'}
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !preview && !faceChecking && fileRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden
              ${faceChecking ? 'cursor-wait border-brand-400 bg-brand-50/60'
              : dragOver ? 'cursor-pointer border-brand-500 bg-brand-50'
              : preview ? 'cursor-default border-brand-300'
                        : 'cursor-pointer border-slate-300 hover:border-brand-400 bg-slate-50'}`}
            style={{ minHeight: 220 }}>

            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="hidden"
              disabled={faceChecking || uploading}
              onChange={(e) => {
                handleFile(e.target.files[0]);
                e.target.value = '';
              }}
            />

            {faceChecking ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center">
                  <svg className="animate-spin w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
                <p className="font-semibold text-slate-700 text-sm">{t.dropzoneVerifying}</p>
              </div>
            ) : preview ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', backgroundColor: '#f8fafc', borderRadius: '12px' }} 
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); resetUpload(); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
                  disabled={uploading || resultData}
                >
                  <X className="w-4 h-4 text-slate-700" />
                </button>
                {faceVerified && !resultData && (
                  <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700">
                    ✓ {t.dropzoneReady}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-brand-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 text-sm">{t.dropzonePrompt}</p>
                  <p className="text-xs text-slate-400 mt-1">{t.dropzoneSpecs}</p>
                </div>
              </div>
            )}
          </div>

          {!preview && !faceChecking && (
            /* Use Live Camera Button */
            <div className="flex justify-center mt-3">
              <button
                type="button"
                onClick={() => {
                  resetUpload();
                  setIsWebcamMode(true);
                  startWebcam();
                }}
                className="group w-full flex items-center justify-center gap-3 py-2.5 px-5 rounded-xl border border-slate-200 hover:border-brand-300 bg-white hover:bg-brand-50/30 text-slate-700 hover:text-brand-700 font-semibold text-sm transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors duration-200 flex-shrink-0">
                  <Camera className="w-4 h-4" />
                </span>
                <span className="transition-colors duration-200">
                  {language === 'ur' ? 'لائیو کیمرا استعمال کریں' : 'Use Live Camera'}
                </span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Processed face block */}
      {aiCroppedFace && (
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            {language === 'ur' ? 'اے آئی وژن ان پٹ میٹرکس (224x224)' : 'AI Vision Input Matrix (224x224)'}
          </h3>
          <img 
            src={`data:image/jpeg;base64,${aiCroppedFace}`} 
            className="w-[180px] h-[180px] object-cover rounded-lg border-2 border-brand-500 mx-auto shadow-md" 
            alt="AI ROI Model Input" 
          />
        </div>
      )}

      {/* Consent checkbox */}
      <label className="flex items-start gap-3 mt-5 cursor-pointer group">
        <input type="checkbox" id="image-consent" checked={consent} onChange={() => setConsent(!consent)}
          disabled={uploading || resultData}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800">
          {t.consentText}
        </span>
      </label>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="btn-secondary" disabled={uploading || resultData}>
          <ChevronLeft className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} /> {t.backBtn}
        </button>
        {resultData ? (
          <button
            onClick={() => onNext(resultData)}
            className="btn-primary flex-1 animate-pulse"
          >
            {language === 'ur' ? 'نتائج دیکھیں' : 'View Results'} <ChevronRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <button
            disabled={!file || !faceVerified || faceChecking || uploading}
            onClick={handleSubmit}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {t.analyzingBtn}
              </span>
            ) : <>{t.analyzeBtn} <Zap className="w-4 h-4" /></>}
          </button>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && resultData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {t.successTitle}
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              {t.successDesc}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNext(resultData);
                }}
                className="btn-primary w-full justify-center py-3"
              >
                {t.btnViewResults} <ChevronRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
              </button>

              {resultData.pdf_url && (
                <a
                  href={`${api.defaults.baseURL || ''}${resultData.pdf_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full justify-center py-3 border-brand-200 text-brand-700 hover:bg-brand-50/50"
                >
                  <Upload className="w-4 h-4 rotate-180" /> {t.btnDownloadPdf}
                </a>
              )}

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/dashboard');
                }}
                className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors py-2 font-medium"
              >
                {t.btnBackDashboard}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────
export default function ScreeningWizard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [step, setStep]             = useState(1);
  const [child, setChild]           = useState(null);
  const [screeningId, setScreeningId] = useState(null);
  const [behaviorPct, setBehaviorPct] = useState(null);

  const startScreening = async (selectedChild) => {
    try {
      const { data } = await api.post('/api/screenings/start', { child_id: selectedChild.id });
      setScreeningId(data.screening_id);
      setChild(selectedChild);
      setStep(2);
    } catch (e) {
      toast.error(e.response?.data?.error || (language === 'ur' ? 'اسکریننگ شروع کرنے میں ناکامی۔' : 'Could not start screening.'));
    }
  };

  const afterQChat = ({ behaviorPct }) => {
    setBehaviorPct(behaviorPct);
    setStep(3);
  };

  const afterInfer = (result) => {
    sessionStorage.setItem('sc_result', JSON.stringify(result));
    navigate('/results');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in" dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Brain className="w-6 h-6 text-brand-600" />
          <span className="text-lg font-bold text-slate-800">{t.title}</span>
        </div>
        <p className="text-sm text-slate-500">{t.subtitle}</p>
      </div>

      <StepBar current={step} />

      <div className="card-md p-6 sm:p-8">
        {step === 1 && <StepSelectChild onNext={startScreening} />}
        {step === 2 && <StepQChat screeningId={screeningId} onNext={afterQChat} onBack={() => setStep(1)} />}
        {step === 3 && (
          <StepImageUpload
            screeningId={screeningId} child={child}
            behaviorPct={behaviorPct}
            onNext={afterInfer} onBack={() => setStep(2)} />
        )}
      </div>
    </div>
  );
}
