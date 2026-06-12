import { useCallback, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useLanguage } from '../context/LanguageContext';
import {
  Brain, ChevronDown, ChevronUp, ArrowRight, Shield,
  CheckCircle2, Clock, BarChart3, Users, Heart, AlertTriangle,
  Info, ClipboardList, MessageCircle, Activity, Milestone
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

// ── Particle neuron background ──────────────────────────────────────────────
function NeuronParticles() {
  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={init}
      className="absolute inset-0 z-0"
      options={{
        fullScreen: false,
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          color: { value: ['#2e8fe8', '#8bcaff', '#54aeff', '#ffffff'] },
          links: {
            color: '#2e8fe8', distance: 130, enable: true,
            opacity: 0.25, width: 1,
          },
          move: { enable: true, speed: 0.8, random: true, outModes: { default: 'bounce' } },
          number: { value: 55, density: { enable: true, area: 900 } },
          opacity: { value: { min: 0.2, max: 0.7 } },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
          },
          modes: {
            grab: { distance: 120, links: { opacity: 0.5 } },
          },
        },
      }}
    />
  );
}

// ── Scroll-reveal wrapper ───────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
const CONTENT = {
  "en": {
    "heroBadge": "AI-Powered Clinical Screening",
    "heroTitle": "Autism Screening Tool",
    "heroSubtitle": "for Toddlers",
    "heroDesc": "SmartCare combines the validated Q-CHAT-10 questionnaire with facial analysis to deliver a multimodal ASD likelihood score.",
    "videoLabel": "Awareness Library",
    "videoTitle": "Clinical Insights for Families",
    "videoDesc": "Watch these expert-led resources to understand developmental markers and the proven impact of early support.",
    "resourceLabel": "Resource Center",
    "resourceTitle": "Learn more about ASD Support",
    "resourceDesc": "Access our curated guides to navigate the journey of early intervention.",
    "ctaTitle": "Early screening can change everything.",
    "ctaDesc": "Research shows that early intervention before age 3 leads to significantly better outcomes for children with ASD. Start the screening today — it takes under 10 minutes.",
    "ctaBtn": "Begin Screening Now",

    "aboutLabel": "Autism Explained",
    "aboutTitle": "Autism Spectrum Disorder (ASD) — What Families Should Know",
    "aboutDesc1": "Autism, often called autism spectrum disorder (ASD), is a term used to describe differences in how someone communicates, learns, and interacts with the world. Every child is unique, and autism shows up differently from one child to the next.",
    "aboutDesc2": "Autism is a neurodevelopmental condition that affects communication, social interaction, behavior patterns, and learning styles. The word “spectrum” means there is a wide range of strengths and challenges — no two children experience autism the same way.",
    "aboutPoint1": "Some children use many words, others use few",
    "aboutPoint2": "Some prefer routines, others become overwhelmed by changes",
    "aboutPoint3": "Some enjoy focused interests or sensory experiences",
    "aboutConclusion": "Rather than a single “profile,” autism describes a set of patterns that may impact daily activities, relationships, and learning.",

    "sectionALabel": "{t.sectionALabel}",
    "sectionATitle": "Two streams of evidence, one clear result",
    "sectionADesc": "SmartCare combines two independent AI models using the thesis-validated fusion formula. The Q-CHAT-10 behavioural questionnaire (SVM model) captures developmental patterns parents observe daily. The CNN vision analysis (VGG16) screens subtle facial micro-expressions. Together, they produce a weighted fusion score.",
    "feature1": "Science-backed Q-CHAT-10 questionnaire (10 questions)",
    "feature2": "CNN facial pattern analysis — processed in secure memory",
    "feature3": "Detailed clinical summary generated automatically",
    "feature4": "Instant PDF report for your paediatrician",
    "multiModalTitle": "{t.multiModalTitle}",
    "multiModalSubtitle": "{t.multiModalSubtitle}",
    "clinicallyGrounded": "{t.clinicallyGrounded}",

    "targetLabel": "{t.targetLabel}",
    "targetTitle": "{t.targetTitle}, reviewed by specialists",
    "targetParentTitle": "Parents & Caregivers",
    "targetParentDesc": "Worried about your toddler's development? Get an objective, AI-assisted screening before your next paediatrician visit.",
    "targetDoctorTitle": "Developmental Paediatricians",
    "targetDoctorDesc": "Doctor-dashboard with triage queue. High-risk cases surface automatically for your clinical review.",
    "targetEI_Title": "Early Intervention Teams",
    "targetEI_Desc": "Export PDF reports and AI summaries to support referrals to speech therapy, OT, and ABA programmes.",

    "sectionBLabel": "{t.sectionBLabel}",
    "sectionBTitle": "Four steps. 10 minutes. Clear answers.",
    "step1Title": "Create an account",
    "step1Desc": "Register as a parent. Add your child's profile with date of birth and gender.",
    "step2Title": "Complete Q-CHAT-10",
    "step2Desc": "Answer 10 developmental questions about your child's behaviour on a 5-point scale.",
    "step3Title": "Upload a photo",
    "step3Desc": "Upload a clear, front-facing photo. It is processed in volatile memory and never stored without your consent.",
    "step4Title": "Receive your report",
    "step4Desc": "View your AI fusion score, a detailed clinical summary, and download a PDF for your doctor.",

    "riskLow": "Low Likelihood",
    "riskLowDesc": "No significant ASD indicators detected. Continue routine developmental monitoring and well-child visits.",
    "riskMod": "Moderate Likelihood",
    "riskModDesc": "Some behavioural or visual markers noted. Discuss results with your paediatrician at the next well-child visit.",
    "riskHigh": "High Likelihood",
    "riskHighDesc": "Significant ASD indicators observed. We recommend scheduling an appointment with a developmental specialist promptly.",

    "faqLabel": "FAQ",
    "faqTitle": "Common questions from parents",
    "faq1Q": "What age range is this tool designed for?",
    "faq1A": "SmartCare ASD is validated for toddlers between 16 and 30 months of age. The Q-CHAT-10 questionnaire and CNN vision model are specifically calibrated for this developmental window when early ASD indicators are most identifiable.",
    "faq2Q": "Does a result mean my child has autism?",
    "faq2A": "No. This is a screening tool, not a diagnostic instrument. A \"High Likelihood\" result means further professional evaluation is recommended — it does not confirm or deny an ASD diagnosis. Only a licensed developmental paediatrician or clinical psychologist can make a formal diagnosis using standardised instruments (ADOS-2, ADI-R) under DSM-5 criteria.",
    "faq3Q": "How long does the screening take?",
    "faq3A": "The full screening — including the Q-CHAT-10 questionnaire and photo upload — takes approximately 5–10 minutes. The AI analysis itself completes in under 30 seconds.",
    "faq4Q": "What should I do if the result is High or Moderate?",
    "faq4A": "We recommend contacting your child's paediatrician as soon as possible to discuss the results and request a referral to a developmental specialist. Early intervention programmes have strong evidence for improving outcomes. Our results page includes contact information for specialist centres in Pakistan.",
    "faq5Q": "Is my child's photo stored?",
    "faq5A": "No, by default. Facial images are processed entirely in secure volatile memory and are immediately deleted after the AI analysis. You will be given the explicit option to consent to storage for record-keeping, but this is entirely optional.",
    "faq6Q": "Can I use this tool more than once?",
    "faq6A": "Yes. You can screen the same child multiple times as they develop, or add multiple children to your account. We recommend re-screening every 3–6 months if initial concerns remain.",

    "guideEvalLabel": "Autism evaluations",
    "guideEvalDesc": "Understanding diagnostic tools like ADOS-2 and what to expect during your visit.",
    "guideSpeechLabel": "Speech therapy",
    "guideSpeechDesc": "Enhancing communication skills and social interaction through specialized techniques.",
    "guideOccupLabel": "Occupational therapy",
    "guideOccupDesc": "Supporting sensory processing and building independence in daily living activities."
  },
  "ur": {
    "heroBadge": "مصنوعی ذہانت سے لیس طبی اسکریننگ",
    "heroTitle": "آٹزم اسکریننگ ٹول",
    "heroSubtitle": "چھوٹے بچوں کے لیے",
    "heroDesc": "اسمارٹ کیئر بچوں میں آٹزم کے امکانات کی جانچ کے لیے جدید ترین ٹیکنالوجی اور طبی سوالنامے کا استعمال کرتا ہے۔",
    "videoLabel": "معلوماتی لائبریری",
    "videoTitle": "خاندانوں کے لیے طبی بصیرت",
    "videoDesc": "نشوونما کی علامات اور ابتدائی مدد کے ثابت شدہ اثرات کو سمجھنے کے لیے ماہرین کے یہ وسائل دیکھیں۔",
    "resourceLabel": "امدادی مرکز",
    "resourceTitle": "آٹزم سپورٹ کے بارے میں مزید جانیں",
    "resourceDesc": "ابتدائی مداخلت کے سفر میں رہنمائی حاصل کرنے کے لیے ہماری منتخب کردہ گائیڈز تک رسائی حاصل کریں۔",
    "ctaTitle": "ابتدائی اسکریننگ سب کچھ بدل سکتی ہے۔",
    "ctaDesc": "تحقیق سے ثابت ہے کہ 3 سال کی عمر سے پہلے ابتدائی مداخلت (Early Intervention) آٹزم کا شکار بچوں کے لیے بہتری کے نمایاں نتائج لاتی ہے۔ آج ہی اسکریننگ شروع کریں—اس میں 10 منٹ سے بھی کم وقت لگتا ہے۔",
    "ctaBtn": "اسکریننگ شروع کریں",

    "aboutLabel": "آٹزم کی وضاحت",
    "aboutTitle": "آٹزم اسپیکٹرم ڈس آرڈر (ASD) — خاندانوں کو کیا جاننا چاہیے",
    "aboutDesc1": "آٹزم، جسے اکثر آٹزم اسپیکٹرم ڈس آرڈر (ASD) کہا جاتا ہے، ان طریقوں میں فرق کو بیان کرنے کے لیے استعمال ہونے والی اصطلاح ہے کہ کوئی شخص کیسے بات چیت کرتا ہے، سیکھتا ہے اور دنیا کے ساتھ تعامل کرتا ہے۔ ہر بچہ منفرد ہے، اور آٹزم کی علامات ایک بچے سے دوسرے بچے میں مختلف ہوتی ہیں۔",
    "aboutDesc2": "آٹزم ایک اعصابی نشوونما کی حالت ہے جو مواصلات، سماجی تعامل، رویے کے نمونوں اور سیکھنے کے انداز کو متاثر کرتی ہے۔ لفظ \"اسپیکٹرم\" کا مطلب ہے کہ طاقت اور چیلنجوں کی ایک وسیع رینج ہے — کوئی بھی دو بچے آٹزم کا ایک جیسا تجربہ نہیں کرتے۔",
    "aboutPoint1": "کچھ بچے بہت سے الفاظ استعمال کرتے ہیں، کچھ کم",
    "aboutPoint2": "کچھ معمولات کو ترجیح دیتے ہیں، دوسرے تبدیلیوں سے گھبرا جاتے ہیں",
    "aboutPoint3": "کچھ مخصوص دلچسپیوں یا حسی تجربات سے لطف اندوز ہوتے ہیں",
    "aboutConclusion": "ایک واحد \"پروفائل\" کی بجائے، آٹزم نمونوں کے ایک ایسے مجموعے کو بیان کرتا ہے جو روزمرہ کی سرگرمیوں، رشتوں اور سیکھنے پر اثر انداز ہو سکتا ہے۔",

    "sectionALabel": "یہ اسکرینر کیسے مدد کرتا ہے",
    "sectionATitle": "دو طرح کے شواہد، ایک واضح نتیجہ",
    "sectionADesc": "اسمارٹ کیئر مقالے سے تصدیق شدہ فیوژن فارمولے کا استعمال کرتے ہوئے دو خود مختار مصنوعی ذہانت (AI) ماڈلز کو یکجا کرتا ہے۔ Q-CHAT-10 رویے کا سوالنامہ ان نشوونما کے نمونوں کو ریکارڈ کرتا ہے جن کا والدین روزانہ مشاہدہ کرتے ہیں۔ سی این این (CNN) بصری تجزیہ چہرے کے باریک تاثرات کی جانچ کرتا ہے۔ یہ دونوں مل کر ایک جامع فیوژن اسکور فراہم کرتے ہیں۔",
    "feature1": "سائنسی بنیادوں پر مبنی Q-CHAT-10 سوالنامہ (10 سوالات)",
    "feature2": "CNN چہرے کے خدوخال کا تجزیہ — جو محفوظ میموری میں پروسیس کیا جاتا ہے",
    "feature3": "طبی مقاصد کے لیے ایک آسان اور تفصیلی کلینیکل خلاصہ خود بخود تیار ہو جاتا ہے",
    "feature4": "آپ کے ماہرِ اطفال کے لیے فوری پی ڈی ایف (PDF) رپورٹ",
    "multiModalTitle": "ملٹی موڈل اے آئی انجن",
    "multiModalSubtitle": "بصری اور رویے کا امتزاج",
    "clinicallyGrounded": "طبی بنیادوں پر استوار",

    "targetLabel": "یہ ٹول کسے استعمال کرنا چاہیے؟",
    "targetTitle": "خاندانوں کے لیے ڈیزائن کیا گیا، ماہرین کی زیرِ نگرانی",
    "targetParentTitle": "والدین اور سرپرست",
    "targetParentDesc": "اپنے بچے کی نشوونما کے حوالے سے فکر مند ہیں؟ ماہرِ اطفال کے پاس جانے سے پہلے اے آئی (AI) کی مدد سے ایک غیر جانبدارانہ اسکریننگ حاصل کریں۔",
    "targetDoctorTitle": "ماہرینِ اطفال (نشوونما)",
    "targetDoctorDesc": "ڈاکٹرز کا ڈیش بورڈ ترجیحی قطار کے ساتھ۔ زیادہ خطرے والے کیسز آپ کے طبی معائنے کے لیے خود بخود سامنے آجاتے ہیں۔",
    "targetEI_Title": "ابتدائی مداخلت (Early Intervention) کی ٹیمیں",
    "targetEI_Desc": "اسپیچ تھراپی، او ٹی (OT)، اور اے بی اے (ABA) پروگرامز کے لیے پی ڈی ایف رپورٹس اور اے آئی کے خلاصے ڈاؤن لوڈ کریں۔",

    "sectionBLabel": "آپ کیا توقع کر سکتے ہیں؟",
    "sectionBTitle": "چار مراحل۔ 10 منٹ۔ واضح جوابات۔",
    "step1Title": "اکاؤنٹ بنائیں",
    "step1Desc": "بطورِ والدین رجسٹر ہوں۔ اپنے بچے کی تاریخِ پیدائش اور جنس کے ساتھ ان کا پروفائل بنائیں۔",
    "step2Title": "Q-CHAT-10 مکمل کریں",
    "step2Desc": "بچے کے رویے کے حوالے سے 10 سوالات کے جوابات 5 درجاتی پیمانے (اسکیل) پر دیں۔",
    "step3Title": "تصویر اپ لوڈ کریں",
    "step3Desc": "سامنے سے کھینچی گئی ایک واضح تصویر اپ لوڈ کریں۔ اسے عارضی میموری میں پروسیس کیا جاتا ہے اور آپ کی اجازت کے بغیر کبھی محفوظ نہیں کیا جاتا۔",
    "step4Title": "اپنی رپورٹ حاصل کریں",
    "step4Desc": "اپنا اے آئی فیوژن اسکور، تفصیلی کلینیکل خلاصہ دیکھیں، اور ڈاکٹر کے لیے پی ڈی ایف (PDF) ڈاؤن لوڈ کریں۔",

    "riskLow": "کم امکانات (Low Likelihood)",
    "riskLowDesc": "آٹزم (ASD) کی کوئی نمایاں علامات نہیں پائی گئیں۔ معمول کے مطابق بچے کی نشوونما کی نگرانی اور ماہرِ اطفال سے باقاعدہ معائنہ جاری رکھیں۔",
    "riskMod": "درمیانے امکانات (Moderate Likelihood)",
    "riskModDesc": "کچھ رویے یا بصری علامات نوٹ کی گئی ہیں۔ اپنے اگلے معمول کے دورے پر ان نتائج پر اپنے ماہرِ اطفال سے بات کریں۔",
    "riskHigh": "زیادہ امکانات (High Likelihood)",
    "riskHighDesc": "آٹزم کی نمایاں علامات دیکھی گئی ہیں۔ ہمارا مشورہ ہے کہ جلد از جلد کسی ماہرِ نشوونما (Developmental Specialist) سے ملاقات کا وقت طے کریں۔",

    "faqLabel": "عمومی سوالات",
    "faqTitle": "والدین کی جانب سے پوچھے جانے والے عام سوالات",
    "faq1Q": "یہ ٹول کس عمر کے بچوں کے لیے ڈیزائن کیا گیا ہے؟",
    "faq1A": "اسمارٹ کیئر 16 سے 30 ماہ کی عمر کے بچوں کے لیے تصدیق شدہ ہے۔ Q-CHAT-10 سوالنامہ اور سی این این بصری ماڈل خاص طور پر اس عمر کے لیے تیار کیے گئے ہیں، کیونکہ اس دوران آٹزم کی ابتدائی علامات کی شناخت سب سے زیادہ ممکن ہوتی ہے۔",
    "faq2Q": "کیا اسکریننگ کے نتیجے کا مطلب یہ ہے کہ میرے بچے کو آٹزم ہے؟",
    "faq2A": "نہیں۔ یہ صرف ایک اسکریننگ ٹول ہے، تشخیص کا آلہ نہیں۔ 'زیادہ امکانات' کے نتیجے کا مطلب ہے کہ مزید پیشہ ورانہ معائنے کی سفارش کی جاتی ہے—یہ آٹزم کی تشخیص کی نہ تو تصدیق کرتا ہے اور نہ ہی تردید۔ صرف ایک مستند ماہرِ اطفال یا ماہرِ نفسیات ہی DSM-5 معیار اور معیاری ٹولز (جیسے ADOS-2, ADI-R) کا استعمال کرتے ہوئے حتمی تشخیص کر سکتا ہے۔",
    "faq3Q": "اسکریننگ میں کتنا وقت لگتا ہے؟",
    "faq3A": "مکمل اسکریننگ—بشمول Q-CHAT-10 سوالنامہ اور تصویر اپ لوڈ—میں تقریباً 5 سے 10 منٹ لگتے ہیں۔ مصنوعی ذہانت (AI) کا تجزیہ 30 سیکنڈ سے بھی کم وقت میں مکمل ہو جاتا ہے۔",
    "faq4Q": "اگر نتیجہ زیادہ یا درمیانے درجے کا آئے تو مجھے کیا کرنا چاہیے؟",
    "faq4A": "ہم تجویز کرتے ہیں کہ نتائج پر بات کرنے کے لیے جلد از جلد اپنے ماہرِ اطفال سے رابطہ کریں اور کسی ماہرِ نشوونما کے پاس بھیجنے کی درخواست کریں۔ ابتدائی مداخلت (Early Intervention) کے پروگرامز بچوں کی بہتری میں نہایت کارگر ثابت ہوئے ہیں۔ ہمارے نتائج کے صفحے پر پاکستان میں موجود ماہر مراکز کی رابطہ تفصیلات بھی شامل ہیں۔",
    "faq5Q": "کیا میرے بچے کی تصویر محفوظ کی جاتی ہے؟",
    "faq5A": "نہیں، عام طور پر نہیں۔ چہرے کی تصاویر مکمل طور پر محفوظ عارضی میموری میں پروسیس کی جاتی ہیں اور اے آئی تجزیہ کے فوراً بعد ڈیلیٹ کر دی جاتی ہیں۔ آپ کو ریکارڈ کے لیے تصویر محفوظ کرنے کا واضح اختیار دیا جائے گا، لیکن یہ مکمل طور پر آپ کی مرضی پر منحصر ہے۔",
    "faq6Q": "کیا میں اس ٹول کو ایک سے زیادہ بار استعمال کر سکتا/سکتی ہوں؟",
    "faq6A": "جی ہاں۔ آپ اپنے بچے کی نشوونما کے ساتھ ساتھ کئی بار اسکریننگ کر سکتے ہیں، یا اپنے اکاؤنٹ میں ایک سے زیادہ بچوں کو شامل کر سکتے ہیں۔ اگر آپ کی ابتدائی تشویش برقرار رہے تو ہم ہر 3 سے 6 ماہ بعد دوبارہ اسکریننگ کی سفارش کرتے ہیں۔",

    "guideEvalLabel": "آٹزم کی تشخیص",
    "guideEvalDesc": "ADOS-2 جیسے تشخیصی ٹولز کو سمجھنا اور یہ جاننا کہ آپ کے دورے کے دوران کیا توقع کی جائے۔",
    "guideSpeechLabel": "اسپیچ تھراپی (Speech Therapy)",
    "guideSpeechDesc": "خصوصی تکنیکوں کے ذریعے بات چیت کی مہارت اور سماجی روابط کو بہتر بنانا۔",
    "guideOccupLabel": "آکوپیشنل تھراپی (Occupational Therapy)",
    "guideOccupDesc": "روزمرہ کی سرگرمیوں میں خود مختاری پیدا کرنا اور حسیات کی پروسیسنگ (Sensory Processing) میں مدد فراہم کرنا۔"
  }
};
// ── FAQ Accordion ───────────────────────────────────────────────────────────
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

