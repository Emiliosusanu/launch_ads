import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChevronRight, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import DashboardMockup from '@/components/DashboardMockup';

const Hero = () => {
  const { toast } = useToast();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  const handleBetaClick = () => {
    const element = document.getElementById('join-beta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVideoClick = () => {
    toast({
      title: "🎥 Video Demo",
      description: "Video demo coming soon.",
      className: "bg-[#1F1F25] border-[#6A00FF] text-white",
    });
  };

  return (
    <motion.section
      ref={heroRef}
      style={{ y: heroParallaxY }}
      className="relative pt-24 md:pt-40 pb-12 md:pb-32 px-4 md:px-6 overflow-hidden bg-[#0B0B0F] min-h-screen flex items-center"
    >
      {/* Vertical Purple Glow - Fixed position & overflow */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[120%] bg-gradient-to-b from-[#6A00FF]/0 via-[#6A00FF]/40 to-[#6A00FF]/0 z-0 pointer-events-none"
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-[#6A00FF]/5 rounded-full blur-[120px] pointer-events-none z-0"
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-1 gap-8 md:gap-16 items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto px-2"
          >
            <motion.div initial={{
            opacity: 0,
            y: 5
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }} className="inline-flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-[#1F1F25]/80 backdrop-blur-sm border border-[#6A00FF]/30 text-[10px] md:text-sm font-bold text-[#C149FF] mb-6 md:mb-12 cursor-default shadow-[0_0_20px_rgba(106,0,255,0.1)] hover:border-[#6A00FF]/60 transition-all hover:shadow-[0_0_30px_rgba(106,0,255,0.2)]">
              <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-[#FF4F2C]"></span>
              <span className="tracking-wide">v2.0 PUBLIC BETA: <span className="text-white">84 SPOTS LEFT</span></span>
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
            </motion.div>

            <h1 className="text-[3.1rem] sm:text-[4rem] md:text-[4.8rem] font-extrabold tracking-tight text-white mb-6 md:mb-10 text-balance leading-[1.08]">
              Fix your Amazon Ads.
              <br />
              <span className="text-gradient pb-2 inline-block">Automatically.</span>
            </h1>

            <p className="text-base md:text-2xl text-[#F3F3F4]/80 mb-4 md:mb-4 max-w-3xl mx-auto font-normal leading-relaxed text-balance antialiased">
              Built for serious Amazon KDP authors. AdsAutoPilot watches your campaigns 24/7 to cut wasted spend, lower ACOS and grow royalties while you sleep.
            </p>

            <p className="hidden md:block text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto font-normal leading-relaxed text-balance">
              Stop guessing what to fix in your Amazon Ads. AdsAutoPilot helps you understand what’s happening, stay in control, and manage your campaigns with confidence, without the stress and overwhelm.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 mb-4 md:mb-6 w-full sm:w-auto">
              <Button onClick={handleBetaClick} className="w-full sm:w-auto min-w-[220px] h-12 md:h-16 rounded-xl md:rounded-2xl bg-[#FF7A3D] hover:bg-[#FF4F2C] text-white font-bold text-base md:text-lg transition-all duration-300 shadow-[0_0_40px_rgba(255,122,61,0.3)] border border-[#FF4F2C]/50 hover:scale-[1.02] active:scale-[0.98] group">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-[11px] md:text-sm text-gray-400 mb-10 md:mb-16 max-w-md mx-auto">No credit card required. Cancel anytime. Ideal for authors spending at least $300/month on Amazon ads.</p>

            <div className="flex items-center justify-center gap-x-3 md:gap-x-10 gap-y-3 text-xs md:text-sm font-medium text-gray-400 flex-wrap max-w-3xl mx-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-default border border-white/5">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-[#2ECC71]" />
                <span>Amazon Partner</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-default border border-white/5">
                <div className="flex -space-x-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-[#FFB84D] text-[#FFB84D]" />)}
                </div>
                <span className="text-white font-bold">4.9/5</span>
                <span className="hidden sm:inline">from 2k+ Authors</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-default border border-white/5">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#2ECC71] shadow-[0_0_10px_#2ECC71]" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 md:mt-24 mx-auto max-w-7xl px-0 sm:px-4"
        >
          {/* Glow behind the dashboard */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] bg-[#6A00FF]/20 blur-[80px] md:blur-[120px] -z-10" />
          
          {/* Actual Dashboard Component Mockup */}
          <div className="w-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
             <DashboardMockup />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
