
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, ShieldCheck, Clock, SlidersHorizontal, Search, LayoutDashboard, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: LineChart,
    title: "AI Bid Optimization",
    description: "Your bids adjust themselves before wasted clicks can drain your royalties, keeping your ACOS under control without daily micromanagement. AI analyzes performance and makes precise changes for you.",
    gradient: "from-[#6A00FF] to-[#C149FF]",
    tag: "Core Tech",
    iconColor: "text-[#C49BFF]"
  },
  {
    icon: ShieldCheck,
    title: "Negative Keyword Shield",
    description: "You stop paying for useless clicks that never turn into sales, protecting your royalties automatically.",
    gradient: "from-[#FF4F2C] to-[#FF7A3D]",
    tag: "Money Saver",
    iconColor: "text-[#FF9980]"
  },
  {
    icon: Clock,
    title: "24/7 Vigilance",
    description: "You catch problems before they burn your budget—automation watches campaigns around the clock and reacts to changes instantly.",
    gradient: "from-[#4DA6FF] to-[#2ECC71]",
    tag: "Always On",
    iconColor: "text-[#7FD1FF]"
  },
  {
    icon: SlidersHorizontal,
    title: "Smart Rule Engine",
    description: "You control exactly how automation behaves with simple 'If This Then That' rules—strategy that fits you.",
    gradient: "from-[#C149FF] to-[#FF4F2C]",
    tag: "Customizable",
    iconColor: "text-[#FFB3E6]"
  },
  {
    icon: Search,
    title: "Keyword Harvester",
    description: "You scale winners faster—profitable terms are promoted from auto to manual campaigns automatically.",
    gradient: "from-[#FF7A3D] to-[#FFB84D]",
    tag: "Growth",
    iconColor: "text-[#FFD27A]"
  },
  {
    icon: LayoutDashboard,
    title: "Crystal Clear Dashboard",
    description: "You see profit, royalties, and ad spend in one place, so decisions are obvious across all marketplaces.",
    gradient: "from-[#2ECC71] to-[#4DA6FF]",
    tag: "Analytics",
    iconColor: "text-[#8FE3C6]"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-6 bg-[#0B0B0F] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF7A3D]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10 md:mb-14 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6A00FF]/10 text-[#C149FF] text-xs font-bold uppercase tracking-wider mb-8 border border-[#6A00FF]/20">
            <CheckCircle2 size={14} />
            <span>Powerhouse Features</span>
          </div>
          <h2 className="text-3xl md:text-[2.6rem] font-bold text-white mb-4 md:mb-5 tracking-tight leading-tight text-balance">
            Everything you need to scale.
            <br />
            <span className="text-gray-500">Nothing you don't.</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-400 font-normal leading-relaxed">
            Built by authors, for authors. We replaced the spreadsheets with code so you can get back to writing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
                className="group p-4 md:p-5 rounded-2xl bg-[#1F1F25] border border-white/5 hover:border-[#6A00FF]/30 hover:shadow-[0_0_30px_rgba(106,0,255,0.12)] transition-all duration-500 relative overflow-hidden flex flex-col h-full"
              >
                {/* Card Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-4 md:mb-5 relative z-10">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#111118] border border-white/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-[#6A00FF]/40 group-hover:bg-[#15151f] transition-colors transition-shadow duration-300">
                    <Icon strokeWidth={1.7} size={20} className={`md:w-5 md:h-5 ${feature.iconColor}`} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#0B0B0F] border border-white/10 text-[10px] uppercase tracking-wider font-bold text-gray-400 group-hover:text-white group-hover:border-white/20 transition-colors">
                    {feature.tag}
                  </span>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 relative z-10">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-normal flex-1 relative z-10">
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
