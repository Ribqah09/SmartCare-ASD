import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Activity, AlertTriangle, CheckCircle2, Info,
  ChevronRight, Search, Filter, BarChart3, Users, FileText
} from 'lucide-react';

const RISK_CFG = {
  High:     { badge: 'badge-high',     dot: 'bg-red-500',    icon: AlertTriangle,  text: 'text-red-700'   },
  Moderate: { badge: 'badge-moderate', dot: 'bg-amber-500',  icon: Info,           text: 'text-amber-700' },
  Low:      { badge: 'badge-low',      dot: 'bg-green-500',  icon: CheckCircle2,   text: 'text-green-700' },
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  const bg = { red: 'bg-red-50 text-red-600', amber: 'bg-amber-50 text-amber-600', brand: 'bg-brand-50 text-brand-600', green: 'bg-green-50 text-green-600' }[color];
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [cases, setCases]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all'); // all | High | Moderate

  useEffect(() => {
    api.get('/api/doctor/triage?moderate=true')
      .then(({ data }) => setCases(data.triage || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = cases.filter((c) => {
    const matchSearch = c.child_name?.toLowerCase().includes(search.toLowerCase()) ||
                        c.parent_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.risk_label === filter;
    return matchSearch && matchFilter;
  });

  const highCount = cases.filter(c => c.risk_label === 'High').length;
  const modCount  = cases.filter(c => c.risk_label === 'Moderate').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">

      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">
          Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},{' '}
          <span className="text-brand-700">Dr. {user?.full_name?.split(' ').slice(-1)}</span>
        </h1>
        <p className="section-subtitle">AI Triage Dashboard — Review and verify high-risk screening results.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users}     label="Total Cases"     value={cases.length}  color="brand" />
        <StatCard icon={AlertTriangle} label="High Risk"   value={highCount}     color="red"   />
        <StatCard icon={Activity}  label="Moderate Risk"   value={modCount}      color="amber" />
        <StatCard icon={BarChart3} label="Cases Reviewed"  value={0}             color="green" />
      </div>

      {/* Triage list */}
      <div className="card">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input-field pl-9 text-sm"
              placeholder="Search by child or parent name…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['all', 'High', 'Moderate'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all
                  ${filter === f ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading triage list…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No cases match your filter</p>
            <p className="text-sm text-slate-400 mt-1">
              {cases.length === 0 ? 'No high/moderate risk cases have been screened yet.' : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((c) => {
              const cfg = RISK_CFG[c.risk_label] || RISK_CFG.Low;
              const CIcon = cfg.icon;
              const date = c.screened_at ? new Date(c.screened_at).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' }) : '—';
              return (
                <div key={c.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  {/* Risk dot */}
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />

                  {/* Child info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.child_name}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      Parent: {c.parent_name} · {date}
                      <span className={`sm:hidden px-1.5 py-0.5 rounded text-[10px] font-semibold ${cfg.badge}`}>
                        {c.risk_label}
                      </span>
                    </p>
                  </div>

                  {/* Fusion score */}
                  <div className="hidden sm:block text-center">
                    <p className={`text-sm font-bold ${cfg.text}`}>{(c.fusion_score * 100).toFixed(1)}%</p>
                    <p className="text-xs text-slate-400">Fusion</p>
                  </div>

                  {/* Risk badge */}
                  <span className={`hidden sm:inline-flex ${cfg.badge}`}>
                    <CIcon className="w-3 h-3" /> {c.risk_label}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/doctor/case/${c.id}`}
                      className="btn-secondary text-xs px-3 py-1.5">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clinical note */}
      <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Clinical Note:</strong> This triage list shows AI-flagged cases requiring professional
            review. Scores ≥ 65% are classified High Risk. All cases require verification by a
            qualified developmental paediatrician before any clinical action is taken.
          </p>
        </div>
      </div>
    </div>
  );
}
