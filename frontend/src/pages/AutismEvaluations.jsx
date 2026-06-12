import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, AlertCircle, ArrowRight, Activity, Users, Brain, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import heroImg from '../assets/AUTISM EVALUATIONS hero.jpg';
import toddlerPlayImg from '../assets/Toddler evaluating play.jpg';

const SECTION_STYLE = "max-w-[1400px] mx-auto px-6 sm:px-12 py-20";

function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── DATA CONSTANTS ──────────────────────────────────────────────────────────

const CONTENT = {
  en: {
    disclaimer: "Results and information are purely educational and do not replace professional medical advice.",
    heroTitle: "AUTISM EVALUATIONS",
    heroSubtitle: "Understanding the Spectrum",
    wheelTitle: "The Autism Spectrum Wheel",
    wheelSubtitle: "Autism is not a linear scale from 'low' to 'high.' It is a rich, multi-dimensional spectrum with different areas of strength and support needs.",
    wheelTapPrompt: "Tap a slice",
    wheelSelectPrompt: "Select an area from the wheel to learn more.",
    whatIsTitle: "What is an Autism Evaluation?",
    whatIsDesc: "An autism evaluation is a comprehensive assessment that reviews a child's developmental journey. Clinicians look at communication, play patterns, social interactions, and sensory processing to understand their unique needs.",
    whatIsList: [
      "Evaluating verbal and non-verbal communication skills.",
      "Observing play, social dynamics, and peer interaction.",
      "Assessing repetitive behaviors or specific interests."
    ],
    dsm5Title: "DSM-5 Support Levels",
    dsm5Desc: "Under the Diagnostic and Statistical Manual of Mental Disorders (DSM-5), autism is classified into three support levels based on the degree of assistance a child requires in daily life.",
    socialSupport: "Social Communication",
    restrictiveSupport: "Repetitive Behaviors & Flexibility",
    faqTitle: "Frequently Asked Questions",
    readyTitle: "Ready to start the journey?",
    readyDesc: "Take our validated Q-CHAT-10 screening tool today to understand your child's communication and behavioral markers.",
    ctaBtn: "Take the Autism Screener",
    slices: [
      { id: 1, label: 'Proprioception', color: '#112849', desc: 'Awareness of body position and movement.' },
      { id: 2, label: 'Interoception', color: '#193f70', desc: 'Sensing internal body signals like hunger or temperature.' },
      { id: 3, label: 'Emotional Intensity', color: '#174b88', desc: 'Experiencing emotions very deeply or strongly.' },
      { id: 4, label: 'Communication', color: '#155aa6', desc: 'Unique ways of expressing and understanding language.' },
      { id: 5, label: 'Relationships', color: '#1a71ce', desc: 'Different approaches to socializing and connecting.' },
      { id: 6, label: 'Executive Function', color: '#2e8fe8', desc: 'Planning, organizing, and task management.' },
      { id: 7, label: 'Exteroception', color: '#54aeff', desc: 'Processing external sensory input (sounds, lights).' },
      { id: 8, label: 'SPINs', color: '#8bcaff', desc: 'Deep, passionate focus on specific special interests.' },
      { id: 9, label: 'Stims', color: '#bbdfff', desc: 'Repetitive movements or sounds for self-regulation.' },
    ],
    levels: [
      {
        level: "Level 1: Requiring Support",
        social: "May find it hard to start conversations or join in with others. Might show less interest in playing or socializing.",
        restrictive: "May struggle with changes in routine, switching between activities, or staying organized."
      },
      {
        level: "Level 2: Requiring Substantial Support",
        social: "Noticeable challenges with both talking and nonverbal communication. May respond in limited or unusual ways.",
        restrictive: "Rigid behaviors and trouble with change that interfere with daily life. Repetitive behaviors are more obvious."
      },
      {
        level: "Level 3: Requiring Very Substantial Support",
        social: "Significant difficulties with communication and connecting with others. May use very limited speech to interact.",
        restrictive: "Strong resistance to change, frequent repetitive behaviors, and challenges that affect daily activities in many areas."
      }
    ],
    faqs: [
      {
        q: 'How early can autism be detected?',
        a: 'While early signs often appear before age 2, reliable diagnoses are commonly made between 18 and 30 months. Earlier engagement with screening and evaluation allows families to begin support sooner.'
      },
      {
        q: 'Who conducts an autism evaluation?',
        a: 'A formal diagnosis is provided by a multidisciplinary team, typically including a developmental pediatrician, a child psychologist, and a speech-language pathologist.'
      },
      {
        q: 'What should we do if our screener indicates high markers?',
        a: 'A screening is not a diagnosis. If the result shows high or moderate markers, download the report and share it with your pediatrician to request a comprehensive diagnostic referral.'
      }
    ]
  },
  ur: {
    disclaimer: "نتائج اور معلومات خالص تعلیمی ہیں اور پیشہ ورانہ طبی مشورے کی جگہ نہیں لے سکتی ہیں۔",
    heroTitle: "آٹزم کی تشخیص (Autism Evaluations)",
    heroSubtitle: "اسپیکٹرم کو سمجھنا",
    wheelTitle: "آٹزم اسپیکٹرم پہیہ",
    wheelSubtitle: "آٹزم 'کم' سے 'زیادہ' کا یکطرفہ اسکیل نہیں ہے۔ یہ ایک کثیر جہتی اسپیکٹرم ہے جس میں طاقت اور مدد کی مختلف ضروریات ہوتی ہیں۔",
    wheelTapPrompt: "کسی حصے پر کلک کریں",
    wheelSelectPrompt: "مزید جاننے کے لیے پہیے سے کوئی ایک شعبہ منتخب کریں۔",
    whatIsTitle: "آٹزم کی تشخیص کیا ہے؟",
    whatIsDesc: "آٹزم کی تشخیص ایک جامع جائزہ ہے جو بچے کے نشوونما کے سفر کا جائزہ لیتا ہے۔ معالجین ان کی منفرد ضروریات کو سمجھنے کے لیے مواصلات، کھیلنے کے انداز، سماجی روابط، اور حسی عمل کا معائنہ کرتے ہیں۔",
    whatIsList: [
      "زبانی اور غیر زبانی مواصلاتی مہارتوں کا جائزہ لینا۔",
      "کھیل، سماجی تعلقات اور ساتھیوں کے ساتھ تعامل کا مشاہدہ کرنا۔",
      "بار بار ہونے والے رویوں یا مخصوص دلچسپیوں کا اندازہ لگانا۔"
    ],
    dsm5Title: "DSM-5 کی مدد کے درجات",
    dsm5Desc: "ذہنی عوارض کے تشخیصی اور شماریاتی دستور (DSM-5) کے تحت، آٹزم کو روزمرہ کی زندگی میں درکار مدد کی بنیاد پر تین درجات میں تقسیم کیا گیا ہے۔",
    socialSupport: "سماجی مواصلات",
    restrictiveSupport: "مخصوص رویے اور لچک پذیری",
    faqTitle: "اکثر پوچھے گئے سوالات",
    readyTitle: "سفر شروع کرنے کے لیے تیار ہیں؟",
    readyDesc: "اپنے بچے کے مواصلاتی اور رویے کے اشاروں کو سمجھنے کے لیے آج ہی ہمارا تصدیق شدہ Q-CHAT-10 اسکریننگ ٹول استعمال کریں۔",
    ctaBtn: "آٹزم اسکریننگ شروع کریں",
    slices: [
      { id: 1, label: 'جسمانی آگاہی', color: '#112849', desc: 'جسم کی حالت اور حرکت کے بارے میں آگاہی۔' },
      { id: 2, label: 'اندرونی حسیات', color: '#193f70', desc: 'جسم کے اندرونی سگنلز جیسے بھوک یا درجہ حرارت کو محسوس کرنا۔' },
      { id: 3, label: 'جذباتی شدت', color: '#174b88', desc: 'جذبات کا بہت گہرائی یا شدت سے تجربہ کرنا۔' },
      { id: 4, label: 'مواصلات', color: '#155aa6', desc: 'زبان کے اظہار اور سمجھنے کے منفرد طریقے۔' },
      { id: 5, label: 'تعلقات', color: '#1a71ce', desc: 'سماجی روابط قائم کرنے اور جڑنے کے مختلف طریقے۔' },
      { id: 6, label: 'انتظامی امور', color: '#2e8fe8', desc: 'منصوبہ بندی، ترتیب، اور کاموں کا انتظام کرنا۔' },
      { id: 7, label: 'بیرونی حسیات', color: '#54aeff', desc: 'بیرونی حسی معلومات (آوازیں، روشنیاں) کو پروسیس کرنا۔' },
      { id: 8, label: 'خصوصی دلچسپیاں', color: '#8bcaff', desc: 'مخصوص خصوصی دلچسپیوں پر گہرا اور پرجوش فوکس۔' },
      { id: 9, label: 'خود نظمی اشارے', color: '#bbdfff', desc: 'خود کو پرسکون کرنے کے لیے بار بار کی جانے والی حرکات یا آوازیں۔' },
    ],
    levels: [
      {
        level: "درجہ 1: مدد کی ضرورت",
        social: "دوسروں کے ساتھ بات چیت شروع کرنے میں دشواری ہو سکتی ہے۔ کھیلنے یا سماجی روابط میں کم دلچسپی ظاہر کر سکتے ہیں۔",
        restrictive: "روزمرہ کے معمولات میں تبدیلی، سرگرمیوں کو تبدیل کرنے، یا منظم رہنے میں مشکلات کا سامنا ہو سکتا ہے۔"
      },
      {
        level: "درجہ 2: نمایاں مدد کی ضرورت",
        social: "بولنے اور غیر زبانی مواصلات دونوں میں واضح چیلنجز۔ محدود یا غیر معمولی طریقوں سے جواب دے سکتے ہیں۔",
        restrictive: "سخت رویے اور تبدیلی کے ساتھ دشواری جو روزمرہ کی زندگی میں مداخلت کرتی ہے۔ بار بار ہونے والے رویے زیادہ واضح ہوتے ہیں۔"
      },
      {
        level: "درجہ 3: بہت زیادہ مدد کی ضرورت",
        social: "مواصلات اور دوسروں کے ساتھ جڑنے میں شدید مشکلات۔ بات چیت کرنے کے لیے بہت محدود الفاظ استعمال کر سکتے ہیں۔",
        restrictive: "تبدیلی کے خلاف شدید مزاحمت، بار بار ہونے والے رویے، اور چیلنجز جو بہت سے شعبوں میں روزمرہ کی سرگرمیوں کو متاثر کرتے ہیں۔"
      }
    ],
    faqs: [
      {
        q: 'آٹزم کا جلد سے جلد کب پتہ چل سکتا ہے؟',
        a: 'اگرچہ ابتدائی علامات اکثر 2 سال کی عمر سے پہلے ظاہر ہو جاتی ہیں، لیکن قابل اعتماد تشخیص عام طور پر 18 سے 30 ماہ کے درمیان کی جاتی ہے۔ اسکریننگ اور تشخیص کے ساتھ جلد شمولیت خاندانوں کو جلد مدد شروع کرنے کی اجازت دیتی ہے۔'
      },
      {
        q: 'آٹزم کی تشخیص کون کرتا ہے؟',
        a: 'ایک باضابطہ تشخیص ماہرین کی ایک ٹیم کے ذریعہ فراہم کی جاتی ہے، جس میں عام طور پر ماہر اطفال، بچوں کے ماہر نفسیات، اور گفتار کے معالج شامل ہوتے ہیں۔'
      },
      {
        q: 'اگر ہمارے اسکرینر کے نتائج میں زیادہ علامات ظاہر ہوں تو ہمیں کیا کرنا چاہیے؟',
        a: 'اسکریننگ تشخیص نہیں ہے۔ اگر نتیجہ زیادہ یا درمیانے درجے کے علامات دکھاتا ہے تو، رپورٹ ڈاؤن لوڈ کریں اور جامع تشخیصی معائنے کی درخواست کرنے کے لیے اسے اپنے ماہر اطفال کے ساتھ شیئر کریں۔'
      }
    ]
  }
};

