import { Brain, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SmartCare" className="w-6 h-6 rounded-lg object-cover"
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
            <div className="hidden w-6 h-6 rounded-lg bg-brand-600 items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-slate-700">SmartCare ASD</span>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-1.5 max-w-md text-center sm:text-left">
            <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-snug">
              <strong className="text-slate-500">Disclaimer:</strong> Preliminary screening only.
              Not a medical diagnosis. Consult a qualified developmental paediatrician.
            </p>
          </div>

          {/* Footer links & credit */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Link to="/#home" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>·</span>
            <Link to="/#about-asd" className="hover:text-brand-600 transition-colors">About</Link>
            <span>·</span>
            <Link to="/#guidelines" className="hover:text-brand-600 transition-colors">Guidelines</Link>
            {/* <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400" /> DUET 2025
            </span> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
