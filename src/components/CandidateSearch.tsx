import { useState, memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Trophy, Check, MapPin, ArrowRight, Zap, Users, Globe, Sparkles, ShieldCheck } from 'lucide-react';
import { MOCK_CANDIDATES, type Candidate, type TranslationSet } from '../data';
import { BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, Cell } from 'recharts';

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
    role="article"
    aria-label={`Candidate: ${candidate.name}`}
  >
    <div className="absolute top-0 right-0 p-8 flex flex-col gap-4 items-end">
      <button 
        onClick={(e) => onCompare(candidate, e)}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isComparing ? 'bg-cv-blue text-white shadow-lg' : 'bg-white/40 text-cv-dark/20 hover:text-cv-blue hover:bg-white'}`}
        aria-label={isComparing ? `Remove ${candidate.name} from comparison` : `Add ${candidate.name} to comparison`}
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

const ComparisonSection = ({ title, items }: { title: string; items: { label: string; value: string; subValue?: string; highlight?: string }[] }) => (
  <div className="space-y-6">
    <h5 className="text-[10px] font-black text-cv-dark/20 uppercase tracking-[0.3em] pb-3 border-b border-cv-dark/5">{title}</h5>
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i} className="flex justify-between items-start gap-4">
          <p className="text-[9px] font-bold text-cv-dark/40 uppercase tracking-widest mt-1">{item.label}</p>
          <div className="text-right">
            <p className={`text-sm font-black tracking-tight ${item.highlight || 'text-cv-dark'}`}>{item.value}</p>
            {item.subValue && <p className="text-[8px] font-bold text-cv-dark/20 italic">{item.subValue}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CandidateSearch = memo(({ t }: { t: TranslationSet }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [compareList, setCompareList] = useState<Candidate[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return MOCK_CANDIDATES;
    return MOCK_CANDIDATES.filter(c => 
      c.constituency.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const toggleCompare = useCallback((candidate: Candidate, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.find(c => c.id === candidate.id)) {
        return prev.filter(c => c.id !== candidate.id);
      } else if (prev.length < 4) {
        return [...prev, candidate];
      }
      return prev;
    });
  }, []);

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
            id="candidate-search-input"
            type="text"
            aria-label="Search candidates by name or constituency"
            placeholder={t.candidates.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass rounded-[32px] py-6 pl-16 pr-8 text-sm font-bold border-none !bg-white/60 focus:ring-4 focus:ring-cv-blue/10 transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-6 flex items-center text-cv-dark/20 hover:text-cv-dark transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 glass p-2 rounded-full !bg-white/60">
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-cv-dark text-white shadow-lg' : 'text-cv-dark/40 hover:text-cv-dark'}`}
            aria-pressed={viewMode === 'grid'}
          >
            Directory
          </button>
          <button 
            onClick={() => setViewMode('compare')}
            disabled={compareList.length < 2}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'compare' ? 'bg-cv-blue text-white shadow-lg' : 'text-cv-dark/40 hover:text-cv-dark disabled:opacity-30 disabled:cursor-not-allowed'}`}
            aria-pressed={viewMode === 'compare'}
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
          className="glass rounded-[48px] overflow-hidden custom-scrollbar overflow-x-auto border border-cv-dark/5"
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
});
