import { Brain, Menu, X, Bell, ChevronDown, LogOut, User, Settings, Mail, Shield, Volume2, BellRing, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';



export default function Navbar() {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailNotifEnabled, setEmailNotifEnabled] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: language === 'ur' ? 'اسمارٹ کیئر میں خوش آمدید!' : 'Welcome to SmartCare ASD!',
      desc: language === 'ur' ? 'شروع کرنے کے لیے اپنے بچے کا پروفائل شامل کریں۔' : 'Add your child\'s profile to begin early screenings.',
      time: language === 'ur' ? 'ابھی' : 'Just now',
      unread: true
    },
    {
      id: 2,
      title: language === 'ur' ? 'طبی سنگ میل کی رہنمائی' : 'Clinical Milestone Guidelines',
      desc: language === 'ur' ? 'نشوونما کے سنگ میل سیکھنے کے لیے رہنمائی کا صفحہ دیکھیں۔' : 'Read the parent guidelines to track childhood development.',
      time: language === 'ur' ? '۵ منٹ پہلے' : '5m ago',
      unread: true
    }
  ]);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Chime 1 (F5 note - soothing high pitch sine wave)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(698.46, ctx.currentTime);
      gain1.gain.setValueAtTime(0.06, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.4);
      
      // Chime 2 (A5 note - major third harmony)
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.00, ctx.currentTime);
        gain2.gain.setValueAtTime(0.06, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      }, 120);
    } catch (e) {
      console.warn("Web Audio Context block by browser autoplay policy", e);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = '/dashboard';
  const isActive = (path) => location.pathname === path;
  const navLabels = {
    en: {
      home: 'Home',
      about: 'About ASD',
      guide: 'Parent Guidelines',
      signIn: 'Sign In',
      start: 'Get Started',
      dashboard: 'Dashboard',
      newScreening: 'Screening',
      profile: 'My Profile',
      settings: 'Settings',
      signOut: 'Sign Out'
    },
    ur: {
      home: 'ہوم',
      about: 'آٹزم کے بارے میں',
      guide: 'والدین کے لیے رہنمائی',
      signIn: 'سائن ان',
      start: 'شروع کریں',
      dashboard: 'ڈیش بورڈ',
      newScreening: 'اسکریننگ',
      profile: 'میری پروفائل',
      settings: 'ترتیبات',
      signOut: 'سائن آؤٹ'
    }
  };
  const t = navLabels[language];

  const publicNav = [
    { label: t.home, to: '/' },
    { label: t.about, to: '/#about-asd' },
    { label: t.guide, to: '/#guidelines' },
  ];
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">

        {/* ── Brand / Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <img
            src="/logo.png"
            alt="SmartCare ASD Logo"
            className="w-9 h-9 rounded-xl object-cover shadow-sm group-hover:opacity-90 transition-opacity"
            onError={(e) => {
              // Fallback to icon if logo.png missing
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-9 h-9 rounded-xl bg-brand-600 items-center justify-center shadow-sm">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold text-slate-800">SmartCare</span>
            <span className="ml-1 text-xs font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md">ASD</span>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        {user ? (
          /* Authenticated nav - Five links */
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${isActive('/') ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'}`}>
              {t.home}
            </Link>
            <a href="/#about-asd"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${location.hash === '#about-asd' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'}`}>
              {t.about}
            </a>
            <a href="/#guidelines"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${location.hash === '#guidelines' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'}`}>
              {t.guide}
            </a>
            <Link to={dashboardPath}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${isActive(dashboardPath) ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'}`}>
              {t.dashboard}
            </Link>
            {user.role === 'parent' && (
              <Link to="/screen"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive('/screen') ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'}`}>
                {t.newScreening}
              </Link>
            )}
          </nav>
        ) : (
          /* Public nav */
          <nav className="hidden md:flex items-center gap-1">
            {publicNav.map(({ label, to }) => (
              <Link key={to} to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive(to) ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'}`}>
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* ── Right controls ── */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {user ? (
            <>
              {/* Bell */}
              <div className="relative">
                <button 
                  onClick={() => {
                    const nextOpen = !bellDropdownOpen;
                    setBellDropdownOpen(nextOpen);
                    setDropdownOpen(false);
                    if (nextOpen && notifications.some(n => n.unread)) {
                      playNotificationSound();
                      setNotifications(notifications.map(n => ({ ...n, unread: false })));
                    }
                  }}
                  className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Bell className="w-5 h-5 text-slate-500" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                  )}
                </button>

                {bellDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl border border-slate-100 shadow-card-md py-1 z-50 animate-fade-in max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800">
                        {language === 'ur' ? 'اطلاعات' : 'Notifications'}
                      </p>
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-600">
                        {language === 'ur' ? 'تمام صاف کریں' : 'Clear All'}
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-400 text-xs">
                        {language === 'ur' ? 'کوئی نئی اطلاع نہیں ہے' : 'No new notifications'}
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {notifications.map(n => (
                          <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-brand-500' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-700 truncate">{n.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setBellDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-700">
                      {user.full_name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-24 truncate">
                    {user.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl border border-slate-100 shadow-card-md py-1 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-50">
                      <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowProfileModal(true);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4" /> {t.profile}
                    </button>
                    <button 
                      onClick={() => {
                        setShowSettingsModal(true);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                      <Settings className="w-4 h-4" /> {t.settings}
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> {t.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-xs px-4 py-2">{t.signIn}</Link>
              <Link to="/signup" className="btn-primary  text-xs px-4 py-2">{t.start}</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

    </header>

      {/* ── Mobile Menu Sidebar Drawer ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-fade-in">
          {/* Backdrop Click Closes Menu */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          
          <div className="relative w-full max-w-[280px] bg-brand-950 text-white h-full shadow-2xl flex flex-col justify-between animate-slide-left z-50 border-l border-white/10">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-bold tracking-wider text-brand-300">SMARTCARE ASD</span>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-white/5">
              {user ? (
                <>
                  {/* Home */}
                  <Link to="/" onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-xs font-bold uppercase tracking-wider text-slate-100 hover:text-brand-300 transition-colors">
                    <span>{t.home}</span>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </Link>

                  {/* About */}
                  <a href="/#about-asd" onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-xs font-bold uppercase tracking-wider text-slate-100 hover:text-brand-300 transition-colors">
                    <span>{t.about}</span>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </a>

                  {/* Guidelines */}
                  <a href="/#guidelines" onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-xs font-bold uppercase tracking-wider text-slate-100 hover:text-brand-300 transition-colors">
                    <span>{t.guide}</span>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </a>

                  {/* Dashboard */}
                  <Link to={dashboardPath} onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-xs font-bold uppercase tracking-wider text-slate-100 hover:text-brand-300 transition-colors">
                    <span>{t.dashboard}</span>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </Link>

                  {/* Screening */}
                  {user.role === 'parent' && (
                    <Link to="/screen" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-4 text-xs font-bold uppercase tracking-wider text-slate-100 hover:text-brand-300 transition-colors">
                      <span>{t.newScreening}</span>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {publicNav.map(({ label, to }) => (
                    <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-4 text-xs font-bold uppercase tracking-wider text-slate-100 hover:text-brand-300 transition-colors">
                      <span>{label}</span>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Drawer Footer (Sign In / Out) */}
            <div className="p-6 border-t border-white/10 bg-white/2">
              {user ? (
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/40 text-xs font-semibold uppercase tracking-wider transition-colors">
                  <LogOut className="w-4 h-4" />
                  {t.signOut}
                </button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="w-full py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-center text-xs font-semibold uppercase tracking-wider transition-colors">
                    {t.signIn}
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}
                    className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-center text-xs font-semibold uppercase tracking-wider transition-colors">
                    {t.start}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── My Profile Sidebar Drawer ── */}
      {showProfileModal && user && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
          {/* Backdrop Click Closes Drawer */}
          <div className="absolute inset-0" onClick={() => setShowProfileModal(false)} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left z-50 border-l border-slate-100">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {language === 'ur' ? 'اکاؤنٹ کی تفصیلات' : 'Account Profile'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'ur' ? 'اپنے اکاؤنٹ کی معلومات کا نظم کریں۔' : 'Manage your personal account credentials'}
                </p>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Account Card Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {user.full_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{user.full_name}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700 capitalize">
                      {user.role}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700">
                      <Shield className="w-2.5 h-2.5" />
                      {language === 'ur' ? 'محفوظ' : 'Secured'}
                    </span>
                  </div>
                </div>
              </div>

              {/* General Account details */}
              <div className="space-y-4">
                <div>
                  <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    {language === 'ur' ? 'ذاتی تفصیلات' : 'Personal Details'}
                  </span>
                  
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400 leading-none">
                          {language === 'ur' ? 'مکمل نام' : 'Full Name'}
                        </p>
                        <p className="text-xs font-semibold text-slate-700 mt-1">{user.full_name}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400 leading-none">
                          {language === 'ur' ? 'ای میل ایڈریس' : 'Email Address'}
                        </p>
                        <p className="text-xs font-semibold text-slate-700 mt-1">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Settings Status Card */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {language === 'ur' ? 'تصدیق شدہ اکاؤنٹ' : 'Verified Clinical Portal Access'}
                      </p>
                      <p className="text-xxs text-slate-500 mt-1 leading-relaxed">
                        {language === 'ur' 
                          ? 'آپ کا اکاؤنٹ اسمارٹ کیئر اے ایس ڈی سیکیورٹی شیف الگورتھم کے تحت محفوظ اور تصدیق شدہ ہے۔' 
                          : 'Your account is verified and encrypted under the SmartCare secure medical diagnostic pipeline.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-2.5">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="btn-primary w-full text-center text-xs py-2.5">
                {language === 'ur' ? 'بند کریں' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Settings Sidebar Drawer ── */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
          {/* Backdrop Click Closes Drawer */}
          <div className="absolute inset-0" onClick={() => setShowSettingsModal(false)} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left z-50 border-l border-slate-100">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {language === 'ur' ? 'پورٹل ترتیبات' : 'Portal Preferences'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'ur' ? 'اپنی آواز اور اطلاعات کا انتظام کریں۔' : 'Configure sound chimes and notification alerts'}
                </p>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {language === 'ur' ? 'انٹرفیس ترجیحات' : 'Interface Controls'}
              </span>

              {/* Toggles List */}
              <div className="space-y-4">
                {/* Sound Toggle card */}
                <div className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Volume2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {language === 'ur' ? 'طبی آواز کے اثرات' : 'Medical Sound Chimes'}
                      </p>
                      <p className="text-xxs text-slate-500 mt-0.5 leading-relaxed">
                        {language === 'ur' ? 'اطلاعات پر پرسکون ڈبل گھنٹی چلائیں' : 'Play a warm, soft tone on new notifications'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      if (next) {
                        setTimeout(() => {
                          try {
                            const AudioContext = window.AudioContext || window.webkitAudioContext;
                            if (!AudioContext) return;
                            const ctx = new AudioContext();
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.type = 'sine';
                            osc.frequency.setValueAtTime(880.00, ctx.currentTime);
                            gain.gain.setValueAtTime(0.04, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.start();
                            osc.stop(ctx.currentTime + 0.3);
                          } catch(err){}
                        }, 50);
                      }
                    }}
                    className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 flex-shrink-0 ${soundEnabled ? 'bg-brand-600' : 'bg-slate-300'}`}>
                    <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Email Toggle card */}
                <div className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <BellRing className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {language === 'ur' ? 'ای میل الرٹس' : 'Email Notifications'}
                      </p>
                      <p className="text-xxs text-slate-500 mt-0.5 leading-relaxed">
                        {language === 'ur' ? 'رپورٹ تیار ہونے پر مطلع کریں' : 'Send an email alert as soon as screenings complete'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEmailNotifEnabled(!emailNotifEnabled)}
                    className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 flex-shrink-0 ${emailNotifEnabled ? 'bg-brand-600' : 'bg-slate-350'}`}>
                    <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${emailNotifEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-2.5">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="btn-primary w-full text-center text-xs py-2.5">
                {language === 'ur' ? 'محفوظ کریں' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