// ── YouTube Videos ─────────────────────────────────────────────────────────
const VIDEOS = [
  { id: 'YtvP5A5OHpU', title: 'Recognizing ASD in Toddlers', source: 'Kennedy Krieger' },
  { id: 'ifOeX3K1Jxk', title: 'Autism Awareness (Clinical Guide)', source: 'Dr. Mary Barbera' },
  { id: 'pC6pWGASJjA', title: 'Early Signs (Child < 3yrs)', source: 'Rainbow Pediatric' },
  { id: 'mvfCNp4DHmk', title: 'Importance of Early Intervention', source: 'King\'s College London' }, // High-authority academic source
];

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  // 3. Initialize the language hook
  const { language } = useLanguage();
  const location = useLocation();
  const t = CONTENT[language];
  
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  const faqsList = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
    { q: t.faq5Q, a: t.faq5A },
    { q: t.faq6Q, a: t.faq6A },
  ];

  const riskCards = [
    { label: t.riskLow, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', desc: t.riskLowDesc },
    { label: t.riskMod, icon: Info, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: t.riskModDesc },
    { label: t.riskHigh, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', desc: t.riskHighDesc },
  ];

  const guidelineLinks = [
    { label: t.guideEvalLabel, path: '/guidelines/evaluations', icon: ClipboardList, desc: t.guideEvalDesc },
    { label: t.guideSpeechLabel, path: '/guidelines/speech-therapy', icon: MessageCircle, desc: t.guideSpeechDesc },
    { label: t.guideOccupLabel, path: '/guidelines/occupational-therapy', icon: Activity, desc: t.guideOccupDesc },
  ];

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 overflow-hidden">
        <NeuronParticles />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12 py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Translatable Badge */}
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-brand-300 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full mb-6">
              <Brain className="w-3.5 h-3.5" /> {t.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6"
          >
            {t.heroTitle}<br />
            <span className="text-brand-300">{t.heroSubtitle}</span>{' '}
            <span className="text-white/70">(16–30 Months)</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="text-lg text-brand-100/80 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {t.heroDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-brand-400 hover:bg-brand-300 text-brand-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.ctaBtn} <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-sm border border-white/20 transition-all"
            >
              {language === 'en' ? 'Sign In to Your Account' : 'اپنے اکاؤنٹ میں سائن ان کریں'}
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-14 flex flex-wrap justify-center gap-6 text-xs text-brand-200/60"
          >
            {[
              { icon: Brain, label: language === 'en' ? 'Clinical Summaries' : 'کلینیکل خلاصے' },
              { icon: BarChart3, label: language === 'en' ? 'Validated Q-CHAT-10' : 'تصدیق شدہ Q-CHAT-10' },
              { icon: Clock, label: language === 'en' ? 'Results in ~10 Minutes' : 'نتائج ~10 منٹ میں' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-brand-400" /> {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 sm:h-20">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══ ABOUT ASD (Autism Explained) ══ */}
      <section id="about-asd" className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-600 mb-2">{t.aboutLabel}</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">{t.aboutTitle}</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
            {t.aboutDesc1}
          </p>
          <div className="w-16 h-1 bg-brand-200 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 leading-relaxed mb-8">
            {t.aboutDesc2}
          </p>
        </FadeIn>
        
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {[
            { text: t.aboutPoint1, icon: MessageCircle },
            { text: t.aboutPoint2, icon: Activity },
            { text: t.aboutPoint3, icon: Heart }
          ].map(({ text, icon: Icon }, idx) => (
            <FadeIn key={idx} delay={0.1 * idx}>
              <div className="bg-brand-50 rounded-2xl p-6 text-center h-full border border-brand-100/50 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4 text-brand-600">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">{text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn delay={0.3}>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-slate-700 font-medium italic">
              "{t.aboutConclusion}"
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ══ SECTION A: How this screener helps (Image-Left / Text-Right) ══ */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-12 py-20 grid md:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-100 to-brand-200 aspect-[4/3] flex items-center justify-center">
            {/* Illustrated placeholder */}
            <div className="text-center p-8">
              <div className="w-28 h-28 rounded-full bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Brain className="w-14 h-14 text-white" />
              </div>
              <p className="text-brand-800 font-semibold text-lg">Multimodal AI Engine</p>
              <p className="text-brand-600 text-sm mt-1">Vision + Behavioural Fusion</p>
              {/* Mini formula */}
              {/* <div className="mt-4 bg-white/70 rounded-xl px-4 py-2 inline-block text-xs font-mono text-brand-900">
                S = 0.6 × Vision + 0.4 × Behaviour
              </div> */}
            </div>
            {/* Floating badge */}
            <div className="absolute top-4 right-4 bg-white rounded-xl px-3 py-2 shadow-lg text-xs font-bold text-green-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Clinically Grounded
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="text-xs font-bold tracking-widest uppercase text-brand-600 mb-3">How This Screener Helps</p>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-5">
            Two streams of evidence,<br /> one clear result
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {t.sectionADesc}
          </p>
          <div className="space-y-3">
            {[
              { label: t.feature1, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: t.feature2, color: 'text-brand-600', bg: 'bg-brand-50' },
              { label: t.feature3, color: 'text-green-600', bg: 'bg-green-50' },
              { label: t.feature4, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map(({ label, color, bg }) => (
              <div key={label} className={`flex items-start gap-3 p-3 rounded-xl ${bg}`}>
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                <p className="text-sm text-slate-700">{label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ══ Who should use this ══ */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <FadeIn className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-brand-600 mb-2">Who Should Use This Tool?</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Designed for families</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Users, title: t.targetParentTitle, desc: t.targetParentDesc },
              { icon: Heart, title: t.targetDoctorTitle, desc: t.targetDoctorDesc },
              { icon: Brain, title: t.targetEI_Title, desc: t.targetEI_Desc },
            ].map(({ icon: Icon, title, desc }) => (
              <FadeIn key={title} delay={0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION B: What to expect (Text-Left / Image-Right) ══ */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-12 py-20 grid md:grid-cols-2 gap-12 items-center">
        <FadeIn delay={0.1}>
          <p className="text-xs font-bold tracking-widest uppercase text-brand-600 mb-3">What to Expect</p>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-5">
            {t.sectionBTitle}
          </h2>
          <div className="space-y-5">
            {[
              { num: '01', title: t.step1Title, desc: t.step1Desc },
              { num: '02', title: t.step2Title, desc: t.step2Desc },
              { num: '03', title: t.step3Title, desc: t.step3Desc },
              { num: '04', title: t.step4Title, desc: t.step4Desc },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                  {num}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm mb-0.5">{title}</p>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-brand-100 aspect-[4/3] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-3 p-6 w-full">
              {riskCards.map(({ label, icon: Icon, color, bg, border, desc }) => (
                <div key={label} className={`${bg} ${border} border rounded-2xl p-4 ${label === 'Moderate Likelihood' ? 'col-span-2' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className={`text-xs font-bold ${color}`}>{label}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-brand-600 mb-2">{t.faqLabel}</p>
            <h2 className="text-3xl font-extrabold text-slate-900">{t.faqTitle}</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <FaqAccordion faqs={faqsList} />
          </FadeIn>
        </div>
      </section>

      {/* ══ PARENT GUIDANCE / VIDEOS ════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <FadeIn className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-brand-600 mb-2">{t.videoLabel}</p>
            <h2 className="text-3xl font-extrabold text-slate-900">{t.videoTitle}</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              {t.videoDesc}
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VIDEOS.map(({ id, title }) => (
              <FadeIn key={id} delay={0.05}>
                <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-video bg-slate-900">
                    <iframe
                      src={`https://www.youtube.com/embed/${id}?rel=0&origin=${window.location.origin}`}
                      title={title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-xs font-semibold text-slate-700 leading-snug">{title}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ══ PARENT GUIDANCE ════════════════════════════════════════ */}
      <section id="guidelines" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <FadeIn className="mb-12">
<p className="text-xs font-bold tracking-widest uppercase text-brand-600 mb-2">Parent Guidance</p>            <h2 className="text-3xl font-extrabold text-slate-900">{t.resourceTitle}</h2>
            <p className="text-slate-500 text-sm mt-2">{t.resourceDesc}</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidelineLinks.map((link) => {
              const Icon = link.icon;
              return (
                <FadeIn key={link.path} delay={0.05}>
                  <Link
                    to={link.path}
                    className="group block h-full bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      {Icon && <Icon className="w-6 h-6" />}
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                      {link.label}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-500" />
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {link.desc}
                    </p>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-brand-800 to-brand-600 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-brand-200 text-sm mb-8 leading-relaxed">
              {t.ctaDesc}
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-brand-800 font-bold px-8 py-4 rounded-2xl text-sm hover:bg-brand-50 transition-all shadow-xl hover:-translate-y-0.5"
            >
              Begin Screening Now <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
