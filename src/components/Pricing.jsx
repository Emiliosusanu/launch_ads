
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Rocket, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const plans = [
  {
    name: "Starter",
    monthlyPrice: 29.99,
    icon: Rocket,
    features: [
      "1 connected account",
      "2 available countries",
      "Up to 10 active rules",
      "Maximum total spend 300$",
      "Email support",
      "Basic analytics",
      "Daily rule execution",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    monthlyPrice: 59.99,
    icon: Crown,
    features: [
      "3 connected accounts",
      "3 available countries",
      "Maximum total spend 2000$",
      "Unlimited active rules",
      "Advanced analytics",
      "Hourly rule execution",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Agency",
    monthlyPrice: 69.99,
    icon: Users,
    features: [
      "Unlimited accounts",
      "Unlimited countries",
      "No spend cap",
      "Unlimited rules",
      "Manual rule execution",
      "Dedicated support",
    ],
    highlight: false,
  }
];

const Pricing = () => {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const DASHBOARD_LOGIN_URL = 'https://dashboard.inteliads.io/login';
  const yearlyDiscount = 0.15;
  const launchDiscount = 0.2;
  const launchOfferActive = true;

  const handleSelect = () => {
    window.location.href = DASHBOARD_LOGIN_URL;
  };

  const multiplier =
    (billingCycle === 'yearly' ? 1 - yearlyDiscount : 1) *
    (launchOfferActive ? 1 - launchDiscount : 1);

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
          <div className="flex flex-col items-center justify-center gap-3 mb-10">
            <div className="flex items-center justify-center gap-4">
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
              <span className={`text-sm font-medium transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                Yearly <span className="text-[#2ECC71] text-xs ml-1">(Save 15%)</span>
              </span>
            </div>
            {launchOfferActive && (
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                Launch offer: <span className="text-white font-semibold">-20%</span> for the first 20 users
              </div>
            )}
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
                  ? 'border-[#3B82F6] shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-105 z-10'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#3B82F6] rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap z-20">
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Most Popular</span>
                </div>
              )}

              <div className="mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mb-6">
                  <plan.icon className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-bold text-white tracking-tight">
                    ${Number(plan.monthlyPrice * multiplier).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-semibold tracking-[0.2em] uppercase mb-4">
                  /MONTHLY
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-xs text-gray-500">
                  {billingCycle === 'yearly' ? 'Billed yearly' : 'Billed monthly'}
                  {launchOfferActive ? ' · Launch pricing applied' : ''}
                </div>
              </div>

              <div className="flex-1 space-y-5 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 group/feature">
                    <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${plan.highlight ? 'bg-[#2ECC71]/15 text-[#2ECC71]' : 'bg-white/5 text-gray-400 group-hover/feature:text-white'}`}>
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
                    ? 'bg-[#06B6D4] hover:bg-[#0891B2] text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-transparent border border-[#3B82F6]/40 text-white hover:bg-[#3B82F6]/10'
                }`}
              >
                BUY NOW
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
