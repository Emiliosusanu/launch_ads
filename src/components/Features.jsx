
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ShieldAlert, Activity, GitBranch, FlaskConical, LayoutDashboard, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Settings,
    title: "AI Bid Optimization",
    description: "Our algorithms analyze historical data to adjust bids in real-time, ensuring you hit your target ACOS perfectly.",
    gradient: "from-[#6A00FF] to-[#C149FF]",
    tag: "Core Tech"
  },
  {
    icon: ShieldAlert,
    title: "Negative Keyword Shield",
    description: "Automatically detects and blocks search terms that are wasting budget without generating sales. No more leaks.",
    gradient: "from-[#FF4F2C] to-[#FF7A3D]",
    tag: "Money Saver"
  },
  {
    icon: Activity,
    title: "24/7 Vigilance",
    description: "The system never sleeps. It monitors your campaigns continuously, reacting to market changes instantly.",
    gradient: "from-[#4DA6FF] to-[#2ECC71]",
    tag: "Always On"
  },
  {
    icon: GitBranch,
    title: "Smart Rule Engine",
    description: "Create 'If This Then That' automation rules tailored to your specific strategy. Infinite flexibility.",
    gradient: "from-[#C149FF] to-[#FF4F2C]",
    tag: "Customizable"
  },
  {
    icon: FlaskConical,
    title: "Keyword Harvester",
    description: "Automatically finds new profitable keywords from auto campaigns and promotes them to manual campaigns.",
    gradient: "from-[#FF7A3D] to-[#FFB84D]",
    tag: "Growth"
  },
  {
    icon: LayoutDashboard,
    title: "Crystal Clear Dashboard",
    description: "See your true profit, royalties, and ad spend in one unified view across all marketplaces.",
    gradient: "from-[#2ECC71] to-[#4DA6FF]",
    tag: "Analytics"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 px-6 bg-[#0B0B0F] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF7A3D]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6A00FF]/10 text-[#C149FF] text-xs font-bold uppercase tracking-wider mb-8 border border-[#6A00FF]/20">
            <CheckCircle2 size={14} />
            <span>Powerhouse Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight text-balance">
            Everything you need to scale.
            <br />
            <span className="text-gray-500">Nothing you don't.</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-normal leading-relaxed">
            Built by authors, for authors. We replaced the spreadsheets with code so you can get back to writing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-[#1F1F25] border border-white/5 hover:border-[#6A00FF]/30 hover:shadow-[0_0_40px_rgba(106,0,255,0.12)] transition-all duration-500 relative overflow-hidden flex flex-col h-full"
              >
                {/* Card Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon strokeWidth={1.5} size={32} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#0B0B0F] border border-white/10 text-[10px] uppercase tracking-wider font-bold text-gray-400 group-hover:text-white group-hover:border-white/20 transition-colors">
                    {feature.tag}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{feature.title}</h3>
                <p className="text-lg text-gray-400 leading-relaxed font-normal flex-1 relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
