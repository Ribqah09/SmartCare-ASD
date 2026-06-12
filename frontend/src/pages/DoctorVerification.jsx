import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Clipboard } from 'lucide-react';

const QUESTIONS = [
  { id: 1, name: 'Relating to People', desc: 'From age-appropriate behavior to consistently aloof or unaware.' },
  { id: 2, name: 'Imitation', desc: 'Ability to mimic sounds, words, and movements.' },
  { id: 3, name: 'Emotional Response', desc: 'Appropriateness of emotion type and degree to the situation.' },
  { id: 4, name: 'Body Use', desc: 'Ease and coordination vs. repetitive or strange movements.' },
  { id: 5, name: 'Object Use', desc: 'Appropriate interest in and use of toys vs. preoccupation with parts.' },
  { id: 6, name: 'Adaptation to Change', desc: 'Accepting routine changes vs. severe reactions/tantrums.' },
  { id: 7, name: 'Visual Response', desc: 'Normal vision use vs. avoiding eye contact or staring.' },
  { id: 8, name: 'Listening Response', desc: 'Normal responses vs. ignoring sounds or extreme overreaction.' },
  { id: 9, name: 'Taste, Smell, and Touch', desc: 'Age-appropriate exploration vs. preoccupation.' },
  { id: 10, name: 'Fear or Nervousness', desc: 'Appropriate fear vs. extreme distress or disregard for hazards.' },
  { id: 11, name: 'Verbal Communication', desc: 'Meaningful speech vs. echolalia, pronoun reversal, or absence.' },
  { id: 12, name: 'Nonverbal Communication', desc: 'Use of facial expressions and gestures.' },
  { id: 13, name: 'Activity Level', desc: 'Agility vs. hyperactivity or lethargy.' },
  { id: 14, name: 'Intellectual Response', desc: 'Level and consistency of intellectual functioning.' },
  { id: 15, name: 'General Impressions', desc: 'The rater\'s overall subjective impression of ASD symptoms.' },
];

const VALUES = [1, 1.5, 2, 2.5, 3, 3.5, 4];

const VALUE_LABELS = {
  1: 'Appropriate',
  1.5: 'Appropriate & Mildly Abnormal',
  2: 'Mildly Abnormal',
  2.5: 'Mildly & Moderately Abnormal',
  3: 'Moderately Abnormal',
  3.5: 'Moderately & Severely Abnormal',
  4: 'Severely Abnormal',
};

export default function DoctorVerification() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [screening, setScreening] = useState(null);
  const [ratings, setRatings] = useState({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [severityGroup, setSeverityGroup] = useState('');

  useEffect(() => {
    // Initialise default ratings (1 = Appropriate)
    const init = {};
    QUESTIONS.forEach(q => { init[q.id] = 1; });
    setRatings(init);

    api.get(`/api/screenings/${id}`)
      .then(({ data }) => setScreening(data.screening))
      .catch((err) => toast.error(err.response?.data?.error || 'Failed to fetch screening details'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // Live update of score and severity calculation
    const currentScore = Object.values(ratings).reduce((a, b) => a + (Number(b) || 0), 0);
    setTotalScore(currentScore);

    if (currentScore < 30) {
      setSeverityGroup('Minimal');
    } else if (currentScore <= 36.5) {
      setSeverityGroup('Mild-Moderate');
    } else {
      setSeverityGroup('Severe');
    }
  }, [ratings]);

  const handleRatingChange = (qId, value) => {
    setRatings(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      screening_id: Number(id),
      clinical_notes: notes,
    };
    QUESTIONS.forEach(q => {
      payload[`q${q.id}`] = ratings[q.id];
    });

    api.post('/api/doctor/verify', payload)
      .then(({ data }) => {
        toast.success(data.message || 'CARS2-ST clinical verification successfully logged!');
        navigate('/doctor/triage');
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || 'Failed to log verification');
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-sm text-slate-500 animate-fade-in">
        <Clipboard className="w-10 h-10 animate-pulse mx-auto text-brand-500 mb-2" />
        Loading screening session details…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/doctor/triage" className="btn-secondary px-3 py-1.5 flex items-center gap-1.5 text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Triage
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="section-title">
          CARS2-ST <span className="text-brand-700">Clinical Verification</span>
        </h1>
        <p className="section-subtitle">Perform a valid CARS2-ST diagnostic assessment for high-risk triage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Summary Card */}
        <div className="lg:col-span-1">
          <div className="card p-5 mb-6 bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-brand-600" /> Case Details
              </h2>
              {screening && (
                <div className="space-y-3 text-xs text-slate-600">
                  <div>
                    <p className="text-slate-400 font-semibold uppercase">Patient Name</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{screening.child_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold uppercase">Current Risk (AI)</p>
                    <p className="text-sm font-bold text-red-600 mt-0.5">{screening.risk_label}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold uppercase">Fusion Score</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{(screening.fusion_score * 100).toFixed(1)}%</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-white border border-slate-100 flex flex-col gap-3">
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase font-semibold">Calculated Score</p>
                <p className="text-4xl font-black text-brand-600 mt-1">{totalScore.toFixed(1)}</p>
              </div>
              <div className="text-center border-t border-slate-50 pt-2">
                <p className="text-xs text-slate-400 uppercase font-semibold">Severity Group</p>
                <p className={`text-base font-bold uppercase mt-0.5 ${
                  severityGroup === 'Severe' ? 'text-red-600' : severityGroup === 'Mild-Moderate' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {severityGroup || 'Minimal'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-amber-50 border border-amber-200 text-xs leading-relaxed text-amber-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Interpretation Guidelines:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li><strong>15 - 29.5:</strong> Minimal-to-No symptoms</li>
                <li><strong>30 - 36.5:</strong> Mild-to-Moderate symptoms</li>
                <li><strong>37 & Higher:</strong> Severe symptoms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column: 15-Item Likert form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="card p-4 hover:shadow-sm transition-all border border-slate-100">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {q.id}. {q.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{q.desc}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 mt-3">
                    {VALUES.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleRatingChange(q.id, val)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all text-center
                          ${ratings[q.id] === val
                            ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}
                      >
                        {val}
                        <span className="hidden sm:block text-[9px] font-normal opacity-80 mt-0.5 truncate max-w-full">
                          {VALUE_LABELS[val]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Clinical Notes */}
            <div className="card p-5">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Verification Notes & Recommendations
              </label>
              <textarea
                className="input-field min-h-[100px] text-sm"
                placeholder="Enter specialized diagnostic observations, referral urgency or medical advice…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 font-bold text-base uppercase tracking-wide"
            >
              {submitting ? 'Submitting Verification…' : 'Calculate Severity & Log Assessment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
