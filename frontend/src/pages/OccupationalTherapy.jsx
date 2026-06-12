import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, AlertCircle, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import otHeroImg from '../assets/OCCUPATIONAL THERAPY HERO.jpg';
import otImg from '../assets/OCCUPATIONAL THERAPY.jpg';

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
    heroTitle: "OCCUPATIONAL THERAPY",
    heroSubtitle: "Fostering Independence",
    wheelTitle: "The Developmental Wheel",
    wheelSubtitle: "Occupational therapy addresses multiple domains of development to support daily living skills and independence.",
    wheelTapPrompt: "Tap a slice",
    wheelSelectPrompt: "Select an area from the wheel to learn more.",
    whatIsTitle: "What is Occupational Therapy?",
    whatIsDesc: "Occupational therapists (OTs) work with toddlers to build the core skills required for daily life. They help your child navigate social and learning environments by improving fine motor control and sensory processing.",
    whatIsList: [
      "Building muscle strength in hands and fingers.",
      "Developing daily habits and self-care routines.",
      "Adapting play spaces to reduce sensory overload."
    ],
    asdHelpTitle: "Supporting Sensory Modulation",
    asdHelpDesc: "Sensory integration is a key focus of occupational therapy for children on the autism spectrum. OTs help toddlers modulate their nervous system's response to tactile, auditory, or visual stimulation.",
    coreBenefitsTitle: "Key Objectives",
    coreBenefitsList: [
      "Enhances self-regulation and emotional control.",
      "Improves coordination and motor planning abilities.",
      "Fosters independent eating, dressing, and hygiene.",
      "Supports cognitive development through functional play."
    ],
    faqTitle: "Frequently Asked Questions",
    readyTitle: "Ready to explore early screening?",
    readyDesc: "Identify potential areas of strength and developmental opportunities early on to guide targeted therapy plans.",
    ctaBtn: "Take the Autism Screener",
    slices: [
      { id: 1, label: 'Fine Motor Skills', color: '#1a71ce', desc: 'Using hands and fingers for precise tasks.' },
      { id: 2, label: 'Sensory Processing', color: '#2e8fe8', desc: 'Handling lights, sounds, and textures.' },
      { id: 3, label: 'Self-Care (ADLs)', color: '#54aeff', desc: 'Activities of Daily Living like eating and dressing.' },
      { id: 4, label: 'Executive Function', color: '#8bcaff', desc: 'Planning, organizing, and completing tasks.' },
      { id: 5, label: 'Visual-Motor', color: '#bbdfff', desc: 'Hand-eye coordination and visual perception.' },
    ],
    faqs: [
      {
        q: 'What exactly is "Occupational Therapy" for a toddler?',
        a: 'For a young child, their "occupations" are playing, eating, dressing, and learning. OT helps toddlers develop the physical, sensory, and cognitive skills needed to perform these daily activities independently.'
      },
      {
        q: 'What are "Fine Motor Skills," and why do they matter?',
        a: 'These are small muscle movements, such as grasping a spoon, stacking blocks, or using a pincer grasp. Strengthening these skills early on is critical for future tasks like writing and self-feeding.'
      },
      {
        q: 'How does it help with sensory issues?',
        a: 'OT helps children learn to process and tolerate sensory input through a "sensory diet"—a tailored plan of physical activities and accommodations.'
      }
    ]
  },
  ur: {
    disclaimer: "نتائج اور معلومات خالص تعلیمی ہیں اور پیشہ ورانہ طبی مشورے کی جگہ نہیں لے سکتی ہیں۔",
    heroTitle: "حرفتی تھراپی (Occupational Therapy)",
    heroSubtitle: "خود مختاری کو فروغ دینا",
    wheelTitle: "ترقیاتی پہیہ",
    wheelSubtitle: "حرفتی تھراپی روزمرہ کی زندگی کی مہارتوں اور خود مختاری کی حمایت کے لیے نشوونما کے متعدد شعبوں پر کام کرتی ہے۔",
    wheelTapPrompt: "کسی حصے پر کلک کریں",
    wheelSelectPrompt: "مزید جاننے کے لیے پہیے سے کوئی ایک شعبہ منتخب کریں۔",
    whatIsTitle: "حرفتی تھراپی کیا ہے؟",
    whatIsDesc: "حرفتی معالجین (OTs) روزمرہ کی زندگی کے لیے درکار بنیادی مہارتوں کی تعمیر کے لیے بچوں کے ساتھ کام کرتے ہیں۔ وہ باریک حرکتی کنٹرول اور حسی عمل کو بہتر بنا کر آپ کے بچے کو سماجی اور تعلیمی ماحول میں مدد دیتے ہیں۔",
    whatIsList: [
      "ہاتھوں اور انگلیوں میں عضلاتی طاقت بنانا۔",
      "روزمرہ کی عادات اور خود نگہداشت کے معمولات تیار کرنا۔",
      "حسی اوورلوڈ کو کم کرنے کے لیے کھیلنے کی جگہوں کو ڈھالنا۔"
    ],
    asdHelpTitle: "حسی اعتدال پسندی کی حمایت",
    asdHelpDesc: "حسی انضمام آٹزم کے شکار بچوں کے لیے حرفتی تھراپی کا ایک اہم مرکز ہے۔ OTs بچوں کو لمس، سماعت، یا بصری محرکات کے بارے میں ان کے اعصابی نظام کے ردعمل کو منظم کرنے میں مدد کرتے ہیں۔",
    coreBenefitsTitle: "اہم مقاصد",
    coreBenefitsList: [
      "خود سے نظم و ضبط اور جذباتی کنٹرول کو بڑھاتا ہے۔",
      "باہمی ہم آہنگی اور حرکتی منصوبہ بندی کی صلاحیتوں کو بہتر بناتا ہے۔",
      "آزادانہ کھانے، کپڑے پہننے اور صفائی ستھرائی کو فروغ دیتا ہے۔",
      "عملی کھیل کے ذریعے ذہنی نشوونما کی حمایت کرتا ہے۔"
    ],
    faqTitle: "اکثر پوچھے گئے سوالات",
    readyTitle: "ابتدائی اسکریننگ کے لیے تیار ہیں؟",
    readyDesc: "ٹارگٹڈ تھراپی پلانز کی رہمائی کے لیے شروع میں ہی ممکنہ طاقتوں اور نشوونما کے مواقع کے شعبوں کی نشاندہی کریں۔",
    ctaBtn: "آٹزم اسکریننگ شروع کریں",
    slices: [
      { id: 1, label: 'باریک حرکتی مہارتیں', color: '#1a71ce', desc: 'درست کاموں کے لیے ہاتھوں اور انگلیوں کا استعمال۔' },
      { id: 2, label: 'حسی پروسیسنگ', color: '#2e8fe8', desc: 'روشنیوں، آوازوں اور ساختوں کو سنبھالنا۔' },
      { id: 3, label: 'خود نگہداشت (ADLs)', color: '#54aeff', desc: 'روزمرہ کی زندگی کی سرگرمیاں جیسے کھانا اور کپڑے پہننا۔' },
      { id: 4, label: 'انتظامی سرگرمیاں', color: '#8bcaff', desc: 'کاموں کی منصوبہ بندی کرنا، ترتیب دینا اور مکمل کرنا۔' },
      { id: 5, label: 'بصری-حرکتی ہم آہنگی', color: '#bbdfff', desc: 'ہاتھ اور آنکھ کا تال میل اور بصری ادراک۔' },
    ],
    faqs: [
      {
        q: 'بچے کے لیے "حرفتی تھراپی" دراصل کیا ہے؟',
        a: 'ایک چھوٹے بچے کے لیے، کھیل کود، کھانا پینا، کپڑے پہننا اور سیکھنا ہی اس کے بنیادی کام ہیں۔ OT بچوں کو ان روزمرہ کی سرگرمیوں کو آزادانہ طور پر انجام دینے کے لیے درکار جسمانی، حسی اور ذہنی مہارتوں کو فروغ دینے میں مدد کرتا ہے۔'
      },
      {
        q: '"باریک حرکتی مہارتیں" کیا ہیں اور یہ کیوں اہم ہیں؟',
        a: 'یہ چھوٹے پٹھوں کی حرکات ہیں، جیسے چمچ پکڑنا، بلاکس رکھنا، یا چٹکی کا استعمال۔ مستقبل کے کاموں جیسے لکھنے اور خود سے کھانے کے لیے ان مہارتوں کو جلد مضبوط کرنا اہم ہے۔'
      },
      {
        q: 'یہ حسی مسائل میں کس طرح مدد کرتا ہے؟',
        a: 'OT بچوں کو جسمانی سرگرمیوں اور رہائش کے ایک موزوں منصوبے "حسی خوراک" کے ذریعے حسی معلومات پر عمل کرنے اور برداشت کرنے میں مدد کرتا ہے۔'
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

export default function OccupationalTherapy() {
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
                  حرفتی تھراپی{' '}
                  <span dir="ltr" className="inline-block">
                    (Occupational Therapy)
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
                style={{ borderRadius: '40% 60% 70% 30% / 50% 60% 40% 50%' }}
              />
              <img 
                src={otHeroImg} 
                alt="OT therapist with toddler" 
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover"
                style={{ borderRadius: '50% 50% 50% 50%' }}
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
                src={otImg} 
                alt="Fine motor skill exercise" 
                className="w-full h-full object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-700"
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
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="OT materials" 
                className="w-full h-full object-cover grayscale-[20%]"
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
