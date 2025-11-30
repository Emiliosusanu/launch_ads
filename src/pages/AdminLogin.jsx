
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import { supabase } from '@/lib/customSupabaseClient';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
        // 1. Check Admin Status directly from DB
        const { data: userRecord, error: checkError } = await supabase
            .from('ADSPILOT_name')
            .select('id, email, is_admin')
            .eq('email', email)
            .maybeSingle();

        if (checkError) throw new Error("Verification failed");

        // Security Check: Is this user actually an admin?
        if (!userRecord || userRecord.is_admin !== true) {
             toast({
                variant: "destructive",
                title: "Unauthorized",
                description: "This email does not have administrator privileges."
            });
            setIsLoading(false);
            return;
        }

        // 2. Instant Access Success
        toast({
            title: "Admin Verified",
            description: "Entering secure portal...",
            className: "bg-[#1F1F25] border-[#2ECC71] text-white"
        });
        
        localStorage.setItem('admin_email', email);
        
        // Pass email via state for session simulation
        setTimeout(() => {
            navigate('/admin/dashboard', { state: { userEmail: email } });
        }, 800);
        
    } catch (error) {
         console.error(error);
         toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message || "Invalid credentials."
        });
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#6A00FF]/10 rounded-full blur-[120px]" />
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
          <div className="bg-[#16161a] border border-red-500/20 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            {/* Admin context glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-600 to-red-500/0" />
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"/>

            <div className="text-center mb-8 relative z-10">
              <div className="w-14 h-14 bg-[#1F1F25] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-lg shadow-red-900/20">
                <ShieldCheck className="w-7 h-7 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
              <p className="text-gray-400 text-sm">Restricted access. Authorized personnel only.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">Admin Email</label>
                <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within/input:text-red-500" />
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 pl-12 bg-[#0B0B0F] border-white/10 text-white focus:border-red-500 rounded-xl transition-all text-base"
                        required
                    />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-900/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enter Dashboard"}
              </Button>
            </form>
            
             <div className="mt-8 text-center relative z-10">
                 <button onClick={() => navigate('/login')} className="text-sm text-gray-500 hover:text-white transition-colors">
                    User Login
                 </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
