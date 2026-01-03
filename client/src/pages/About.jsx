import React from 'react';
import { 
  Clock, Shield, Zap, Users, Globe, BarChart3, 
  Heart, Target, Star, ShieldCheck, Activity, Layers 
} from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 lg:p-12 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* --- STRATEGIC HERO SECTION --- */}
        <section className="relative py-20 px-10 bg-slate-800/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
              <Layers size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Next-Generation ERP Architecture</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              Defining the <br /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">Digital Workspace.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">
              "DayFlow is not just a tool; it's a strategic infrastructure designed to harmonize human capital with corporate objectives through data-driven precision."
            </p>
          </div>
        </section>

        {/* --- ENTERPRISE PILLARS --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
                title: "Operational Velocity", 
                desc: "Eliminate administrative friction with automated check-in systems and real-time synchronization of workforce availability.",
                icon: <Activity size={24} />,
                color: "indigo"
            },
            { 
                title: "Regulatory Integrity", 
                desc: "Engineered with strict data governance and role-based access controls to ensure total compliance with global labor standards.",
                icon: <ShieldCheck size={24} />,
                color: "green"
            },
            { 
                title: "Predictive Analytics", 
                desc: "Convert workforce behavior into actionable intelligence, allowing leaders to optimize human resource allocation dynamically.",
                icon: <BarChart3 size={24} />,
                color: "purple"
            }
          ].map((pillar, i) => (
            <div key={i} className="bg-slate-800/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-slate-800 shadow-xl group hover:-translate-y-2 transition-all duration-500">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-all 
                ${pillar.color === 'indigo' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : ''}
                ${pillar.color === 'green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                ${pillar.color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}
              `}>
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight text-white">{pillar.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{pillar.desc}</p>
            </div>
          ))}
        </section>

        {/* --- PROFESSIONAL MISSION STATEMENT --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 bg-slate-800/40 backdrop-blur-xl p-12 rounded-[3rem] border border-slate-800 shadow-2xl flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 bg-indigo-500 rounded-full" />
                <h2 className="text-4xl font-black tracking-tighter text-white">The DayFlow Philosophy</h2>
            </div>
            <div className="space-y-6 text-slate-400 text-lg font-medium max-w-3xl">
              <p>
                In the modern corporate landscape, the distinction between a high-performing organization and a stagnant one lies in the <span className="text-white font-bold">transparency of its data.</span>
              </p>
              <p>
                DayFlow was conceived as a response to the fragmentation of traditional HR tools. We built a unified environment where attendance, payroll, and team performance converge. Our architecture prioritizes the end-user experience without compromising on the robust requirements of HR professionals.
              </p>
            </div>
            <div className="flex gap-16 mt-12 border-t border-slate-800 pt-10">
                <div>
                  <p className="text-5xl font-black text-white tracking-tighter">0.0ms</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Latency Sync</p>
                </div>
                <div>
                  <p className="text-5xl font-black text-white tracking-tighter">99.9%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Uptime</p>
                </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-indigo-600/20 to-slate-800/40 border border-indigo-500/20 rounded-[3rem] p-12 flex flex-col items-start justify-between relative overflow-hidden group">
             <Globe size={120} className="text-indigo-500/10 absolute -right-10 -bottom-10 group-hover:scale-110 group-hover:text-indigo-500/20 transition-all duration-1000" />
             <div className="space-y-4 relative z-10">
                <Star size={32} className="text-indigo-400" />
                <h3 className="text-3xl font-black tracking-tighter text-white leading-none">Global <br />Scalability</h3>
                <p className="text-slate-400 text-sm font-medium">Built for startups and scalable for multinational enterprises.</p>
             </div>
             <button className="relative z-10 text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 group-hover:gap-4 transition-all">
                Learn about our architecture <Zap size={12} />
             </button>
          </div>
        </section>

        {/* --- CORPORATE VALUES --- */}
        <section className="py-12 bg-slate-800/20 rounded-[2.5rem] border border-slate-800/50">
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
            {[
              { label: 'Radical Transparency', icon: <Layers size={16}/> },
              { label: 'Hyper-Innovation', icon: <Zap size={16}/> },
              { label: 'Uncompromising Security', icon: <Shield size={16}/> },
              { label: 'User Obsession', icon: <Users size={16}/> }
            ].map((value, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-500 hover:text-indigo-400 transition-colors cursor-default">
                {value.icon}
                <span className="text-xs font-black uppercase tracking-[0.2em]">{value.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- PROFESSIONAL FOOTER --- */}
        <footer className="text-center pb-16 pt-10">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6">DayFlow Enterprise Resource Planning • Institutional Grade</p>
          <div className="flex items-center justify-center gap-4 text-slate-500 text-xs font-bold">
            <span>Documentation</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>Security Whitepaper</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>Privacy Policy</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;