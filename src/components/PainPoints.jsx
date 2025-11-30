
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Wallet, AlertCircle, Search, XCircle } from 'lucide-react';

const painPoints = [
  {
    icon: Wallet,
    title: "Burning Cash Daily",
    description: "Every click on a non-converting keyword is money stolen directly from your royalties.",
    accent: "text-[#FF4F2C]"
  },
  {
    icon: Clock,
    title: "Hours of Grunt Work",
    description: "Spreadsheets, bid adjustments, and manual entry. Is this why you became an author?",
    accent: "text-[#FFB84D]"
  },
  {
    icon: BarChart3,
    title: "ACOS Out of Control",
    description: "Watching your advertising cost of sales creep up until your profit completely vanishes.",
    accent: "text-[#FF4F2C]"
  },
  {
    icon: AlertCircle,
    title: "Dashboard Overload",
    description: "Amazon's native dashboard is confusing, slow, and hides the metrics that actually matter.",
    accent: "text-[#4DA6FF]"
  },
  {
    icon: Search,
    title: "Blind Guessing",
    description: "Raising bids and 'hoping' it works is gambling, not marketing. Stop guessing.",
    accent: "text-[#C149FF]"
  }
];

const PainPoints = () => {
  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-[#0B0B0F] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#1B0F2E] via-[#0B0B0F] to-[#0B0B0F] opacity-80 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-[#FF4F2C] mb-4 md:mb-6 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              <XCircle size={16} className="md:w-[18px] md:h-[18px]" />
              <span>The Old Way</span>
            </div>
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight leading-[1.1]">
              Stop managing ads like it's <span className="text-[#FF4F2C] line-through decoration-4 decoration-[#FF4F2C]/50 opacity-90">2015</span>.
            </h2>
            <p className="text-base md:text-xl text-gray-400 font-normal max-w-2xl leading-relaxed">
              Manual ad management is a full-time job that pays nothing. 
              Most authors are working harder only to earn less.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-[#1F1F25] border border-white/5 hover:border-[#FF4F2C]/40 hover:shadow-[0_0_30px_rgba(255,79,44,0.1)] transition-all duration-300 group h-full flex flex-col relative overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#0B0B0F] flex items-center justify-center mb-4 md:mb-8 ${point.accent} border border-white/5 group-hover:scale-110 transition-transform shadow-inner relative z-10`}>
                  <Icon strokeWidth={2} size={20} className="md:w-[26px] md:h-[26px]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4 group-hover:text-[#FF4F2C] transition-colors relative z-10 leading-tight">{point.title}</h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed flex-1 relative z-10 font-normal">{point.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
