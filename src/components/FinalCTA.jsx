import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { marketingService } from '@/lib/marketing';
const FinalCTA = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await marketingService.subscribe(email);
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'Email Registration'
        });
      }
      toast({
        title: "Spot Secured! 🚀",
        description: "You can log in right away to complete your beta access. No email confirmation needed.",
        className: "bg-[#1F1F25] border-[#2ECC71] text-white"
      });
      setEmail('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <section className="py-16 md:py-32 px-4 md:px-6 bg-[#0B0B0F] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#6A00FF]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div initial={{
        opacity: 0,
        scale: 0.96
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.5,
        ease: "easeOut"
      }} className="relative rounded-[2rem] overflow-hidden bg-[#16161a] border border-white/10 p-8 md:p-16 text-center shadow-2xl">
          {/* Gradient Border Effect via pseudo-element */}
          <div className="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-br from-[#6A00FF] via-transparent to-[#FF7A3D] opacity-50 pointer-events-none -z-10" />
          
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Stop letting Amazon decide how much you spend.
          </h2>

          <p className="text-base md:text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Join thousands of authors taking back control of their ads, starting with a simple beta test.
          </p>

          <p className="text-sm md:text-base text-gray-400 mb-8 max-w-xl mx-auto">
            Early access users consistently report less stress, more clarity, and far more confidence when managing ads.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-8">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input type="email" placeholder="Enter your email to reserve your spot" value={email} onChange={e => setEmail(e.target.value)} className="h-12 md:h-14 pl-12 bg-[#0B0B0F] border-white/10 text-white placeholder:text-gray-600 focus:border-[#FF7A3D]/50 rounded-xl" required />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 md:h-14 px-8 bg-gradient-to-r from-[#FF7A3D] to-[#FF4F2C] hover:from-[#FF8A55] hover:to-[#FF6242] text-white font-bold text-base rounded-xl shadow-lg shadow-[#FF4F2C]/20 transition-all duration-200 whitespace-nowrap">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                  Get Early Access <ArrowRight className="ml-2 w-5 h-5" />
                </>}
            </Button>
          </form>

          <p className="text-xs md:text-sm text-gray-400 font-medium mb-1">No commitment. Leave anytime. Spots fill fast.</p>
          <p className="text-xs md:text-sm text-gray-500">Only a small number of beta seats remain.</p>

        </motion.div>
      </div>
    </section>;
};
export default FinalCTA;