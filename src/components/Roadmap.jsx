
import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, Bot, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RoadmapCard = ({ title, date, description, features, icon: Icon, progress, color, badge }) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
    className="group relative bg-[#16161a] rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-500"
  >
    {/* Ambient Glow */}
    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${color}`} />
    
    <div className="p-8 md:p-10 relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#1F1F25] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon size={28} className="text-white" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            color === 'bg-[#6A00FF]' 
              ? 'bg-[#6A00FF]/10 border-[#6A00FF]/20 text-[#C149FF]' 
              : 'bg-[#FF7A3D]/10 border-[#FF7A3D]/20 text-[#FF7A3D]'
          }`}>
            {badge}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Clock size={12} />
            {date}
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed mb-8 flex-1">
        {description}
      </p>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <span>Development Progress</span>
            <span className="text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-[#1F1F25] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${color.replace('bg-', 'bg-gradient-to-r from-white/20 to-')}`}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {features.map((feature, i) => (
            <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const Roadmap = () => {
  return (
    <section className="py-24 px-6 bg-[#0B0B0F] relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-white text-xs font-bold uppercase tracking-wider mb-6 border border-white/10"
          >
            <Sparkles size={14} className="text-[#FF7A3D]" />
            <span>Future Roadmap</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Building the future of advertising.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We aren't stopping at automation. Here is a glimpse of what our engineering team is cooking up next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RoadmapCard 
            title="Global Multiregion Support"
            date="Coming Q2 2026"
            badge="Expansion"
            description="Manage campaigns across all Amazon marketplaces from a single dashboard. Auto-convert currencies and translate keywords instantly."
            progress={75}
            color="bg-[#6A00FF]"
            icon={Globe2}
            features={["US, EU, UK, JP, AU", "Currency Normalization", "Cross-Region Rules"]}
          />
          
          <RoadmapCard 
            title="Generative AI Optimization"
            date="Coming Q3 2026"
            badge="Intelligence"
            description="Our neural engine will soon write new ad copy, suggest high-converting keywords, and orchestrate complex bidding strategies autonomously."
            progress={35}
            color="bg-[#FF7A3D]"
            icon={Bot}
            features={["Custom Rules Orchestration", "Copy Generation", "Trend Prediction"]}
          />
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
