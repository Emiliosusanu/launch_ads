
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Zap, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const MetricCard = ({ label, value, change, isPositive, isNeutral }) => (
  <div className="bg-[#131317] rounded-2xl p-6 border border-white/5 flex flex-col justify-between min-h-[140px] hover:border-white/10 transition-colors group relative overflow-hidden">
    {/* Card Shine Effect */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-10 group-hover:bg-white/10 transition-colors pointer-events-none" />
    
    <div className="flex justify-between items-start relative z-10">
       <div className="w-10 h-10 rounded-full bg-[#1F1F25] flex items-center justify-center">
         <div className="w-5 h-5 rounded-full bg-white/10" />
       </div>
       
       <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
         isPositive 
            ? 'text-[#2ECC71] bg-[#2ECC71]/10' 
            : isNeutral 
              ? 'text-white bg-white/10' 
              : 'text-[#FF6B6B] bg-[#FF6B6B]/10'
       }`}>
         {isPositive || isNeutral ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
         {change}
       </div>
    </div>

    <div className="relative z-10">
      <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
    </div>
  </div>
);

const ActionLogItem = ({ title, desc, color, isLast }) => (
  <div className="flex gap-4 relative group">
    {/* Timeline Line */}
    {!isLast && (
      <div className="absolute left-[5px] top-3 bottom-[-20px] w-0.5 bg-[#1F1F25] group-hover:bg-white/10 transition-colors" />
    )}
    
    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${color} shadow-[0_0_8px_currentColor] z-10 relative`} />
    
    <div className="pb-6">
      <h4 className="text-white font-bold text-sm mb-0.5">{title}</h4>
      <p className="text-gray-500 text-xs">{desc}</p>
    </div>
  </div>
);

const DemoSection = () => {
  const { toast } = useToast();
  const [activeTimeframe, setActiveTimeframe] = useState('7D');
  const [hoveredBar, setHoveredBar] = useState(null);

  // Chart Data matching the visual curve in the image
  // Bar #9 is the orange one
  const chartData = [25, 35, 30, 45, 40, 65, 55, 70, 100, 75, 80, 95]; 

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-[#0B0B0F] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl bg-[#1B1B22] rounded-[3rem] blur-3xl opacity-50 -z-10" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Window Container */}
        <div className="bg-[#16161a] rounded-2xl md:rounded-[2rem] border border-white/5 shadow-2xl p-4 sm:p-6 md:p-12">
          
          {/* Header / Search Bar Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="bg-[#0B0B0F] border border-white/5 rounded-lg px-4 py-2 text-sm text-gray-500 font-mono w-full max-w-md mx-auto hidden md:block">
              Start Dashboard
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
             <MetricCard label="AD SPEND" value="$1,240" change="4.2%" isPositive={false} />
             <MetricCard label="SALES" value="$8,920" change="12.5%" isPositive={true} />
             <MetricCard label="ACOS" value="13.9%" change="2.1%" isPositive={true} />
             <MetricCard label="ORDERS" value="842" change="8.4%" isPositive={true} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full">
            
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-[#131317] rounded-2xl p-5 md:p-8 border border-white/5 flex flex-col min-h-[320px] md:min-h-[400px]">
               <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">REVENUE VS ACOS</h3>
                  <div className="flex bg-[#0B0B0F] rounded-lg p-1 border border-white/5 gap-1">
                    <button 
                      onClick={() => setActiveTimeframe('7D')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-md transition-colors ${activeTimeframe === '7D' ? 'bg-[#6A00FF] text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                      7D
                    </button>
                    <button 
                      onClick={() => setActiveTimeframe('30D')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-md transition-colors ${activeTimeframe === '30D' ? 'bg-[#6A00FF] text.white' : 'text-gray-500 hover:text-white'}`}
                    >
                      30D
                    </button>
                  </div>
               </div>
               
               <div className="flex-1 flex items-end justify-between gap-2 sm:gap-3 px-1 sm:px-2">
                  {chartData.map((height, i) => {
                    // Use specific index 8 for the orange bar to match image
                    const isOrange = i === 8; 
                    return (
                      <div key={i} className="relative w-full h-full flex items-end group">
                         <motion.div
                           initial={{ height: 0 }}
                           animate={{ height: `${height}%` }}
                           transition={{ duration: 0.6, ease: "easeOut" }}
                           onMouseEnter={() => setHoveredBar(i)}
                           onMouseLeave={() => setHoveredBar(null)}
                           className={`w-full rounded-sm transition-all duration-300 relative ${
                             isOrange 
                               ? 'bg-[#FF7A3D] shadow-[0_0_20px_rgba(255,122,61,0.4)]' 
                               : 'bg-[#6A00FF] opacity-90 hover:opacity-100'
                           }`}
                         >
                            <AnimatePresence>
                              {hoveredBar === i && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: -44 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute left-1/2 -translate-x-1/2 bg-[#0B0B0F] text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 whitespace-nowrap z-30 pointer-events-none shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                                >
                                  ${height * 120}
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </motion.div>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Action Log */}
            <div className="bg-[#131317] rounded-2xl p-5 md:p-8 border border-white/5 min-h-[320px] md:min-h-[400px]">
               <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 md:mb-8">AI ACTIONS LOG</h3>
               <div className="flex flex-col h-full">
                  <ActionLogItem 
                    title="Optimized Bid" 
                    desc="mystery books • just now" 
                    color="bg-[#2ECC71]" 
                  />
                  <ActionLogItem 
                    title="Negative KW" 
                    desc="free kindle • 15m ago" 
                    color="bg-[#FF6B6B]" 
                  />
                  <ActionLogItem 
                    title="Bid Increased" 
                    desc="thriller series • 42m ago" 
                    color="bg-[#4DA6FF]" 
                  />
                  <ActionLogItem 
                    title="Paused KW" 
                    desc="romance 2021 • 1h ago" 
                    color="bg-[#FFB84D]" 
                    isLast={true}
                  />
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
