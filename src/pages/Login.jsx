
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/logo';

const Login = () => {
  const navigate = useNavigate();
  const DASHBOARD_LOGIN_URL = 'https://dashboard.inteliads.io/login';

  useEffect(() => {
    window.location.href = DASHBOARD_LOGIN_URL;
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col relative overflow-hidden font-sans">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#6A00FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF7A3D]/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
         <div>
            <Logo />
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#16161a]/80 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"/>
            
            <div className="text-center mb-8 relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Redirecting…</h1>
              <p className="text-gray-400 text-sm">Taking you to the Inteliads dashboard login.</p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-center text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Opening dashboard login…
              </div>
              <Button
                type="button"
                onClick={() => {
                  window.location.href = DASHBOARD_LOGIN_URL;
                }}
                className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold text-base rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5"
              >
                <span className="flex items-center gap-2">Continue <ArrowRight className="w-4 h-4"/></span>
              </Button>
            </div>
            
            <div className="mt-8 text-center relative z-10">
                 <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-white transition-colors">
                    Back to Home
                 </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
