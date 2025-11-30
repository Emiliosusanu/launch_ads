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
      toast({
        title: "Spot Secured! 🚀",
        description: "We've sent your confirmation email. Welcome to the future of ads.",
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
        scale: 0.95
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} viewport={{
        once: true
      }} className="relative rounded-[2rem] overflow-hidden bg-[#16161a] border border-white/10 p-8 md:p-16 text-center shadow-2xl">
          {/* Gradient Border Effect via pseudo-element */}
          <div className="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-br from-[#6A00FF] via-transparent to-[#FF7A3D] opacity-50 pointer-events-none -z-10" />
          
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to stop wasting money <br className="hidden md:block" />
            on ads?
          </h2>
          
          <p className="text-base md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join 2,000+ authors automating their growth. <br />
            14-day free trial. No credit card required.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-8">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} className="h-12 md:h-14 pl-12 bg-[#0B0B0F] border-white/10 text-white placeholder:text-gray-600 focus:border-[#FF7A3D]/50 rounded-xl" required />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 md:h-14 px-8 bg-gradient-to-r from-[#FF7A3D] to-[#FF4F2C] hover:from-[#FF8A55] hover:to-[#FF6242] text-white font-bold text-base rounded-xl shadow-lg shadow-[#FF4F2C]/20 transition-all duration-200 whitespace-nowrap">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </>}
            </Button>
          </form>

          <p className="text-sm text-gray-500 font-medium">Limited beta spots available for Q4 2025.</p>

        </motion.div>
      </div>
    </section>;
};
export default FinalCTA;