// ── SUBCOMPONENTS ───────────────────────────────────────────────────────────

function Disclaimer() {
  const { language } = useLanguage();
  const t = CONTENT[language];
  return (
    <div className="bg-amber-50 border-y border-amber-200 py-3">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center gap-3 justify-center text-amber-800 text-sm font-medium text-center">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>{t.disclaimer}</p>
      </div>
    </div>
  );
}

function TherapyWheel() {
  const { language } = useLanguage();
  const t = CONTENT[language];
  const [activeSlice, setActiveSlice] = useState(null);
  const size = 300;
  const center = size / 2;
  const radius = 120;
  const slices = t.slices;
  const sliceAngle = 360 / slices.length;

  const createSlicePath = (index) => {
    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    return `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mt-8 mb-16 transform scale-75 sm:scale-100 origin-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible drop-shadow-lg">
          {slices.map((slice, i) => (
            <motion.path
              key={slice.id}
              d={createSlicePath(i)}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              whileHover={{ scale: 1.05, transformOrigin: '50% 50%' }}
              onClick={() => setActiveSlice(slice)}
              onMouseEnter={() => setActiveSlice(slice)}
            />
          ))}
          <circle cx={center} cy={center} r={45} fill="white" className="shadow-inner" />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 text-center">
            <p className="text-[10px] font-bold text-slate-800 leading-tight">
              {activeSlice ? activeSlice.label : t.wheelTapPrompt}
            </p>
          </div>
        </div>

        {slices.map((slice, i) => {
          const midAngle = (i * sliceAngle + sliceAngle / 2 - 90) * (Math.PI / 180);
          const labelRadius = radius + 35;
          const x = center + labelRadius * Math.cos(midAngle);
          const y = center + labelRadius * Math.sin(midAngle);
          
          return (
            <div 
              key={`label-${slice.id}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-100 whitespace-nowrap z-10 transition-all duration-200"
              style={{ 
                left: x, top: y,
                opacity: activeSlice && activeSlice.id !== slice.id ? 0.4 : 1,
                fontWeight: activeSlice?.id === slice.id ? '700' : '500',
                borderColor: activeSlice?.id === slice.id ? slice.color : '#f1f5f9',
                color: activeSlice?.id === slice.id ? slice.color : '#334155'
              }}
            >
              <span className="text-[10px] tracking-wide">{slice.label}</span>
            </div>
          );
        })}
      </div>
      
      <div className="h-24 text-center max-w-md px-4">
        {activeSlice ? (
          <motion.div
            key={activeSlice.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="font-extrabold text-lg mb-1" style={{ color: activeSlice.color }}>
              {activeSlice.label}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">{activeSlice.desc}</p>
          </motion.div>
        ) : (
          <p className="text-slate-400 italic text-sm">{t.wheelSelectPrompt}</p>
        )}
      </div>
    </div>
  );
}

