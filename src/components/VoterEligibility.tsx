import { memo } from 'react';
import { ShieldCheck, ArrowRight, UserCheck, HelpCircle } from 'lucide-react';

export const VoterEligibility = memo(() => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-20 text-center space-y-4">
        <div className="cv-badge mx-auto">Article 326 Compliance</div>
        <h3 className="text-6xl font-black tracking-tighter uppercase font-display leading-none">Voter <span className="text-cv-blue">Eligibility</span></h3>
        <p className="text-cv-dark/40 font-bold uppercase text-[10px] tracking-widest max-w-lg mx-auto">
          Criteria for exercising the franchise as per the Representation of the People Act, 1950.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="glass rounded-[48px] p-12 !bg-white/40 border border-cv-dark/5">
            <h4 className="text-3xl font-black uppercase font-display italic mb-10 text-cv-dark">Primary <span className="text-cv-blue">Criteria</span></h4>
            <div className="space-y-8">
              {[
                { title: 'Citizenship', text: 'Must be a rightful citizen of the Republic of India as per the Citizenship Act.' },
                { title: 'Maturity', text: 'Must have attained the age of 18 years on the qualifying date of the electoral roll.' },
                { title: 'Habitation', text: 'Must be an ordinary resident in the constituency where registration is sought.' },
                { title: 'Registration', text: 'Name must be correctly entered in the current Electoral Roll of the constituency.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 bg-cv-dark text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-cv-blue transition-colors duration-500">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black uppercase tracking-widest mb-1">{item.title}</h5>
                    <p className="text-xs font-bold text-cv-dark/40 leading-relaxed uppercase">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-cv-dark text-white rounded-[40px] shadow-2xl space-y-4 border border-cv-blue/20">
             <div className="flex items-center gap-3">
               <ShieldCheck className="w-6 h-6 text-cv-blue" />
               <span className="text-[10px] font-black uppercase tracking-widest">Procedural Guard</span>
             </div>
             <p className="text-lg font-bold italic text-white/70 leading-snug">
               Registration in the electoral roll of more than one constituency is a punishable offense. One Citizen, One Vote, One Constituency.
             </p>
          </div>
        </div>

        <div className="space-y-8">
           <section className="glass rounded-[48px] p-12 !bg-cv-blue text-white shadow-xl shadow-cv-blue/20">
            <h4 className="text-xl font-black uppercase tracking-widest mb-10 flex items-center gap-4">
              <HelpCircle className="w-6 h-6" />
              Disqualifying <span className="opacity-50">Factors</span>
            </h4>
            <div className="space-y-8">
              {[
                { title: 'Unsoundness of Mind', desc: 'Declared so by a competent court of law as per statutory standards.' },
                { title: 'Corrupt Practices', desc: 'Conviction for election-related corrupt practices or offenses.' },
                { title: 'Criminal Offenses', desc: 'Certain convictions that lead to disenfranchisement as per the RP Act.' },
                { title: 'Non-Residence', desc: 'Failure to meet the "Ordinary Resident" criteria for a specific constituency.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 bg-cv-yellow rounded-full mt-1.5 shrink-0" />
                  <div>
                    <h6 className="text-[11px] font-black uppercase tracking-widest mb-1">{item.title}</h6>
                    <p className="text-xs font-semibold text-white/50 leading-relaxed uppercase">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="glass rounded-[48px] p-12 !bg-cv-light group border border-cv-dark/5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-cv-dark/30">Verification Flow</h4>
            <div className="space-y-6">
              <p className="text-3xl font-black tracking-tighter uppercase font-display italic leading-none">
                Not Sure? <span className="text-cv-blue">Check Roll</span>
              </p>
              <p className="text-xs font-bold text-cv-dark/40 leading-relaxed uppercase max-w-xs">
                Visit the official NVSP portal to verify your entry or register for the upcoming general assembly.
              </p>
              <a 
                href="https://voters.eci.gov.in" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-4 px-10 py-5 bg-cv-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl"
              >
                Launch NVSP Portal
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
