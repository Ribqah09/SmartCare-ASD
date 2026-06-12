import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, AlertCircle, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import speechTherapyImg from '../assets/SPEECH THERAPY.jpg';
import heroImg from '../assets/SPEECH & LANGUAGE THERAPY hero.jpg';
import helpsAsdImg from '../assets/Helps ASD.jpg';

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
    heroTitle: "SPEECH & LANGUAGE THERAPY",
    heroSubtitle: "Enhancing Communication",
    wheelTitle: "The Communication Wheel",
    wheelSubtitle: "Speech therapy encompasses a wide range of developmental areas to support your child's communication needs.",
    wheelTapPrompt: "Tap a slice",
    wheelSelectPrompt: "Select an area from the wheel to learn more.",
    whatIsTitle: "What is Speech Therapy?",
    whatIsDesc: "Speech-Language Pathologists (SLPs) focus on building essential verbal and non-verbal skills for toddlers. They create an engaging, play-based environment to encourage your child to communicate their needs and interact with their surroundings.",
    whatIsList: [
      "Encouraging foundational skills like joint attention.",
      "Fostering early vocalizations and word approximations.",
      "Introducing alternative communication methods if needed."
    ],
    asdHelpTitle: "How it Helps ASD",
    asdHelpDesc: "For children on the autism spectrum, speech therapy is highly tailored. It focuses heavily on improving eye contact, taking turns, and using gestures to lay the groundwork for expressive language.",
    coreBenefitsTitle: "Core Benefits",
    coreBenefitsList: [
      "Improves social reciprocity and pragmatic language.",
      "Decreases frustration by giving children a way to communicate.",
      "Enhances the ability to understand instructions and routines.",
      "Supports emotional regulation through better self-expression."
    ],
    faqTitle: "Frequently Asked Questions",
    readyTitle: "Ready to take the next step?",
    readyDesc: "If you have concerns about your child's development, an early screening can help guide your discussions with healthcare providers.",
    ctaBtn: "Take the Autism Screener",
    slices: [
      { id: 1, label: 'Receptive Language', color: '#1a71ce', desc: 'Understanding what is said and following directions.' },
      { id: 2, label: 'Expressive Language', color: '#2e8fe8', desc: 'Expressing thoughts, needs, and ideas clearly.' },
      { id: 3, label: 'Social Communication', color: '#54aeff', desc: 'Using pragmatics, eye contact, and turn-taking.' },
      { id: 4, label: 'Speech Sounds', color: '#8bcaff', desc: 'Articulation and the physical production of sounds.' },
      { id: 5, label: 'AAC', color: '#bbdfff', desc: 'Augmentative and Alternative Communication methods.' },
    ],
    faqs: [
      {
        q: 'How long is a session?',
        a: 'Typically, speech therapy sessions last between 30 to 45 minutes, depending on the child\'s age and attention span.'
      },
      {
        q: 'What is the goal of speech therapy for a toddler with ASD?',
        a: 'The primary goal is to improve functional communication, which includes building verbal skills, using gestures, and developing social interaction patterns like eye contact and turn-taking.'
      },
      {
        q: 'When should we start?',
        a: 'Early intervention is key. If you notice signs of delayed speech or communication difficulties, it\'s best to consult a speech-language pathologist as soon as possible.'
      }
    ]
  },
  ur: {
    disclaimer: "نتائج اور معلومات خالص تعلیمی ہیں اور پیشہ ورانہ طبی مشورے کی جگہ نہیں لے سکتی ہیں۔",
    heroTitle: "گفتار اور زبان کی تھراپی",
    heroSubtitle: "مواصلات کو بہتر بنانا",
    wheelTitle: "مواصلاتی پہیہ",
    wheelSubtitle: "گفتار کی تھراپی آپ کے بچے کی مواصلاتی ضروریات کو پورا کرنے کے لیے ترقیاتی شعبوں کی ایک وسیع رینج کا احاطہ کرتی ہے۔",
    wheelTapPrompt: "کسی حصے پر کلک کریں",
    wheelSelectPrompt: "مزید جاننے کے لیے پہیے سے کوئی ایک شعبہ منتخب کریں۔",
    whatIsTitle: "گفتار کی تھراپی کیا ہے؟",
    whatIsDesc: "گفتار اور زبان کے ماہرین (SLPs) بچوں کے لیے ضروری زبانی اور غیر زبانی مہارتوں کی تعمیر پر توجہ دیتے ہیں۔ وہ ایک پرکشش، کھیل کود پر مبنی ماحول بناتے ہیں تاکہ آپ کے بچے کو اپنی ضروریات بتانے اور اپنے اردگرد کے ماحول سے بات چیت کرنے کی ترغیب دی جا سکے۔",
    whatIsList: [
      "باہمی توجہ جیسی بنیادی مہارتوں کی حوصلہ افزائی کرنا۔",
      "ابتدائی آوازوں اور الفاظ کی ادائیگی کو فروغ دینا۔",
      "اگر ضرورت ہو تو مواصلت کے متبادل طریقے متعارف کروانا۔"
    ],
    asdHelpTitle: "یہ ASD میں کس طرح مدد کرتا ہے؟",
    asdHelpDesc: "آٹزم کے شکار بچوں کے لیے، گفتار کی تھراپی انتہائی موزوں بنائی جاتی ہے۔ یہ زبانی زبان کے لیے بنیاد رکھنے کے لیے آنکھوں کے رابطے کو بہتر بنانے، باری لینے اور اشاروں کے استعمال پر بہت زیادہ توجہ مرکوز کرتی ہے۔",
    coreBenefitsTitle: "بنیادی فوائد",
    coreBenefitsList: [
      "سماجی باہمی تعلقات اور عملی زبان کو بہتر بناتا ہے۔",
      "بچوں کو بات چیت کرنے کا راستہ دے کر مایوسی کو کم کرتا ہے۔",
      "ہدایات اور معمولات کو سمجھنے کی صلاحیت کو بڑھاتا ہے۔",
      "بہتر خود اظہار خیال کے ذریعے جذباتی ضابطے کی حمایت کرتا ہے۔"
    ],
    faqTitle: "اکثر پوچھے گئے سوالات",
    readyTitle: "اگلا قدم اٹھانے کے لیے تیار ہیں؟",
    readyDesc: "اگر آپ کو اپنے بچے کی نشوونما کے بارے میں خدشات ہیں تو، ابتدائی اسکریننگ صحت کی دیکھ بھال فراہم کرنے والوں کے ساتھ آپ کی بات چیت کی رہمائی میں مدد کر سکتی ہے۔",
    ctaBtn: "آٹزم اسکریننگ شروع کریں",
    slices: [
      { id: 1, label: 'حسی زبان', color: '#1a71ce', desc: 'یہ سمجھنا کہ کیا کہا جا رہا ہے اور ہدایات پر عمل کرنا۔' },
      { id: 2, label: 'اظہاری زبان', color: '#2e8fe8', desc: 'اپنے خیالات، ضروریات اور نظریات کا واضح طور پر اظہار کرنا۔' },
      { id: 3, label: 'سماجی مواصلات', color: '#54aeff', desc: 'عملیات، آنکھوں کے رابطے اور باری لینے کا استعمال کرنا۔' },
      { id: 4, label: 'گفتار کی آوازیں', color: '#8bcaff', desc: 'الفاظ کی ادائیگی اور آوازوں کی جسمانی پیداوار۔' },
      { id: 5, label: 'AAC مواصلات', color: '#bbdfff', desc: 'مواصلات کے متبادل اور اضافی طریقے۔' },
    ],
    faqs: [
      {
        q: 'تھراپی کا سیشن کتنا طویل ہوتا ہے؟',
        a: 'عام طور پر، گفتار کی تھراپی کے سیشن 30 سے 45 منٹ کے درمیان ہوتے ہیں، جو بچے کی عمر اور توجہ پر منحصر ہے۔'
      },
      {
        q: 'ASD والے بچے کے لیے گفتار کی تھراپی کا مقصد کیا ہے؟',
        a: 'بنیادی مقصد عملی مواصلات کو بہتر بنانا ہے، جس میں زبانی مہارتوں کی تعمیر، اشاروں کا استعمال، اور آنکھوں کے رابطے اور باری لینے جیسے سماجی تعامل کے نمونوں کو تیار کرنا شامل ہے۔'
      },
      {
        q: 'ہمیں کب شروع کرنا چاہیے؟',
        a: 'ابتدائی مداخلت کلید ہے۔ اگر آپ اپنے بچے میں بولنے کی تاخیر یا مواصلاتی مشکلات محسوس کرتے ہیں تو، جلد از جلد گفتار کے ماہر سے مشورہ کرنا بہتر ہے۔'
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
              <span className="text-[11px] tracking-wide">{slice.label}</span>
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

export default function SpeechTherapy() {
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
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-brand-300 font-semibold tracking-widest uppercase drop-shadow-sm">
              {t.heroSubtitle}
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2} className="md:w-[45%] flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl">
              <div 
                className="absolute inset-0 bg-white/20 animate-pulse"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
              />
              <img 
                src={heroImg} 
                alt="Speech therapist with child" 
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover"
                style={{ borderRadius: '50% 40% 60% 40% / 40% 60% 50% 50%' }}
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
                src={speechTherapyImg} 
                alt="Toddler engaging in verbal play" 
                className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
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

      {/* ── 4. Z-PATTERN B ── */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10 grid md:grid-cols-[1.1fr,0.9fr] gap-12 md:gap-16 items-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">{t.asdHelpTitle}</h2>
            <p className="text-brand-100 mb-10 text-sm md:text-base leading-relaxed opacity-90">
              {t.asdHelpDesc}
            </p>
            
            <div className="mb-8">
              <h4 className="font-bold mb-4 text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-300" /> {t.coreBenefitsTitle}
              </h4>
              <ul className="space-y-2.5">
                {t.coreBenefitsList.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-brand-50">
                    <span className="text-brand-400 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            
          </FadeIn>
          
          <FadeIn delay={0.2} className="hidden md:block">
             <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[450px]">
              <div className="absolute inset-0 bg-brand-900/30 mix-blend-multiply z-10" />
              <img 
                src={helpsAsdImg} 
                alt="Therapist with toys" 
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>
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
