import { useState, useEffect, useRef, ReactNode, useMemo, memo, useCallback } from 'react';
import { 
  Vote, MapPin, Calendar, CheckCircle2, Info, MessageSquare, ChevronRight, Star, 
  Search, UserCheck, Building2, ExternalLink, ArrowRight, Globe, Fingerprint, 
  ShieldCheck, Trophy, User, Users, Menu, X, Navigation, Loader2, Sparkles, 
  Languages, MessageCircle, Send, AlertCircle, Zap, LogOut, LogIn, LayoutDashboard, 
  Check, Clock, Map as MapIcon, Bot, ArrowLeft, Download, Map as MapIcon2, HelpCircle, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User as FirebaseUser } from 'firebase/auth';

import { 
  INDIAN_ELECTION_STEPS, 
  ELECTION_NEWS_FEED, 
  QUIZ_QUESTIONS,
  MOCK_CANDIDATES, 
  ELECTION_DATE,
  type Candidate, 
  type NewsArticle, 
  type Step,
  type Page,
  type Message,
  type TranslationSet,
  TRANSLATIONS,
  ELECTION_RESULTS,
  CONSTITUENCY_RESULTS,
  INDIAN_LANGUAGES,
  type Language
} from './data';

// Modular Component Imports
import { CivicNews } from './components/CivicNews';
import { CivicQuiz } from './components/CivicQuiz';
import { CandidateSearch } from './components/CandidateSearch';
import { ResultsVisualization } from './components/ResultsVisualization';
import { FeedbackModal } from './components/FeedbackModal';
import { VoterEligibility } from './components/VoterEligibility';
import { VotingMethods } from './components/VotingMethods';
import { PollingStationMap } from './components/PollingStationMap';
import { ChatMessage } from './components/ChatMessage';