function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-800 pr-4">{f.q}</span>
            {open === i
              ? <ChevronUp className="w-4 h-4 text-brand-600 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            }
          </button>
          <motion.div
            initial={false}
            animate={{ height: open === i ? 'auto' : 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {f.a}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function AutismEvaluations() {
  const { language } = useLanguage();
  const t = CONTENT[language];
  return (
    <div className="bg-white overflow-x-hidden font-sans" dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <Disclaimer />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-20 pb-44 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white overflow-hidden">
        <div className="absolute top-6 left-6 opacity-20 pointer-events-none">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 grayscale" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <FadeIn className="md:w-[55%] text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-md tracking-tight leading-tight">
              {language === 'ur' ? (
                <>
                  آٹزم کی تشخیص{' '}
                  <span dir="ltr" className="inline-block">
                    (Autism Evaluations)
                  </span>
                </>
              ) : (
                t.heroTitle
              )}
            </h1>
            <p className="text-lg md:text-xl text-brand-300 font-semibold tracking-widest uppercase drop-shadow-sm">
              {t.heroSubtitle}
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2} className="md:w-[45%] flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl">
              <div 
                className="absolute inset-0 bg-white/20 animate-pulse"
                style={{ borderRadius: '50% 40% 60% 40% / 40% 60% 50% 50%' }}
              />
              <img 
                src={heroImg} 
                alt="Toddler with therapist" 
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover"
                style={{ borderRadius: '40% 60% 50% 50%' }}
              />
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-0 left-0 w-full leading-none z-20 transform translate-y-[2px]">
          <svg viewBox="0 0 1440 120" className="w-full h-[60px] md:h-[120px] fill-white preserve-3d">
            <path d="M0,64L60,74.7C120,85,240,107,360,101.3C480,96,600,64,720,53.3C840,43,960,53,1080,69.3C1200,85,1320,107,1380,117.3L1440,128L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* ── 2. THE WHEEL ── */}
      <section className={`${SECTION_STYLE} text-center`}>
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">{t.wheelTitle}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-4 text-sm md:text-base">
            {t.wheelSubtitle}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <TherapyWheel />
        </FadeIn>
      </section>

      {/* ── 3. Z-PATTERN A ── */}
      <section className={`${SECTION_STYLE} border-t border-slate-100`}>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <FadeIn>
            <div className="rounded-3xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition-all duration-500 z-10 pointer-events-none" />
              <img 
                src={toddlerPlayImg} 
                alt="Toddler evaluating play" 
                className="w-full h-full object-cover aspect-[640/590] group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="text-3xl font-extrabold text-brand-600 mb-6">{t.whatIsTitle}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm md:text-base">
              {t.whatIsDesc}
            </p>
            <ul className="space-y-4 mb-8">
              {t.whatIsList.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0`} />
                  <span className="text-slate-700 text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* ── 4. DSM-5 LEVELS ── */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">{t.dsm5Title}</h2>
            <p className="text-brand-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed opacity-90">
              {t.dsm5Desc}
            </p>
          </FadeIn>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.levels.map((lvl, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <h3 className="font-extrabold text-lg text-brand-300 mb-4">{lvl.level}</h3>
                
                <div className="mb-4">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">{t.socialSupport}</span>
                  <p className="text-sm text-brand-50 leading-relaxed">{lvl.social}</p>
                </div>
                
                <div>
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">{t.restrictiveSupport}</span>
                  <p className="text-sm text-brand-50 leading-relaxed">{lvl.restrictive}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ACCORDION ── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">{t.faqTitle}</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <FaqAccordion faqs={t.faqs} />
          </FadeIn>
        </div>
      </section>

      {/* ── 6. CTA SECTION ── */}
      <section className="bg-gradient-to-r from-brand-800 to-brand-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)]" style={{ backgroundSize: '24px 24px' }} />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-sm">
              {t.readyTitle}
            </h2>
            <p className="text-brand-50 text-sm md:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.readyDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/screen"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white text-brand-850 font-bold px-8 py-4 rounded-2xl hover:bg-brand-50 transition-all shadow-xl hover:-translate-y-0.5 text-sm"
              >
                {t.ctaBtn} <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
