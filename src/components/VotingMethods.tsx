import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Send, User, ShieldCheck, AlertCircle, Globe } from 'lucide-react';

const METHODS = [
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

export const VotingMethods = memo(() => {
  const [activeMethod, setActiveMethod] = useState<'evm' | 'postal' | 'home' | 'blind'>('evm');

  const current = METHODS.find(m => m.id === activeMethod)!;

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
        {METHODS.map((m) => (
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
              <p className="text-sm font-bold text-white/50 leading-relaxed italic uppercase">
                Secret ballot is an absolute right. Any attempt to photograph a marked ballot or machine is a punishable offense under ECI rules.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {current.steps.map((step, i) => (
                  <div 
                    key={i}
                    className="flex gap-6 pb-6 border-b border-cv-dark/5 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-cv-light text-cv-dark/30 flex items-center justify-center font-display font-black text-xs shrink-0">{i + 1}</div>
                    <p className="text-sm font-bold text-cv-dark/70 leading-snug pt-2 uppercase tracking-tight">{step}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
});