/**
 * Utility to merge tailwind classes for cleaner components
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// --- Types ---
// Data moved to src/data.ts

// --- Components ---
// All major components extracted to src/components/

// --- Quiz Data extracted to src/data.ts ---


// --- Candidate Data extracted to src/components/CandidateSearch.tsx ---

// --- Core Application Logic ---
export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [language, setLanguage] = useState<Language>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I'm your Civic Assistant. How can I help you regarding the Indian Elections today?" }
  ]);
  const [epicSearchValue, setEpicSearchValue] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = useMemo(() => TRANSLATIONS[language], [language]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !genAI) return;
    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      const prompt = `You are the CivicPulse AI, an expert on Indian Election Commission (ECI) procedures. 
      Help the user with questions about Voter ID, EVMs, Polling Stations, and voting rights.
      Be accurate, neutral, and helpful. Always recommend verifying details at voters.eci.gov.in.
      User question: ${userMessage}`;

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later or visit the official ECI website." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const diff = ELECTION_DATE.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysRemaining(days > 0 ? days : 0);
    };
    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  // Reset progress when navigating away from the journey page
  useEffect(() => {
    if (currentPage !== 'journey') {
      setCompletedSteps(new Set());
      setActiveStep(1);
    }
  }, [currentPage]);

  const toggleStepCompletion = useCallback((id: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const progressPercentage = Math.round((completedSteps.size / INDIAN_ELECTION_STEPS.length) * 100);

  const currentStepData = INDIAN_ELECTION_STEPS.find(s => s.id === activeStep)!;

  return (
    <div className="min-h-screen bg-cv-peach text-cv-dark font-sans selection:bg-cv-blue selection:text-white">
      {/* Header */}
      <header id="app-header" className="fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 glass border-none !bg-cv-dark/80">
        <div className="max-w-[1450px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div id="brand-logo" className="cursor-pointer flex items-center gap-3 group" onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}>
              <div className="w-10 h-10 bg-cv-blue rounded-xl flex items-center justify-center shadow-lg shadow-cv-blue/20">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-[-0.02em] uppercase font-display">Civic<span className="text-white/70">Vote</span></h1>
            </div>

            {/* Language & Powered by */}
            <div id="language-selector" className="hidden lg:flex items-center ml-2 bg-white/5 rounded-xl p-1 gap-1 border border-white/5 relative">
              <div className="px-3 py-2 border-r border-white/10 uppercase">
                <p className="text-[7px] font-black text-white/30 leading-none">{t.common.poweredBy}</p>
                <p className="text-[10px] font-black text-white/70 leading-none mt-1">Google</p>
              </div>
              <div 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-white uppercase cursor-pointer hover:bg-white/5 transition-colors"
              >
                <Languages className="w-3.5 h-3.5 text-cv-blue" />
                {t.common.lang}
              </div>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-cv-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
                  >
                    {INDIAN_LANGUAGES.map((lang) => (
                      <button 
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                        className={`w-full px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors ${language === lang.code ? 'text-cv-blue bg-white/5' : 'text-white/60'}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav id="desktop-navigation" className="hidden xl:flex items-center gap-6 h-10" role="navigation" aria-label="Main Navigation">
            <button id="nav-home" onClick={() => setCurrentPage('home')} className={`nav-link ${currentPage === 'home' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'home' ? 'page' : undefined}>{t.nav.home}</button>
            <button id="nav-booth" onClick={() => setCurrentPage('booth')} className={`nav-link ${currentPage === 'booth' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'booth' ? 'page' : undefined}>{t.nav.booths}</button>
            <button id="nav-candidates" onClick={() => setCurrentPage('candidates')} className={`nav-link ${currentPage === 'candidates' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'candidates' ? 'page' : undefined}>{t.nav.candidates}</button>
            <button id="nav-journey" onClick={() => setCurrentPage('journey')} className={`nav-link ${currentPage === 'journey' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'journey' ? 'page' : undefined}>{t.nav.process}</button>
            <button id="nav-eligibility" onClick={() => setCurrentPage('eligibility')} className={`nav-link ${currentPage === 'eligibility' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'eligibility' ? 'page' : undefined}>{t.nav.eligibility}</button>
            <button id="nav-methods" onClick={() => setCurrentPage('methods')} className={`nav-link ${currentPage === 'methods' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'methods' ? 'page' : undefined}>{t.nav.methods}</button>
            <button id="nav-quiz" onClick={() => setCurrentPage('quiz')} className={`nav-link ${currentPage === 'quiz' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'quiz' ? 'page' : undefined}>{t.nav.quiz}</button>
            <button id="nav-news" onClick={() => setCurrentPage('news')} className={`nav-link ${currentPage === 'news' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'news' ? 'page' : undefined}>{t.nav.news}</button>
            <button id="nav-results" onClick={() => setCurrentPage('results')} className={`nav-link ${currentPage === 'results' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'results' ? 'page' : undefined}>RESULTS</button>
            <button id="nav-assistant" onClick={() => setCurrentPage('assistant')} className={`nav-link flex items-center gap-2 ${currentPage === 'assistant' ? 'text-cv-blue' : ''}`} aria-current={currentPage === 'assistant' ? 'page' : undefined}>
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              AI DESK
            </button>
          </nav>

            <div className="flex items-center gap-4">
              {authLoading ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-white/20" />
                </div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-black text-white leading-none">{user.displayName}</p>
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">Verified Citizen</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all group relative"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <div className="absolute top-full right-0 mt-2 whitespace-nowrap bg-cv-dark border border-white/10 px-3 py-1 rounded text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none">Sign Out</div>
                  </button>
                  {user.photoURL && <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-cv-blue" referrerPolicy="no-referrer" />}
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full border border-cv-blue text-white hover:bg-cv-blue transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.nav.signin}</span>
                </button>
              )}

              <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>
            
            <button 
              id="cta-register-voting"
              className="cv-button-yellow" 
              onClick={() => setCurrentPage('journey')}
              aria-label="Register to Vote"
            >
              {t.nav.register}
            </button>
            
            {/* Mobile Toggle */}
            <button id="mobile-menu-toggle" className="xl:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-cv-dark border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-4">
                {[
                  { id: 'home', label: t.nav.home },
                  { id: 'booth', label: t.nav.booths },
                  { id: 'candidates', label: t.nav.candidates },
                  { id: 'journey', label: t.nav.process },
                  { id: 'eligibility', label: t.nav.eligibility },
                  { id: 'methods', label: t.nav.methods },
                  { id: 'quiz', label: t.nav.quiz },
                  { id: 'news', label: t.nav.news },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id as Page); setIsMobileMenuOpen(false); }} 
                    className={`text-xl font-black uppercase tracking-tighter text-left py-2 transition-all ${currentPage === item.id ? 'text-cv-blue' : 'text-white/60'}`}
                  >
                    {item.label}
                  </button>
                ))}
                
                <div className="pt-8 mt-4 border-t border-white/10">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{t.common.poweredBy} Google</p>
                  <p className="text-3xl font-black text-white uppercase font-display">{daysRemaining} DAYS <span className="text-white/20 text-xs">LEFT</span></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12" role="main">
        <AnimatePresence mode="wait">
          {currentPage === 'results' && (
            <motion.div 
              key="results" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
            >
              <ResultsVisualization />
            </motion.div>
          )}

          {currentPage === 'assistant' && (
            <motion.div 
              key="assistant" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto py-12"
            >
              <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-cv-dark/5 flex flex-col h-[700px]">
                <div className="p-8 bg-cv-dark text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cv-blue rounded-2xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl uppercase tracking-widest leading-none">Civic AI Desk</h3>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Grounding: Gemini 1.5 Flash</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-cv-light/30">
                  {messages.map((m, i) => (
                    <ChatMessage key={i} message={m} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-cv-dark/5 shadow-sm">
                        <Loader2 className="w-5 h-5 animate-spin text-cv-blue" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-8 border-t border-cv-dark/5">
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about voter registration, EVMs, or polling booths..."
                      className="flex-1 bg-cv-light border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-4 focus:ring-cv-blue/10 transition-all"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="p-4 bg-cv-blue text-white rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-cv-blue/20 flex items-center justify-center disabled:opacity-20"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-40">
              <section className="flex flex-col lg:flex-row items-center gap-20 py-12">
                <div className="flex-1 space-y-10">
                  <div className="cv-badge">
                    <Sparkles className="w-3 h-3 text-cv-blue" />
                    {t.home.badge}
                  </div>
                  <h2 className="text-7xl md:text-[110px] leading-[0.9] font-[900] tracking-[-0.04em] font-display text-cv-dark uppercase">
                    {t.home.title1} <br />
                    {t.home.title2} <br />
                    <span className="text-cv-blue">{t.home.title3}</span>
                  </h2>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button onClick={() => setCurrentPage('journey')} className="bg-cv-dark text-white px-10 py-5 rounded-full font-bold text-sm tracking-tight hover:opacity-90 transition-all flex items-center gap-3 shadow-xl">
                      {t.home.cta}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCurrentPage('candidates')} className="bg-white text-cv-dark border border-cv-dark/10 px-10 py-5 rounded-full font-bold text-sm tracking-tight hover:bg-cv-light transition-all flex items-center gap-3">
                      View Candidates
                      <Users className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 w-full max-w-xl">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="aspect-[4/3] rounded-[40px] glass !bg-white/40 relative overflow-hidden p-12 flex flex-col justify-center"
                  >
                    <div className="absolute top-10 right-10 opacity-10">
                      <Globe className="w-40 h-40 text-cv-blue" />
                    </div>
                    <h3 className="text-7xl font-black text-cv-dark tracking-tighter leading-none mb-2 font-display">INDIA</h3>
                    <p className="text-cv-blue font-black tracking-[0.2em] text-xs uppercase mb-12">{t.home.subtitle}</p>
                    <div className="space-y-4 mt-auto">
                      <div className="h-1.5 w-1/2 bg-cv-blue/20 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-cv-blue" />
                      </div>
                      <p className="text-[10px] font-bold text-cv-dark/40 uppercase tracking-widest">Global Leadership // Democratic Integrity</p>
                    </div>
                  </motion.div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t-[12px] border-cv-dark pt-12">
                <div className="space-y-6">
                  <div className="cv-badge">EVM Technology</div>
                  <h3 className="text-5xl font-black tracking-tighter uppercase font-display">EVM & VVPAT: <br/><span className="text-cv-blue">Digital Trust</span></h3>
                  <p className="text-lg font-medium leading-relaxed text-cv-dark/60">
                    The Indian voting system is entirely digital, secured by stand-alone machines that are not connected to any network. The VVPAT provides a physical confirmation, allowing you to see your choice before it is recorded forever.
                  </p>
                </div>
                <div className="bg-cv-blue text-white p-12 rounded-[40px] flex flex-col justify-center shadow-2xl shadow-cv-blue/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-6 opacity-60">Democratic Scale</p>
                  <p className="text-4xl font-black tracking-tight leading-[1.1] font-display">
                    968 MILLION ELIGIBLE VOTERS — LARGER THAN THE EU, USA, AND RUSSIA COMBINED.
                  </p>
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'journey' && (
            <motion.div key="journey" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-24">
              <section className="overflow-hidden">
                <div className="mb-12 border-b border-cv-dark/10 pb-6 flex items-end justify-between">
                  <div>
                    <div className="cv-badge mb-3">Process Sequence</div>
                    <h3 className="text-5xl font-black tracking-tighter uppercase font-display">Voter <span className="text-cv-blue">Process</span></h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-cv-dark/40 uppercase tracking-widest mb-1">Module Progress</p>
                    <p className="text-3xl font-black tracking-tighter text-cv-blue">{progressPercentage}%</p>
                  </div>
                </div>

                <div className="mb-12">
                  <div className="h-3 w-full bg-cv-dark/5 rounded-full overflow-hidden relative border border-cv-dark/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} className="h-full bg-cv-blue transition-all duration-500 ease-out rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <nav className="lg:col-span-3 flex flex-col gap-6">
                    {INDIAN_ELECTION_STEPS.map((step) => (
                      <button key={step.id} onClick={() => setActiveStep(step.id)} className={`w-full text-left transition-all p-4 rounded-2xl flex flex-col gap-1 group ${activeStep === step.id ? 'bg-white shadow-lg border border-cv-blue/10' : 'opacity-50 hover:opacity-100 hover:bg-white/50'}`}>
                        <p className="text-[10px] font-bold text-cv-blue uppercase tracking-widest">Phase {step.id.toString().padStart(2, '0')}</p>
                        <h3 className="text-lg font-extrabold tracking-tight">{step.title}</h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1">{step.phase}</p>
                      </button>
                    ))}
                  </nav>

                  <section className="lg:col-span-6 bg-white rounded-[40px] p-12 shadow-sm border border-cv-dark/5 relative min-h-[600px]">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative h-full space-y-8">
                        <div className="absolute -top-10 -left-6 text-[120px] font-black text-cv-blue/5 leading-none select-none -z-10">{activeStep.toString().padStart(2, '0')}</div>
                        <h3 className="text-4xl font-black tracking-tighter uppercase font-display">{currentStepData.title}</h3>
                        <p className="text-xl leading-relaxed tracking-tight font-bold text-cv-blue">{currentStepData.description}</p>
                        <div className="text-lg leading-relaxed text-cv-dark/70 space-y-4 font-medium">{currentStepData.longDescription}</div>
                        
                        <div className="p-8 bg-cv-dark text-white rounded-3xl shadow-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Info className="w-20 h-20" />
                          </div>
                          <p className="text-[10px] font-bold text-cv-blue uppercase tracking-[0.2em] mb-3">Citizen Notice</p>
                          <p className="text-lg font-bold leading-snug italic">
                            {activeStep === 1 ? "In India, registration is a continuous process except for the period between the last date for filing nominations and completion of the election." : "Remember, your Vote is your Voice. Do not let anyone influence your choice."}
                          </p>
                        </div>
                        
                        <div className="pt-8">
                          <button onClick={() => toggleStepCompletion(activeStep)} className={`w-full py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg ${completedSteps.has(activeStep) ? 'bg-green-500 text-white' : 'bg-cv-blue text-white hover:scale-[1.02] active:scale-95'}`}>
                            {completedSteps.has(activeStep) ? 'Step Verified & Complete' : 'Mark as Reviewed'}
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </section>

                  <aside className="lg:col-span-3 space-y-8">
                    <div className="bg-cv-blue text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                        <ExternalLink className="w-24 h-24" />
                      </div>
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-6">Official Resources</p>
                      <div className="space-y-6">
                        <a href="https://voters.eci.gov.in" target="_blank" rel="no-referrer" className="flex items-center justify-between group bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all">
                          <span className="text-[10px] font-bold uppercase tracking-widest">Voter Portal</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="https://results.eci.gov.in" target="_blank" rel="no-referrer" className="flex items-center justify-between group bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all">
                          <span className="text-[10px] font-bold uppercase tracking-widest">Result Portal</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </aside>
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'booth' && (
            <motion.div key="booth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-24">
               <section>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-12 mb-8">
                    <div className="cv-badge mb-3">Logistical Mapping</div>
                    <h3 className="text-6xl font-black tracking-tighter uppercase font-display leading-none">Find Your <span className="text-cv-blue">Polling Station</span></h3>
                  </div>

                  <div className="lg:col-span-5 space-y-10">
                    <div className="p-10 border border-cv-dark/5 bg-white rounded-[40px] shadow-sm">
                      <p className="text-[10px] font-bold text-cv-blue uppercase tracking-widest mb-6 border-b border-cv-dark/5 pb-2">EPIC Search</p>
                      <div className="space-y-6">
                        <p className="text-lg font-medium leading-snug text-cv-dark/60">
                          Use your Electoral Photo Identity Card (EPIC) number to locate your poll booth.
                        </p>
                        <div className="space-y-4">
                          <input 
                            id="epic-search-input"
                            type="text" 
                            aria-label="EPIC Number"
                            value={epicSearchValue}
                            onChange={(e) => setEpicSearchValue(e.target.value)}
                            placeholder="EPIC Number (e.g. ABC1234567)" 
                            className="w-full bg-cv-light rounded-2xl p-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-cv-blue/10 transition-all border-none" 
                          />
                          <button 
                            aria-label="Locate Booth"
                            className="w-full bg-cv-dark text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all disabled:opacity-30"
                            disabled={!epicSearchValue.trim()}
                          >
                            Locate Booth In Map
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cv-blue text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Info className="w-32 h-32" />
                      </div>
                      <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="w-6 h-6 border-2 border-white rounded-full p-1" />
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Booth Protocol</p>
                      </div>
                      <ul className="space-y-4 font-bold text-xs tracking-tight">
                        <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/60 rounded-full mt-1.5 shrink-0" /> Identify your queue based on gender/age priority.</li>
                        <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/60 rounded-full mt-1.5 shrink-0" /> First polling officer checks your name & ID.</li>
                        <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/60 rounded-full mt-1.5 shrink-0" /> Second officer applies ink and takes your signature.</li>
                        <li className="flex gap-3 items-start"><span className="w-1.5 h-1.5 bg-white/60 rounded-full mt-1.5 shrink-0" /> Press blue button on EVM against your candidate.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-12">
                     <div className="flex flex-col h-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-cv-dark/5">
                        <div className="p-8 border-b border-cv-dark/5 flex items-center justify-between bg-white">
                          <div>
                            <p className="text-[10px] font-bold text-cv-blue mb-1 uppercase tracking-widest">Mapping Portal</p>
                            <h4 className="text-2xl font-black uppercase tracking-tighter font-display">Booth <span className="text-cv-blue">Navigation</span></h4>
                          </div>
                          <div className="w-12 h-12 bg-cv-light rounded-full flex items-center justify-center">
                            <Navigation className="w-5 h-5 text-cv-blue" />
                          </div>
                        </div>
                        <div className="flex-1 min-h-[500px]">
                          <PollingStationMap epicNumber={epicSearchValue} />
                        </div>
                        <div className="p-8 bg-cv-light/50 flex items-center gap-4">
                          <div className="w-3 h-3 bg-cv-blue rounded-full animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 italic">Data Refreshed via SVEEP Cloud // Live ECI Connectivity</p>
                        </div>
                     </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'methods' && (
            <motion.div key="methods" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <VotingMethods />
            </motion.div>
          )}

          {currentPage === 'eligibility' && (
            <motion.div key="eligibility" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <VoterEligibility />
            </motion.div>
          )}

          {currentPage === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CivicQuiz />
            </motion.div>
          )}

          {currentPage === 'news' && (
            <motion.div key="news" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CivicNews />
            </motion.div>
          )}

          {currentPage === 'candidates' && (
            <motion.div key="candidates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CandidateSearch t={t} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <section className="pt-24 border-t border-cv-dark/5 pb-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-cv-dark flex items-center justify-center text-white">
                <CheckCircle2 className="w-4 h-4" />
             </div>
             <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-cv-dark/40">No Voter Left Behind // Digital India</h1>
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-cv-blue items-center">
            <button onClick={() => setIsFeedbackOpen(true)} className="hover:text-cv-dark transition-colors flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              Provide Feedback
            </button>
            <span>Electoral Integrity</span>
            <span>Digital Franchise</span>
            <span>SVEEP ECI</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cv-dark/20 text-right leading-relaxed">
            Project CivicVote // Real-Time Data Grounding <br/>
            Edition 2026-2029
          </p>
        </section>
      </main>

      {/* AI Assistant FAB */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className="absolute bottom-20 right-0 w-[400px] h-[550px] bg-white rounded-[32px] shadow-2xl border border-cv-dark/5 overflow-hidden flex flex-col"
            >
              <div className="p-6 bg-cv-blue text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest leading-none">Civic Assistant</h4>
                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1">Live Help Desk</p>
                  </div>
                </div>
                <button onClick={() => setIsAssistantOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cv-light/20">
                {messages.map((m, i) => (
                  <ChatMessage key={i} message={m} />
                ))}
                {isLoading && (
                  <Loader2 className="w-4 h-4 animate-spin text-cv-blue mx-auto" />
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-cv-dark/5">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your query..."
                    className="flex-1 bg-cv-light border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-cv-blue"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="p-3 bg-cv-blue text-white rounded-xl shadow-lg shadow-cv-blue/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className="w-16 h-16 bg-cv-blue rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all relative"
          aria-label="Open Civic Assistant"
        >
          {isAssistantOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-8 h-8" />}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-cv-yellow border-4 border-white rounded-full" />
        </button>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
