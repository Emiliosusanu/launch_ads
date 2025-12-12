
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for authors with 1-5 books.",
    features: ["Up to 3 Active Campaigns", "Daily Bid Optimization", "Basic Reporting", "Email Support"],
    highlight: false
  },
  {
    name: "Growth",
    price: "79",
    description: "For scaling authors with a growing backlist.",
    features: ["Up to 15 Active Campaigns", "Hourly AI Optimization", "Keyword Harvesting", "Smart Automation Rules", "Priority Support"],
    highlight: true
  },
  {
    name: "Pro",
    price: "149",
    description: "For full-time publishers and agencies.",
    features: ["Unlimited Campaigns", "Real-time Optimization", "Multi-Region Support", "API Access", "Dedicated Account Manager", "White-label Reports"],
    highlight: false
  }
];

const Pricing = () => {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleSelect = () => {
    const el = document.getElementById('join-beta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: show a subtle toast if the section is not found
      toast({
        title: 'Early Access',
        description: 'Scroll down to the Early Access section to reserve your spot.',
        className: 'bg-[#1F1F25] border-[#6A00FF] text-white',
      });
    }
  };

  return (
    <section id="pricing" className="py-24 md:py-32 px-6 bg-[#0B0B0F] relative">
      <div className="container mx-auto max-w-6xl">
        <p className="text-base md:text-lg text-gray-300 text-center mb-6">
          Imagine opening your dashboard and already knowing everything is under control.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Pay for results, not potential.
          </h2>
          <p className="text-lg text-gray-400 font-normal mb-8">
            ROI-focused pricing. Most authors save their subscription cost in the first week.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-10">
             <span className={`text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
             <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-12 h-6 rounded-full bg-[#1F1F25] border border-white/10 relative px-1 flex items-center cursor-pointer"
             >
                <motion.div 
                  layout 
                  className="w-4 h-4 rounded-full bg-[#FF7A3D]" 
                  animate={{ x: billingCycle === 'monthly' ? 0 : 22 }}
                />
             </button>
             <span className={`text-sm font-medium transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>Yearly <span className="text-[#2ECC71] text-xs ml-1">(Save 20%)</span></span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`flex flex-col p-8 rounded-3xl bg-[#1F1F25] border transition-all duration-300 relative group h-full ${
                plan.highlight 
                  ? 'border-[#6A00FF] shadow-[0_0_40px_rgba(106,0,255,0.15)] scale-105 z-10' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#6A00FF] to-[#C149FF] rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap z-20">
                  <Sparkles size={14} className="text-white fill-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Most Popular</span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold text-white tracking-tight">
                    ${billingCycle === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="text-gray-500 font-medium">/mo</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-5 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 group/feature">
                    <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${plan.highlight ? 'bg-[#6A00FF]/20 text-[#C149FF]' : 'bg-white/5 text-gray-400 group-hover/feature:text-white'}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-300 group-hover/feature:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSelect}
                className={`w-full h-12 rounded-xl font-bold text-base transition-all ${
                  plan.highlight
                    ? 'bg-[#FF7A3D] hover:bg-[#FF4F2C] text-white shadow-[0_0_20px_rgba(255,122,61,0.3)]'
                    : 'bg-[#0B0B0F] border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {plan.highlight ? 'Start controlling my ads' : `Choose ${plan.name}`}
              </Button>
              
              <div className="mt-4 text-center">
                <span className="text-xs text-gray-600 font-medium">14-day money-back guarantee</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
