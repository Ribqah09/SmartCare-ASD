import re

with open('src/pages/LandingPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. FAQS array and FaqAccordion definition
content = re.sub(
    r"// ── FAQ Accordion ───────────────────────────────────────────────────────────\nconst FAQS = \[.*?\];\n\nfunction FaqAccordion\(\) \{\n  const \[open, setOpen\] = useState\(null\);\n  return \(\n    <div className=\"space-y-3\">\n      \{FAQS\.map\(\(f, i\) => \(",
    r"// ── FAQ Accordion ───────────────────────────────────────────────────────────\nfunction FaqAccordion({ faqs }) {\n  const [open, setOpen] = useState(null);\n  return (\n    <div className=\"space-y-3\">\n      {faqs.map((f, i) => (",
    content, flags=re.DOTALL
)

# 2. RISK_CARDS and GUIDELINE_LINKS (remove them)
content = re.sub(
    r"// ── Risk legend cards ───────────────────────────────────────────────────────\nconst RISK_CARDS = \[.*?\];\n\n",
    r"",
    content, flags=re.DOTALL
)
content = re.sub(
    r"// ── Guidelines Links ─────────────────────────\nconst GUIDELINE_LINKS = \[.*?\];\n\n",
    r"",
    content, flags=re.DOTALL
)

# 3. Insert local vars inside LandingPage
vars_to_insert = """  const faqsList = [
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
"""

content = content.replace(
    "const t = CONTENT[language];\n  return (",
    f"const t = CONTENT[language];\n{vars_to_insert}\n  return ("
)

# 4. Replace Hero Text
content = content.replace(
    "Autism Screening Tool<br />",
    "{t.heroTitle}<br />"
)
content = content.replace(
    "<span className=\"text-brand-300\">for Toddlers</span>{' '}",
    "<span className=\"text-brand-300\">{t.heroSubtitle}</span>{' '}"
)
content = content.replace(
    "SmartCare combines the validated Q-CHAT-10 questionnaire with CNN facial\n            analysis to deliver a multimodal ASD likelihood score — in under 10 minutes,\n            from the comfort of your home.",
    "{t.heroDesc}"
)

# 5. Multimodal Badge
content = content.replace(
    "Multimodal AI Engine",
    "{t.multiModalTitle}"
)
content = content.replace(
    "Vision + Behavioural Fusion",
    "{t.multiModalSubtitle}"
)
content = content.replace(
    "Clinically Grounded",
    "{t.clinicallyGrounded}"
)

# 6. Section A
content = content.replace(
    "How This Screener Helps",
    "{t.sectionALabel}"
)
content = content.replace(
    "Two streams of evidence,<br /> one clear result",
    "{t.sectionATitle}"
)
content = content.replace(
    "SmartCare combines two independent AI models using the thesis-validated fusion formula.\n            The <strong>Q-CHAT-10 behavioural questionnaire</strong> (SVM model) captures developmental\n            patterns parents observe daily. The <strong>CNN vision analysis</strong> (VGG16) screens\n            subtle facial micro-expressions. Together, they produce a weighted fusion score.",
    "{t.sectionADesc}"
)

# 7. Features Array
content = content.replace(
    "{ label: 'Science-backed Q-CHAT-10 questionnaire (10 questions)'",
    "{ label: t.feature1"
)
content = content.replace(
    "{ label: 'CNN facial pattern analysis — processed in secure memory'",
    "{ label: t.feature2"
)
content = content.replace(
    "{ label: 'Google Gemini AI generates a clinician-friendly summary'",
    "{ label: t.feature3"
)
content = content.replace(
    "{ label: 'Instant PDF report for your paediatrician'",
    "{ label: t.feature4"
)

# 8. Who Should Use This Tool
content = content.replace(
    "Who Should Use This Tool?",
    "{t.targetLabel}"
)
content = content.replace(
    "Designed for families",
    "{t.targetTitle}"
)
content = content.replace(
    "{ icon: Users, title: 'Parents & Caregivers', desc: 'Worried about your toddler\\'s development? Get an objective, AI-assisted screening before your next paediatrician visit.' }",
    "{ icon: Users, title: t.targetParentTitle, desc: t.targetParentDesc }"
)
content = content.replace(
    "{ icon: Heart, title: 'Developmental Paediatricians', desc: 'Doctor-dashboard with triage queue. High-risk cases surface automatically for your clinical review.' }",
    "{ icon: Heart, title: t.targetDoctorTitle, desc: t.targetDoctorDesc }"
)
content = content.replace(
    "{ icon: Brain, title: 'Early Intervention Teams', desc: 'Export PDF reports and AI summaries to support referrals to speech therapy, OT, and ABA programmes.' }",
    "{ icon: Brain, title: t.targetEI_Title, desc: t.targetEI_Desc }"
)

# 9. What to Expect
content = content.replace(
    "What to Expect",
    "{t.sectionBLabel}"
)
content = content.replace(
    "Four steps.<br /> 10 minutes. Clear answers.",
    "{t.sectionBTitle}"
)

# 10. Steps Array
content = content.replace(
    "{ num: '01', title: 'Create an account', desc: 'Register as a parent. Add your child\\'s profile with date of birth and gender.' }",
    "{ num: '01', title: t.step1Title, desc: t.step1Desc }"
)
content = content.replace(
    "{ num: '02', title: 'Complete Q-CHAT-10', desc: 'Answer 10 developmental questions about your child\\'s behaviour on a 5-point scale.' }",
    "{ num: '02', title: t.step2Title, desc: t.step2Desc }"
)
content = content.replace(
    "{ num: '03', title: 'Upload a photo', desc: 'Upload a clear, front-facing photo. It is processed in volatile memory and never stored without your consent.' }",
    "{ num: '03', title: t.step3Title, desc: t.step3Desc }"
)
content = content.replace(
    "{ num: '04', title: 'Receive your report', desc: 'View your AI fusion score, a Gemini-generated clinician summary, and download a PDF for your doctor.' }",
    "{ num: '04', title: t.step4Title, desc: t.step4Desc }"
)

# 11. RISK_CARDS map update
content = content.replace(
    "RISK_CARDS.map",
    "riskCards.map"
)

# 12. FAQ Section
content = content.replace(
    "FAQ</p>",
    "{t.faqLabel}</p>"
)
content = content.replace(
    "Common questions from parents</h2>",
    "{t.faqTitle}</h2>"
)
content = content.replace(
    "<FaqAccordion />",
    "<FaqAccordion faqs={faqsList} />"
)

# 13. Video Section
content = content.replace(
    "Awareness Library</p>",
    "{t.videoLabel}</p>"
)
content = content.replace(
    "Clinical Insights for Families</h2>",
    "{t.videoTitle}</h2>"
)
content = content.replace(
    "Watch these expert-led resources to understand developmental markers and the proven impact of early support.\n            </p>",
    "{t.videoDesc}\n            </p>"
)

# 14. Resource Section
content = content.replace(
    "Resource Center</p>",
    "{t.resourceLabel}</p>"
)
content = content.replace(
    "Learn more about ASD Support</h2>",
    "{t.resourceTitle}</h2>"
)
content = content.replace(
    "Access our curated guides to navigate the journey of early intervention.</p>",
    "{t.resourceDesc}</p>"
)
content = content.replace(
    "GUIDELINE_LINKS.map",
    "guidelineLinks.map"
)

# 15. CTA Section
content = content.replace(
    "Early screening can change everything.\n            </h2>",
    "{t.ctaTitle}\n            </h2>"
)
content = content.replace(
    "Research shows that early intervention before age 3 leads to significantly better\n              outcomes for children with ASD. Start the screening today — it takes under 10 minutes.\n            </p>",
    "{t.ctaDesc}\n            </p>"
)

with open('src/pages/LandingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
