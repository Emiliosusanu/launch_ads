
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import { supabase } from '@/lib/customSupabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
        // 1. Check if user exists in our database and get their role
        const { data: userRecord, error: checkError } = await supabase
            .from('ADSPILOT_name')
            .select('id, email, is_admin')
            .eq('email', email)
            .maybeSingle();

        if (checkError) {
             console.error(checkError);
             throw new Error("Error checking user record");
        }
        
        if (!userRecord) {
             toast({
                variant: "destructive",
                title: "Access Denied",
                description: "This email is not registered for beta access."
            });
            setIsLoading(false);
            return;
        }

        toast({
            title: "Welcome Back",
            description: "Accessing your dashboard...",
            className: "bg-[#1F1F25] border-[#6A00FF] text-white"
        });

        // Store email for persistence since we are bypassing auth for demo speed
        localStorage.setItem('user_email', email);

        setTimeout(() => {
            if (userRecord.is_admin) {
                navigate('/admin/dashboard', { state: { userEmail: email } });
            } else {
                navigate('/dashboard', { state: { userEmail: email } });
            }
        }, 800);
        
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error",
            description: error.message
        });
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col relative overflow-hidden font-sans">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#6A00FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF7A3D]/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
         <div className="cursor-pointer" onClick={() => navigate('/')}>
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
              <div className="w-14 h-14 bg-gradient-to-br from-[#1F1F25] to-[#16161a] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg shadow-black/50">
                <Zap className="w-7 h-7 text-[#6A00FF]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Instant Access</h1>
              <p className="text-gray-400 text-sm">Enter your registered email to enter.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within/input:text-[#6A00FF]" />
                    <Input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 pl-12 bg-[#0B0B0F] border-white/10 text-white placeholder:text-gray-600 focus:border-[#6A00FF] rounded-xl transition-all focus:ring-1 focus:ring-[#6A00FF] text-base"
                        required
                    />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold text-base rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Enter Dashboard <ArrowRight className="w-4 h-4"/></span>}
              </Button>
            </form>
            
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
