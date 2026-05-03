import { memo } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { ELECTION_RESULTS, CONSTITUENCY_RESULTS } from '../data';

export const ResultsVisualization = memo(() => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="mb-16 space-y-4">
        <div className="cv-badge">Post-Election Analytics</div>
        <h3 className="text-6xl font-black tracking-tighter uppercase font-display leading-none">Election <span className="text-cv-blue">Manifestation</span></h3>
        <p className="text-cv-dark/40 font-bold uppercase text-[10px] tracking-widest max-w-lg">
          Real-time visualization of the 2026 General Election results. Validated by ECI data streams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 glass rounded-[40px] p-12 !bg-white/60">
          <h4 className="text-2xl font-black uppercase tracking-tighter font-display mb-10">National <span className="text-cv-blue">Seat Share</span></h4>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ELECTION_RESULTS}>
                <XAxis 
                  dataKey="party" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#0F172A' }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="seats" radius={[12, 12, 0, 0]}>
                  {ELECTION_RESULTS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 glass rounded-[40px] p-10 !bg-cv-dark text-white shadow-2xl">
          <h4 className="text-xl font-black uppercase tracking-widest mb-8">Party <span className="text-cv-blue">Performance</span></h4>
          <div className="space-y-6">
            {ELECTION_RESULTS.map((p) => (
              <div key={p.party} className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest">{p.party}</p>
                  <p className="text-lg font-black">{p.seats} Seats</p>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${p.percentage}%` }} 
                    style={{ backgroundColor: p.color }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 glass rounded-[40px] p-10 !bg-white/40 border border-cv-dark/5">
          <h4 className="text-xl font-black uppercase tracking-widest mb-8 text-cv-dark">Key <span className="text-cv-blue">Constituencies</span></h4>
          <div className="space-y-4">
            {CONSTITUENCY_RESULTS.map((res) => (
              <div key={res.name} className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border border-cv-dark/5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-cv-blue mb-1">{res.name}</p>
                  <p className="text-lg font-black text-cv-dark">{res.winner}</p>
                  <p className="text-[8px] font-bold text-cv-dark/30 uppercase mt-1">Party: {res.party}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-cv-dark">{res.votes}</p>
                  <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Margin: {res.margin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
