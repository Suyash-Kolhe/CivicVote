import { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { type NewsArticle } from '../data';

export const NewsCard = memo(({ article }: { article: NewsArticle }) => (
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

import { useState } from 'react';
import { ELECTION_NEWS_FEED } from '../data';

export const CivicNews = memo(() => {
  const [activeTab, setActiveTab] = useState<'all' | 'pre-poll' | 'polling-day' | 'post-poll'>('all');
  const [selectedRegion, setSelectedRegion] = useState("National");

  const regions = ["National", "Mumbai", "Delhi", "Bangalore"];

  const filteredNews = ELECTION_NEWS_FEED.filter(article => {
    const categoryMatch = activeTab === 'all' || article.category === activeTab;
    const regionMatch = selectedRegion === 'National' 
      ? article.region === 'National' 
      : article.region === selectedRegion || article.region === 'National';
    
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
});
