import { useState, useEffect, useRef, ReactNode, useMemo, memo, useCallback } from 'react';
import { 
  Vote, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Info, 
  MessageSquare, 
  ChevronRight, 
  Star, 
  Search,
  UserCheck,
  Building2,
  ExternalLink,
  ArrowRight,
  Globe,
  Fingerprint,
  ShieldCheck,
  Trophy,
  User,
  Users,
  Menu,
  X,
  Navigation,
  Loader2,
  Sparkles,
  Languages,
  MessageCircle,
  Send,
  AlertCircle,
  Zap,
  LogOut,
  LogIn,
  LayoutDashboard,
  Check,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

import { 
  INDIAN_ELECTION_STEPS, 
  ELECTION_NEWS_FEED, 
  MOCK_CANDIDATES, 
  ELECTION_DATE,
  type Candidate, 
  type NewsArticle, 
  type Step,
  type Page
} from './data';

// Fix Leaflet marker icon issue with CDN paths for maximum reliability
const L_ICON_URL = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const L_ICON_2X_URL = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const L_SHADOW_URL = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: L_ICON_URL,
  iconRetinaUrl: L_ICON_2X_URL,
  shadowUrl: L_SHADOW_URL,
});

// --- Types ---
// Data moved to src/data.ts

// --- Feedback System ---
function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', feedback: '', type: 'suggestion' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', feedback: '', type: 'suggestion' });
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Feedback submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-cv-dark/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            {submitted ? (
              <div className="p-16 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter font-display">Feedback <span className="text-cv-blue">Stored</span></h3>
                <p className="text-cv-dark/60 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                  Thank you for contributing to <br/> the democratic interface.
                </p>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-cv-dark/5 bg-cv-dark text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cv-blue rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-widest leading-none">Citizens Feedback</h3>
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">Improve the Democratic Interface</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-2">Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-cv-light rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-cv-blue border-none" 
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-cv-light rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-cv-blue border-none" 
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-2">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['suggestion', 'issue'].map(type => (
                        <button 
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.type === type ? 'bg-cv-blue text-white shadow-lg' : 'bg-cv-light text-cv-dark/40 hover:text-cv-dark'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-2">Message</label>
                    <textarea 
                      required
                      value={formData.feedback}
                      onChange={e => setFormData({ ...formData, feedback: e.target.value })}
                      rows={4}
                      className="w-full bg-cv-light rounded-2xl p-5 text-xs font-bold focus:ring-2 focus:ring-cv-blue border-none resize-none" 
                      placeholder="Share your thoughts or report an issue..."
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-cv-dark text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Dispatch
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- AI Assistant ---
// --- Quiz Data ---

const NewsCard = memo(({ article }: { article: NewsArticle }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`group flex flex-col h-full glass rounded-[32px] p-8 !bg-white/40 hover:!bg-white hover:shadow-xl transition-all duration-500 relative overflow-hidden ${article.importance === 'high' ? 'ring-2 ring-cv-blue/20' : ''}`}
  >
    {article.importance === 'high' && (
      <div className="absolute top-0 right-0 p-4">
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cv-blue opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cv-blue"></span>
        </span>
      </div>
    )}
    
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
          article.category === 'pre-poll' ? 'bg-amber-100 text-amber-700' :
          article.category === 'polling-day' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {article.category.replace('-', ' ')}
        </div>
        <span className="text-[9px] font-bold text-cv-dark/30 uppercase tracking-widest">{article.time}</span>
      </div>
      {article.region && article.region !== 'National' && (
        <span className="text-[8px] font-black bg-cv-dark text-white px-2 py-0.5 rounded uppercase tracking-widest">{article.region}</span>
      )}
    </div>

    <h4 className="text-xl font-black tracking-tight mb-4 group-hover:text-cv-blue transition-colors leading-tight">
      {article.title}
    </h4>
    
    <p className="text-sm font-medium text-cv-dark/60 mb-8 flex-1 leading-relaxed italic">
      {article.summary}
    </p>

    <div className="pt-6 border-t border-cv-dark/5 flex items-center justify-between mt-auto">
      <div className="flex flex-col">
         <span className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40">{article.source}</span>
         {article.constituency && (
           <span className="text-[8px] font-bold text-cv-blue uppercase mt-1">{article.constituency}</span>
         )}
      </div>
      <a 
        href={article.url} 
        target="_blank" 
        rel="noreferrer" 
        className="w-8 h-8 rounded-full bg-cv-light flex items-center justify-center text-cv-blue hover:bg-cv-blue hover:text-white transition-all transform hover:rotate-45"
        aria-label={`Read article: ${article.title}`}
      >
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  </motion.div>
));

function CivicNews() {
  const [activeTab, setActiveTab] = useState<'all' | 'pre-poll' | 'polling-day' | 'post-poll'>('all');
  const [selectedRegion, setSelectedRegion] = useState("National");

  const regions = ["National", "Mumbai", "Delhi", "Bangalore"];

  const filteredNews = ELECTION_NEWS_FEED.filter(article => {
    const categoryMatch = activeTab === 'all' || article.category === activeTab;
    const regionMatch = selectedRegion === 'National' 
      ? article.region === 'National' 
      : article.region === selectedRegion || article.region === 'National'; // Show national news always or just regional?
    
    return categoryMatch && regionMatch;
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-cv-dark/5 pb-10 gap-8">
          <div className="space-y-4">
            <div className="cv-badge">Democratic Dispatch</div>
            <h3 className="text-6xl font-black tracking-tighter uppercase font-display leading-none">Election <span className="text-cv-blue">Intelligence</span></h3>
            <p className="text-cv-dark/40 font-bold uppercase text-[10px] tracking-widest max-w-lg">
              Verified news, procedural updates, and localized insights gathered from official circulars and on-ground reports.
            </p>
          </div>
          
          <div className="flex bg-cv-dark/5 p-1 rounded-2xl shrink-0 h-fit">
            {['all', 'pre-poll', 'polling-day', 'post-poll'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-cv-blue text-white shadow-lg' : 'text-cv-dark/40 hover:text-cv-dark'}`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-cv-dark/20 self-center mr-4">Filter By Region:</span>
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${selectedRegion === region ? 'bg-cv-dark text-white border-cv-dark shadow-md' : 'bg-white text-cv-dark/40 border-cv-dark/5 hover:border-cv-blue/30 hover:text-cv-blue'}`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </AnimatePresence>
      </div>
      
      {filteredNews.length === 0 && (
        <div className="py-40 text-center">
          <div className="cv-badge opacity-20 scale-150 mb-8">No Regional Alerts</div>
          <p className="text-xl font-bold text-cv-dark/20 uppercase tracking-widest italic">Monitoring democratic signals in this sector...</p>
        </div>
      )}
    </div>
  );
}

// --- Quiz Data ---
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const CIVIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the minimum age required to vote in India's General Elections?",
    options: ["16 Years", "18 Years", "21 Years", "25 Years"],
    correctAnswer: 1,
    explanation: "The 61st Amendment Act of 1988 lowered the voting age from 21 to 18 years."
  },
  {
    id: 2,
    question: "What does VVPAT stand for in the context of Indian Elections?",
    options: ["Voter Verified Paper Audit Trail", "Voter Validated Paper Account Task", "Verified Voter Paper Access Tool", "Virtual Voter Paper Audit Tracker"],
    correctAnswer: 0,
    explanation: "VVPAT allows voters to verify that their vote was cast correctly by viewing a paper slip for 7 seconds."
  },
  {
    id: 3,
    question: "Which electronic device is NOT connected to any network (Internet/WiFi) for security?",
    options: ["Aadhar Server", "EVM (Electronic Voting Machine)", "VVPAT", "Both EVM and VVPAT"],
    correctAnswer: 3,
    explanation: "EVMs and VVPATs are stand-alone machines, meaning they have no wired or wireless communication capabilities, making them un-hackable via remote networks."
  },
  {
    id: 4,
    question: "What color is the 'Top Secret' ink used for marking a voter's finger?",
    options: ["Black", "Blue/Purple", "Red", "Green"],
    correctAnswer: 1,
    explanation: "Indelible ink is typically purple/blue and contains silver nitrate, which reacts with skin to leave a semi-permanent stain."
  },
  {
    id: 5,
    question: "Who is the current head of the Election Commission of India?",
    options: ["Chief Justice of India", "Prime Minister", "Chief Election Commissioner", "President of India"],
    correctAnswer: 2,
    explanation: "The Chief Election Commissioner (CEC) heads the ECI, an autonomous constitutional authority."
  }
];

function CivicQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === CIVIC_QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentQuestion < CIVIC_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-12">
        <div className="bg-cv-dark text-white rounded-[40px] p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-cv-yellow" />
          <Trophy className="w-20 h-20 text-cv-yellow mx-auto mb-8" />
          <h3 className="text-5xl font-black tracking-tighter uppercase font-display mb-4">Quiz <span className="text-cv-blue">Complete</span></h3>
          <p className="text-xl font-bold text-white/60 mb-12 uppercase tracking-widest">Digital Civic Literacy Score</p>
          
          <div className="text-8xl font-black font-display mb-12 text-cv-yellow">
            {score}/{CIVIC_QUIZ_QUESTIONS.length}
          </div>

          <div className="space-y-4">
            <button 
              onClick={resetQuiz}
              className="w-full bg-cv-blue text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Restart Discovery
            </button>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-8">Your results contribute to the national literacy index.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const q = CIVIC_QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / CIVIC_QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12 flex items-end justify-between border-b border-cv-dark/5 pb-8">
        <div>
          <div className="cv-badge mb-3">Civic Literacy Assessment</div>
          <h3 className="text-5xl font-black tracking-tighter uppercase font-display">Power of <span className="text-cv-blue">Knowledge</span></h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-cv-dark/40 uppercase tracking-widest mb-1">Question {currentQuestion + 1} of {CIVIC_QUIZ_QUESTIONS.length}</p>
          <div className="w-48 h-2 bg-cv-dark/5 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-cv-blue" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12">
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] p-12 shadow-sm border border-cv-dark/5"
          >
            <h4 className="text-2xl font-black tracking-tight mb-12 flex gap-4 items-start">
              <span className="w-10 h-10 bg-cv-light rounded-xl flex items-center justify-center shrink-0 text-cv-blue font-display text-lg">Q</span>
              {q.question}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === q.correctAnswer;
                let bgClass = "bg-cv-light hover:bg-cv-blue/5 border-transparent";
                
                if (showFeedback) {
                  if (isCorrect) bgClass = "bg-green-500 text-white border-green-500";
                  else if (isSelected) bgClass = "bg-red-500 text-white border-red-500";
                  else bgClass = "bg-cv-light opacity-50 border-transparent text-cv-dark/30";
                }

                return (
                  <button 
                    key={i}
                    onClick={() => handleAnswerSelect(i)}
                    className={`p-6 rounded-3xl text-left font-bold text-sm border-2 transition-all flex items-center justify-between ${bgClass}`}
                  >
                    {opt}
                    {showFeedback && i === q.correctAnswer && <CheckCircle2 className="w-5 h-5" />}
                    {showFeedback && isSelected && i !== q.correctAnswer && <X className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-8 bg-cv-blue/5 rounded-3xl border border-cv-blue/10 flex gap-6"
                >
                  <div className="w-12 h-12 bg-cv-blue text-white rounded-2xl flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-cv-blue uppercase tracking-widest mb-2">Contextual Knowledge</p>
                    <p className="text-lg font-bold italic text-cv-dark/80 leading-snug">{q.explanation}</p>
                  </div>
                  <button 
                    onClick={nextQuestion}
                    className="ml-auto bg-cv-dark text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl self-center"
                  >
                    {currentQuestion < CIVIC_QUIZ_QUESTIONS.length - 1 ? 'Next Pulse' : 'View Results'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- Candidate Data ---

function PartyEmblem({ candidate, size = 'md' }: { candidate: Candidate; size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-10 h-10';
  const containerSize = size === 'sm' ? 'w-8 h-8 rounded-lg' : size === 'md' ? 'w-12 h-12 rounded-xl' : 'w-20 h-20 rounded-[32px]';
  
  const Icon = candidate.partyIcon === 'zap' ? Zap : 
               candidate.partyIcon === 'users' ? Users : 
               candidate.partyIcon === 'globe' ? Globe : Sparkles;

  return (
    <div className={`${containerSize} ${candidate.partyColor} flex items-center justify-center text-white shadow-lg relative group-hover:scale-110 transition-transform`}>
      <Icon className={iconSize} />
      {size !== 'lg' && (
        <div className="absolute -bottom-1 -right-1 bg-white text-cv-dark text-[6px] font-black px-1 rounded shadow-sm border border-cv-dark/5">
          {candidate.partyLogo}
        </div>
      )}
    </div>
  );
}

const CandidateCard = memo(({ 
  candidate, 
  onClick, 
  onCompare, 
  isComparing 
}: { 
  candidate: Candidate; 
  onClick: () => void;
  onCompare: (candidate: Candidate, e: React.MouseEvent) => void;
  isComparing: boolean;
}) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    onClick={onClick}
    className="glass group p-8 rounded-[48px] cursor-pointer hover:shadow-2xl transition-all duration-500 border border-cv-dark/5 bg-white/40 hover:bg-white relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-8 flex flex-col gap-4 items-end">
      <button 
        onClick={(e) => onCompare(candidate, e)}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isComparing ? 'bg-cv-blue text-white shadow-lg' : 'bg-white/40 text-cv-dark/20 hover:text-cv-blue hover:bg-white'}`}
        aria-label={isComparing ? "Remove from comparison" : "Add to comparison"}
      >
        {isComparing ? <Check className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
      </button>
      <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
        <div className="w-10 h-10 rounded-full bg-cv-dark text-white flex items-center justify-center shadow-lg">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>

    <div className="flex items-start gap-8 mb-10">
      <PartyEmblem candidate={candidate} size="lg" />
      <div>
        <h4 className="text-3xl font-black tracking-tighter text-cv-dark group-hover:text-cv-blue transition-colors uppercase font-display leading-none">{candidate.name}</h4>
        <p className="text-cv-blue font-black text-[10px] uppercase tracking-[0.2em] mt-3">{candidate.party}</p>
        <div className="flex items-center gap-2 mt-4">
          <MapPin className="w-3 h-3 text-cv-dark/20" />
          <span className="text-[10px] font-bold text-cv-dark/30 uppercase tracking-widest">{candidate.constituency}</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-10">
      <div className="bg-cv-dark/5 p-5 rounded-3xl">
        <p className="text-[8px] font-black text-cv-dark/20 uppercase tracking-tighter mb-1">Attendance</p>
        <p className="text-2xl font-black text-cv-dark leading-none">{candidate.attendance}%</p>
      </div>
      <div className="bg-cv-dark/5 p-5 rounded-3xl">
        <p className="text-[8px] font-black text-cv-dark/20 uppercase tracking-tighter mb-1">Assets</p>
        <p className="text-2xl font-black text-cv-dark leading-none">{candidate.assets}</p>
      </div>
    </div>

    <div className="bg-cv-light rounded-2xl p-4 flex items-center justify-between group-hover:bg-cv-blue group-hover:text-white transition-all">
      <span className="text-[10px] font-black uppercase tracking-widest">View Detailed Affidavit</span>
      <ArrowRight className="w-4 h-4" />
    </div>
  </motion.div>
));

function CandidateSearch({ t }: { t: TranslationSet }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [compareList, setCompareList] = useState<Candidate[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');

  const filteredCandidates = searchTerm.trim() === "" 
    ? MOCK_CANDIDATES // Show all if search is empty
    : MOCK_CANDIDATES.filter(c => 
        c.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const toggleCompare = (candidate: Candidate, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.find(c => c.id === candidate.id)) {
      setCompareList(compareList.filter(c => c.id !== candidate.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, candidate]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="mb-20 text-center space-y-4">
        <div className="cv-badge mx-auto">{t.candidates.badge}</div>
        <h3 className="text-7xl font-black tracking-tighter uppercase font-display leading-none">{t.candidates.title} <span className="text-cv-blue">{t.candidates.titleSpan}</span></h3>
        <p className="text-cv-dark/40 font-bold uppercase text-[10px] tracking-widest max-w-xl mx-auto">
          Compare up to 4 representatives side-by-side using legislative data and verified affidavits. Transparency is the cornerstone of democracy.
        </p>
      </div>

      {viewMode === 'compare' && compareList.length > 0 && (
        <MetricVisualization candidates={compareList} />
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-12">
          <div className="w-full lg:max-w-2xl relative">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-cv-dark/20" />
          </div>
          <input 
            type="text"
            placeholder={t.candidates.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass rounded-[32px] py-6 pl-16 pr-8 text-sm font-bold border-none !bg-white/60 focus:ring-4 focus:ring-cv-blue/10 transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-6 flex items-center text-cv-dark/20 hover:text-cv-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 glass p-2 rounded-full !bg-white/60">
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-cv-dark text-white' : 'text-cv-dark/40 hover:text-cv-dark'}`}
          >
            Directory
          </button>
          <button 
            onClick={() => setViewMode('compare')}
            disabled={compareList.length < 2}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'compare' ? 'bg-cv-blue text-white' : 'text-cv-dark/40 hover:text-cv-dark disabled:opacity-30 disabled:cursor-not-allowed'}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Compare ({compareList.length}/4)
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCandidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id}
                candidate={candidate}
                onClick={() => setSelectedCandidate(candidate)}
                onCompare={toggleCompare}
                isComparing={!!compareList.find(c => c.id === candidate.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[48px] overflow-hidden custom-scrollbar overflow-x-auto"
        >
          <div className={`flex min-w-[${compareList.length * 300}px] md:min-w-full`}>
            {compareList.map((candidate, idx) => (
              <div key={candidate.id} className={`flex-1 p-12 space-y-10 min-w-[300px] ${idx !== compareList.length - 1 ? 'border-r border-cv-dark/5' : ''}`}>
                <div className="text-center">
                  <div className="flex justify-center mb-8">
                    <PartyEmblem candidate={candidate} size="lg" />
                  </div>
                  <h4 className="text-4xl font-black tracking-tighter uppercase font-display mb-2">{candidate.name}</h4>
                  <p className="text-cv-blue font-black text-[12px] uppercase tracking-[0.2em]">{candidate.party}</p>
                </div>

                <div className="space-y-12">
                  <ComparisonSection title="Statutory Data" items={[
                    { label: "Education", value: candidate.education },
                    { label: "Constituency", value: candidate.constituency },
                    { label: "Criminal Cases", value: `${candidate.criminalCases} Cases`, highlight: candidate.criminalCases > 0 ? 'text-red-500' : 'text-green-600' }
                  ]} />

                  <ComparisonSection title="Legislative Record" items={[
                    { label: "House Attendance", value: `${candidate.attendance}%`, highlight: candidate.attendance > 90 ? 'text-cv-blue' : '' },
                    { label: "Assembly Debates", value: `${candidate.debates} Sessions` },
                    { label: "Questions Raised", value: candidate.questions.toString() },
                    { label: "Private Member Bills", value: candidate.bills.toString() },
                    { label: "Fund Spending", value: `${candidate.spending} Utilized`, highlight: 'text-emerald-600' }
                  ]} />
                  
                  <ComparisonSection title="Financial Snapshot" items={[
                    { label: "Total Assets", value: candidate.assets, subValue: candidate.assetsDetail },
                    { label: "Liabilities", value: candidate.liabilities, subValue: candidate.liabilitiesDetail }
                  ]} />

                  <section>
                    <h5 className="text-[10px] font-black text-cv-dark/20 uppercase tracking-[0.3em] mb-6">Manifesto Focus</h5>
                    <div className="space-y-4">
                      {candidate.manifesto.slice(0, 3).map((point, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-2 h-2 mt-2 bg-cv-blue rounded-full shrink-0" />
                          <p className="text-xs font-bold text-cv-dark/70 italic leading-snug">{point}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-cv-dark/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-[48px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-10 border-b border-cv-dark/5 bg-cv-dark text-white flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-6">
                  <PartyEmblem candidate={selectedCandidate} size="md" />
                  <div>
                    <h3 className="font-black text-2xl uppercase tracking-tighter leading-none">{selectedCandidate.name}</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-2">{selectedCandidate.party} • Profile 2029</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="p-3 hover:bg-white/10 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-12 space-y-12">
                <div className="grid grid-cols-2 gap-8">
                  <ProfileStat label="Education" value={selectedCandidate.education} />
                  <ProfileStat label="Constituency" value={selectedCandidate.constituency} />
                  <ProfileStat label="House Attendance" value={`${selectedCandidate.attendance}%`} highlight="text-cv-blue" />
                  <ProfileStat label="Criminality" value={selectedCandidate.criminalCases + " Cases"} sub={selectedCandidate.criminalDetail} highlight={selectedCandidate.criminalCases > 0 ? "text-red-500" : "text-green-600"} />
                </div>

                <div className="grid grid-cols-3 gap-6 py-8 border-y border-cv-dark/5">
                   <ProfileStat label="Debates" value={selectedCandidate.debates.toString()} />
                   <ProfileStat label="Questions" value={selectedCandidate.questions.toString()} />
                   <ProfileStat label="Member Bills" value={selectedCandidate.bills.toString()} />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <ProfileStat label="Net Worth" value={selectedCandidate.assets} sub={selectedCandidate.assetsDetail} highlight="text-green-600" />
                  <ProfileStat label="MPLAD Spending" value={selectedCandidate.spending} />
                </div>

                <section>
                  <h5 className="text-[10px] font-black text-cv-dark/20 uppercase tracking-[0.3em] mb-6">2029 Election Manifesto</h5>
                  <div className="space-y-6">
                    {selectedCandidate.manifesto.map((item, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <div className="w-10 h-10 bg-cv-blue/10 rounded-xl flex items-center justify-center shrink-0 text-cv-blue font-display text-lg font-black">{i+1}</div>
                        <p className="text-lg font-bold italic text-cv-dark/80 leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="p-8 bg-cv-light rounded-3xl space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-cv-blue" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Affidavit Verification</span>
                  </div>
                  <p className="text-xs font-bold text-cv-dark/50 leading-relaxed uppercase">
                    Data sourced from ECI Form 26. Liabilities include: {selectedCandidate.liabilitiesDetail}. Assets detail: {selectedCandidate.assetsDetail}.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComparisonSection({ title, items }: { title: string; items: { label: string; value: string; subValue?: string; highlight?: string }[] }) {
  return (
    <section className="space-y-6 text-left">
      <h5 className="text-[9px] font-black text-cv-dark/20 uppercase tracking-[0.4em]">{title}</h5>
      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="space-y-1">
            <p className="text-[8px] font-black text-cv-dark/40 uppercase tracking-widest">{item.label}</p>
            <p className={`text-xl font-black uppercase tracking-tighter ${item.highlight || 'text-cv-dark'}`}>{item.value}</p>
            {item.subValue && <p className="text-[10px] font-bold text-cv-dark/30 italic leading-tight">{item.subValue}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProfileStat({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-bold text-cv-dark/20 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-black uppercase tracking-tight ${highlight || 'text-cv-dark'}`}>{value}</p>
      {sub && <p className="text-[10px] font-semibold text-cv-dark/40 italic leading-tight">{sub}</p>}
    </div>
  );
}

function MetricVisualization({ candidates }: { candidates: Candidate[] }) {
  const data = candidates.map(c => ({
    name: c.name,
    attendance: c.attendance,
    debates: c.debates,
    questions: c.questions,
    bills: c.bills,
    spending: parseInt(c.spending) || 0,
    partyColor: c.partyColor
  }));

  const metrics = [
    { key: 'attendance', label: 'Attendance %', color: '#2563EB' },
    { key: 'debates', label: 'Debates', color: '#10B981' },
    { key: 'questions', label: 'Questions', color: '#F59E0B' },
    { key: 'bills', label: 'Bills', color: '#8B5CF6' },
    { key: 'spending', label: 'Fund Spending %', color: '#059669' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16"
    >
      {metrics.map(metric => (
        <div key={metric.key} className="glass p-8 rounded-[32px] h-[320px] flex flex-col relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cv-dark/5" />
          <h5 className="text-[10px] font-black text-cv-dark/20 uppercase tracking-[0.3em] mb-6 flex justify-between items-center">
            {metric.label}
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
          </h5>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: -30, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const isPercent = metric.label.includes('%');
                      return (
                        <div className="glass !bg-cv-dark text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase shadow-xl">
                          {payload[0].value}{isPercent ? '%' : ' Total'}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey={metric.key} 
                  radius={[0, 12, 12, 0]} 
                  barSize={data.length > 2 ? 12 : 20}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={metric.color} fillOpacity={0.6 + (index * 0.1)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-6 border-t border-cv-dark/5 space-y-3">
            {data.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 max-w-[70%]">
                  <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: metric.color }} />
                  <span className="text-[9px] font-bold text-cv-dark/60 uppercase truncate">{d.name}</span>
                </div>
                <span className="text-[10px] font-black text-cv-dark">
                  {d[metric.key as keyof typeof d]}{metric.label.includes('%') ? '%' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}


function VoterEligibility() {
  const [age, setAge] = useState("");
  const [isCitizen, setIsCitizen] = useState<boolean | null>(null);
  const [isResident, setIsResident] = useState<boolean | null>(null);
  const [result, setResult] = useState<{ eligible: boolean; reason: string } | null>(null);

  const checkEligibility = () => {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0) {
      setResult({ eligible: false, reason: "Please enter a valid age." });
      return;
    }

    if (ageNum < 18) {
      setResult({ eligible: false, reason: "You must be at least 18 years old to vote in India." });
    } else if (isCitizen === false) {
      setResult({ eligible: false, reason: "Only Indian citizens are eligible to vote." });
    } else if (isResident === false) {
      setResult({ eligible: false, reason: "You must be an ordinary resident in the constituency where you want to register." });
    } else if (isCitizen === true && isResident === true) {
      setResult({ eligible: true, reason: "You meet the primary criteria for voter registration! Use Form 6 to enroll." });
    } else {
      setResult({ eligible: false, reason: "Please answer all questions to verify eligibility." });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-16 text-center space-y-4">
        <div className="cv-badge mx-auto">Citizen Checker</div>
        <h3 className="text-6xl font-black tracking-tighter uppercase font-display leading-none">Voter <span className="text-cv-blue">Eligibility</span></h3>
        <p className="text-cv-dark/40 font-bold uppercase text-[10px] tracking-widest max-w-lg mx-auto">
          Verify your eligibility to participate in the world's largest democratic exercise.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="glass rounded-[40px] p-12 space-y-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-4">What is your age?</label>
              <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter current age"
                className="w-full glass !bg-white/20 rounded-2xl py-5 px-8 font-bold text-sm focus:ring-4 focus:ring-cv-blue/10 border-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-4">Are you a Citizen of India?</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsCitizen(true)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isCitizen === true ? 'bg-cv-blue text-white shadow-lg' : 'glass !bg-white/20 text-cv-dark/40 hover:text-cv-dark'}`}
                >
                  Yes
                </button>
                <button 
                  onClick={() => setIsCitizen(false)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isCitizen === false ? 'bg-cv-blue text-white shadow-lg' : 'glass !bg-white/20 text-cv-dark/40 hover:text-cv-dark'}`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-cv-dark/40 ml-4">Are you an Ordinary Resident of your constituency?</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsResident(true)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isResident === true ? 'bg-cv-blue text-white shadow-lg' : 'glass !bg-white/20 text-cv-dark/40 hover:text-cv-dark'}`}
                >
                  Yes
                </button>
                <button 
                  onClick={() => setIsResident(false)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isResident === false ? 'bg-cv-blue text-white shadow-lg' : 'glass !bg-white/20 text-cv-dark/40 hover:text-cv-dark'}`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={checkEligibility}
            className="w-full bg-cv-dark text-white py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:opacity-90 active:scale-95 transition-all shadow-xl"
          >
            Run Eligibility Protocol
          </button>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-3xl border ${result.eligible ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} flex gap-6`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${result.eligible ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {result.eligible ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-6 h-6" />}
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${result.eligible ? 'text-green-700' : 'text-red-700'}`}>
                    {result.eligible ? 'Access Granted' : 'Access Restricted'}
                  </p>
                  <p className="text-lg font-bold italic text-cv-dark leading-snug">{result.reason}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-12">
          <section>
            <h5 className="text-[10px] font-black text-cv-dark/20 uppercase tracking-[0.3em] mb-8">Statutory Qualifications</h5>
            <div className="space-y-6">
              {[
                { title: "Citizenship", desc: "Only Indian Citizens are allowed to vote. NRIs can register but must be present at the booth." },
                { title: "Age Limit", desc: "Must have completed 18 years on the qualifying date (Jan 1, Apr 1, Jul 1, Oct 1)." },
                { title: "Sound Mind", desc: "Persons of unsound mind and declared so by a competent court are disqualified." },
                { title: "Legal Standing", desc: "Certain criminal convictions and corrupt practices may lead to temporary disqualification." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 bg-white border border-cv-dark/5 rounded-2xl flex items-center justify-center shrink-0 text-cv-blue font-display text-lg font-black group-hover:bg-cv-blue group-hover:text-white transition-all shadow-sm">{i+1}</div>
                  <div>
                    <h6 className="text-[11px] font-black uppercase tracking-widest mb-1">{item.title}</h6>
                    <p className="text-xs font-semibold text-cv-dark/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-cv-dark text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
              <ShieldCheck className="w-40 h-40" />
            </div>
            <div className="relative z-10 space-y-6">
              <p className="text-[10px] font-black text-cv-blue uppercase tracking-widest">Electoral Disqualification</p>
              <p className="text-xl font-bold leading-tight uppercase font-display italic">
                Art. 326 of the Constitution: Universal Adult Suffrage is subject to provisions regarding non-residence, unsoundness of mind, crime or corrupt or illegal practice.
              </p>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">ECI Handbook Ref: Vol 1 // Sect 2</span>
                <Globe className="w-4 h-4 text-cv-blue" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VotingMethods() {
  const [activeMethod, setActiveMethod] = useState<'evm' | 'postal' | 'home' | 'blind'>('evm');

  const methods = [
    {
      id: 'evm' as const,
      title: 'EVM & VVPAT',
      icon: <Zap className="w-6 h-6" />,
      desc: 'Electronic Voting Machine with verifiable paper audit trail.',
      steps: [
        "Identity verification by first polling official.",
        "Marking of finger with indelible ink by second official.",
        "Activation of voting machine by presiding officer.",
        "Press blue button against candidate of choice on Balloting Unit.",
        "Verify 7-sec slip on VVPAT screen before it drops into the box."
      ]
    },
    {
      id: 'postal' as const,
      title: 'Postal Ballot',
      icon: <Send className="w-6 h-6" />,
      desc: 'For service voters and those on election duty.',
      steps: [
        "Apply via Form 12 to the Returning Officer.",
        "Receive postal ballot via registered mail or electronic transfer.",
        "Mark choice and sign the declaration (Form 13A).",
        "Place ballot in inner envelope (Form 13B).",
        "Dispatch via registered post before counting day."
      ]
    },
    {
      id: 'home' as const,
      title: 'Home Voting',
      icon: <User className="w-6 h-6" />,
      desc: 'Exclusive for 85+ seniors and PwD (40%+ disability).',
      steps: [
        "Apply using Form 12D within 5 days of election notification.",
        "Two polling officials visit registered residence.",
        "Full protocol of secret ballot maintained at home.",
        "Videography of the entire process (with privacy).",
        "Ballot sealed and taken to safe storage by officials."
      ]
    },
    {
      id: 'blind' as const,
      title: 'Assisted Voting',
      icon: <ShieldCheck className="w-6 h-6" />,
      desc: 'Braille and companion support for differently abled.',
      steps: [
        "EVM balloting units feature Braille numbers/markings.",
        "Dummy or companion (18+) allowed for visual assistance.",
        "Declaration by companion (Form 18) for secrecy.",
        "Priority queue access for persons with disabilities.",
        "Pick-and-drop facility often organized by ECI."
      ]
    }
  ];

  const current = methods.find(m => m.id === activeMethod)!;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-16 text-center space-y-4">
        <div className="cv-badge mx-auto">Voter Protocol</div>
        <h3 className="text-6xl font-black tracking-tighter uppercase font-display leading-none">Voting <span className="text-cv-blue">Methods</span></h3>
        <p className="text-cv-dark/40 font-bold uppercase text-[10px] tracking-widest max-w-lg mx-auto">
          Technology and accessibility features designed to ensure every citizen can exercise their franchise securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMethod(m.id)}
            className={`p-8 rounded-[38px] transition-all text-left group border ${activeMethod === m.id ? 'bg-cv-dark text-white border-cv-dark shadow-2xl scale-[1.02]' : 'glass !bg-white/40 text-cv-dark border-transparent hover:border-cv-blue/30'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${activeMethod === m.id ? 'bg-cv-blue text-white' : 'bg-cv-light text-cv-dark/20 group-hover:bg-cv-blue/10 group-hover:text-cv-blue'}`}>
              {m.icon}
            </div>
            <h5 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Method {m.id === 'evm' ? '01' : m.id === 'postal' ? '02' : m.id === 'home' ? '03' : '04'}</h5>
            <h4 className="text-xl font-black uppercase font-display italic leading-none mb-4">{m.title}</h4>
            <p className={`text-xs font-bold leading-relaxed ${activeMethod === m.id ? 'text-white/50' : 'text-cv-dark/30'}`}>
              {m.desc}
            </p>
          </button>
        ))}
      </div>

      <div className="glass rounded-[48px] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Globe className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="cv-badge">Procedure Flow</div>
            <h4 className="text-4xl font-black tracking-tighter uppercase font-display leading-tight italic">
              Standard Operating <br /> <span className="text-cv-blue">Procedure (SOP)</span>
            </h4>
            <div className="p-8 bg-cv-dark text-white rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-cv-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest">Legal Mandate</span>
              </div>
              <p className="text-sm font-bold text-white/50 leading-relaxed italic">
                Secret ballot is an absolute right. Any attempt to photograph a marked ballot or machine is a punishable offense under ECI rules.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {current.steps.map((step, i) => (
              <motion.div 
                key={`${current.id}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 pb-6 border-b border-cv-dark/5 last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-cv-light text-cv-dark/30 flex items-center justify-center font-display font-black text-xs shrink-0">{i + 1}</div>
                <p className="text-sm font-bold text-cv-dark/70 leading-snug pt-2 uppercase tracking-tight">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- AI Assistant ---
// --- Quiz Data ---
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

function PollingStationMap({ epicNumber }: { epicNumber: string }) {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  const searchBooth = async () => {
    if (!epicNumber) return;
    setLoading(true);

    setTimeout(() => {
      // Mock coordinates for major Indian cities
      const mocks: [number, number][] = [
        [28.6139, 77.2090], // Delhi
        [19.0760, 72.8777], // Mumbai
        [13.0827, 80.2707], // Chennai
        [22.5726, 88.3639], // Kolkata
        [12.9716, 77.5946], // Bangalore
        [17.3850, 78.4867], // Hyderabad
      ];
      
      const randomLocation = mocks[Math.floor(Math.random() * mocks.length)];
      setLocation(randomLocation);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="relative h-full min-h-[400px] border border-editorial-ink bg-stone-100 group">
      {!location && !loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 text-center bg-white/80 backdrop-blur-sm">
          <MapPin className="w-12 h-12 text-editorial-accent mb-4 opacity-20" />
          <p className="editorial-label text-editorial-ink mb-4">Leaflet Static Visualizer</p>
          <p className="text-sm italic text-stone-500 max-w-xs leading-relaxed">
            Enter your EPIC number on the left and click "Locate Booth" to visualize your polling station on the map.
          </p>
          <button 
            onClick={searchBooth}
            disabled={!epicNumber}
            className="mt-6 px-6 py-2 border border-editorial-ink font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-editorial-ink hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-editorial-ink"
          >
            Locate Sample Booth
          </button>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
          <Loader2 className="w-8 h-8 animate-spin text-editorial-accent mb-4" />
          <p className="editorial-label animate-pulse">Syncing with ECI Geo-Server...</p>
        </div>
      )}

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {location && (
          <>
            <MapUpdater center={location} />
            <Marker position={location}>
              <Popup>
                <div className="p-2 font-sans">
                  <h4 className="font-bold text-sm text-editorial-ink uppercase">Designated Polling Station</h4>
                  <p className="text-xs text-stone-500 mt-1">Part No. 124 | Serial No. 562 | Primary School Block B</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}



// --- Translations ---
type Language = 'en' | 'hi' | 'bn' | 'mr' | 'ta';

interface TranslationSet {
  nav: { [key: string]: string };
  home: { [key: string]: string };
  candidates: { [key: string]: string };
  common: { [key: string]: string };
}

const TRANSLATIONS: Record<Language, TranslationSet> = {
  en: {
    nav: { home: 'Home', booths: 'Booths', candidates: 'Candidates', process: 'Process', eligibility: 'Eligibility', methods: 'Methods', quiz: 'Quiz', news: 'Intelligence', signin: 'Sign In', register: 'Register To Vote' },
    home: { badge: 'Official Non-Partisan Data', title1: 'Every Vote', title2: 'Counts For', title3: "India's Future", subtitle: 'Largest Democracy', cta: 'Start Voting Process' },
    candidates: { badge: 'Candidate Intelligence', title: 'Know Your', titleSpan: 'Representatives', searchPlaceholder: 'Enter Constituency (e.g., Mumbai South)...', manifestoTitle: 'View Manifesto' },
    common: { poweredBy: 'Powered by', lang: 'English' }
  },
  hi: {
    nav: { home: 'होम', booths: 'बूथ', candidates: 'उम्मीदवार', process: 'प्रक्रिया', eligibility: 'पात्रता', methods: 'तरीके', quiz: 'क्विज़', news: 'समाचार', signin: 'साइन इन', register: 'वोट के लिए रजिस्टर करें' },
    home: { badge: 'आधिकारिक गैर-पक्षपाती डेटा', title1: 'हर वोट', title2: 'जरूरी है', title3: "भारत के भविष्य के लिए", subtitle: 'सबसे बड़ा लोकतंत्र', cta: 'मतदान प्रक्रिया शुरू करें' },
    candidates: { badge: 'उम्मीदवार जानकारी', title: 'अपने', titleSpan: 'प्रतिनिधियों को जानें', searchPlaceholder: 'क्षेत्र दर्ज करें (उदा. मुंबई दक्षिण)...', manifestoTitle: 'घोषणापत्र देखें' },
    common: { poweredBy: 'द्वारा संचालित', lang: 'हिन्दी' }
  },
  bn: {
    nav: { home: 'হোম', booths: 'বুথ', candidates: 'প্রার্থী', process: 'প্রক্রিয়া', eligibility: 'যোগ্যতা', methods: 'পদ্ধতি', quiz: 'কুইজ', news: 'সংবাদ', signin: 'সাইন ইন', register: 'ভোটের জন্য নিবন্ধন করুন' },
    home: { badge: 'অফিসিয়াল নিরপেক্ষ ডেটা', title1: 'প্রতিটি ভোট', title2: 'গণনা করা হয়', title3: "ভারতের ভবিষ্যতের জন্য", subtitle: 'বৃহত্তম গণতন্ত্র', cta: 'ভোট প্রক্রিয়া শুরু করুন' },
    candidates: { badge: 'প্রার্থী বুদ্ধিমত্তা', title: 'আপনার', titleSpan: 'প্রতিনিধিদের জানুন', searchPlaceholder: 'নির্বাচনী এলাকা লিখুন (যেমন, মুম্বাই দক্ষিণ)...', manifestoTitle: 'ম্যানিফেস্টো দেখুন' },
    common: { poweredBy: 'দ্বারা চালিত', lang: 'বাংলা' }
  },
  mr: {
    nav: { home: 'होम', booths: 'बूथ', candidates: 'उमेदवार', process: 'प्रक्रिया', eligibility: 'पात्रता', methods: 'पद्धती', quiz: 'चाचणी', news: 'बातम्या', signin: 'साइन इन', register: 'मतदानासाठी नोंदणी करा' },
    home: { badge: 'अधिकृत गैर-पक्षपाती डेटा', title1: 'प्रत्येक मत', title2: 'महत्त्वाचे आहे', title3: "भारताच्या भविष्यासाठी", subtitle: 'सर्वात मोठी लोकशाही', cta: 'मतदान प्रक्रिया सुरू करा' },
    candidates: { badge: 'उमेदवार माहिती', title: 'तुमचे', titleSpan: 'प्रतिनिधी जाणून घ्या', searchPlaceholder: 'मतदारसंघ प्रविष्ट करा (उदा. मुंबई दक्षिण)...', manifestoTitle: 'जाहीरनामा पहा' },
    common: { poweredBy: 'द्वारे समर्थित', lang: 'मराठी' }
  },
  ta: {
    nav: { home: 'முகப்பு', booths: 'சாவடிகள்', candidates: 'வேட்பாளர்கள்', process: 'செயல்முறை', eligibility: 'தகுதி', methods: 'முறைகள்', quiz: 'வினாடி வினா', news: 'செய்திகள்', signin: 'உள்நுழைக', register: 'வாக்களிக்க பதிவு செய்யுங்கள்' },
    home: { badge: 'அதிகாரப்பூர்வ சார்பற்ற தரவு', title1: 'ஒவ்வொரு வாக்கும்', title2: 'முக்கியமானது', title3: "இந்தியாவின் எதிர்காலத்திற்காக", subtitle: 'மிகப்பெரிய ஜனநாயகம்', cta: 'வாக்குப்பதிவு செயல்முறையைத் தொடங்குங்கள்' },
    candidates: { badge: 'வேட்பாளர் நுண்ணறிவு', title: 'உங்கள்', titleSpan: 'பிரதிநிதிகளைத் தெரிந்து கொள்ளுங்கள்', searchPlaceholder: 'தொகுதியை உள்ளிடவும் (எ.கா., மும்பை தெற்கு)...', manifestoTitle: 'அறிக்கையைப் பார்க்கவும்' },
    common: { poweredBy: 'ஆல் இயக்கப்படுகிறது', lang: 'தமிழ்' }
  }
};

const INDIAN_LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [language, setLanguage] = useState<Language>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [epicSearchValue, setEpicSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = useMemo(() => TRANSLATIONS[language], [language]);

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

  const toggleStepCompletion = (id: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progressPercentage = Math.round((completedSteps.size / INDIAN_ELECTION_STEPS.length) * 100);

  const currentStepData = INDIAN_ELECTION_STEPS.find(s => s.id === activeStep)!;

  return (
    <div className="min-h-screen bg-cv-peach text-cv-dark font-sans selection:bg-cv-blue selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 glass border-none !bg-cv-dark/80">
        <div className="max-w-[1450px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="cursor-pointer flex items-center gap-3 group" onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}>
              <div className="w-10 h-10 bg-cv-blue rounded-xl flex items-center justify-center shadow-lg shadow-cv-blue/20">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-[-0.02em] uppercase font-display">Civic<span className="text-white/70">Vote</span></h1>
            </div>

            {/* Language & Powered by */}
            <div className="hidden lg:flex items-center ml-2 bg-white/5 rounded-xl p-1 gap-1 border border-white/5 relative">
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
          <nav className="hidden xl:flex items-center gap-6 h-10">
            <button onClick={() => setCurrentPage('home')} className={`nav-link ${currentPage === 'home' ? 'text-cv-blue' : ''}`}>{t.nav.home}</button>
            <button onClick={() => setCurrentPage('booth')} className={`nav-link ${currentPage === 'booth' ? 'text-cv-blue' : ''}`}>{t.nav.booths}</button>
            <button onClick={() => setCurrentPage('candidates')} className={`nav-link ${currentPage === 'candidates' ? 'text-cv-blue' : ''}`}>{t.nav.candidates}</button>
            <button onClick={() => setCurrentPage('journey')} className={`nav-link ${currentPage === 'journey' ? 'text-cv-blue' : ''}`}>{t.nav.process}</button>
            <button onClick={() => setCurrentPage('eligibility')} className={`nav-link ${currentPage === 'eligibility' ? 'text-cv-blue' : ''}`}>{t.nav.eligibility}</button>
            <button onClick={() => setCurrentPage('methods')} className={`nav-link ${currentPage === 'methods' ? 'text-cv-blue' : ''}`}>{t.nav.methods}</button>
            <button onClick={() => setCurrentPage('quiz')} className={`nav-link ${currentPage === 'quiz' ? 'text-cv-blue' : ''}`}>{t.nav.quiz}</button>
            <button onClick={() => setCurrentPage('news')} className={`nav-link ${currentPage === 'news' ? 'text-cv-blue' : ''}`}>{t.nav.news}</button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex w-10 h-10 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 items-center justify-center transition-all">
              <Search className="w-4 h-4" />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>
            
            <button 
              className="cv-button-yellow" 
              onClick={() => setCurrentPage('journey')}
              aria-label="Register to Vote"
            >
              {t.nav.register}
            </button>
            
            {/* Mobile Toggle */}
            <button className="xl:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <AnimatePresence mode="wait">
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
                        <a href="https://voters.eci.gov.in" target="_blank" className="flex items-center justify-between group bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all">
                          <span className="text-[10px] font-bold uppercase tracking-widest">Voter Portal</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="https://results.eci.gov.in" target="_blank" className="flex items-center justify-between group bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all">
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
                            type="text" 
                            value={epicSearchValue}
                            onChange={(e) => setEpicSearchValue(e.target.value)}
                            placeholder="EPIC Number (e.g. ABC1234567)" 
                            className="w-full bg-cv-light rounded-2xl p-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-cv-blue/10 transition-all border-none" 
                          />
                          <button 
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

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
