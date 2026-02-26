import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { supabase } from '@/lib/customSupabaseClient';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => {
    try {
      const params = new URLSearchParams(location.search);
      return params.get('token') || '';
    } catch {
      return '';
    }
  }, [location.search]);

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email…');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token. Please request a new confirmation email.');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('confirm-early-access', {
          body: { token },
        });

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Verification failed.');
          return;
        }

        if (data?.error) {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
          return;
        }

        const s = data?.status;
        if (s === 'already_confirmed') {
          setStatus('ok');
          setMessage('Email already confirmed. If you’re approved, you can log in. If not, please wait — we’ll email you once access is granted.');
          return;
        }

        setStatus('ok');
        setMessage('Email confirmed. You’re on the waitlist — we’ll email you once you’re approved.');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        setMessage(e?.message || 'Verification failed.');
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#6A00FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF7A3D]/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="cursor-pointer" onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/');
          }}
        >
          <Logo />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-[#16161a]/80 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Email verification</h1>
            <p className="text-gray-400 text-sm md:text-base mb-8">{message}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full sm:w-auto h-12 bg-white text-black hover:bg-gray-200 font-bold rounded-xl"
                onClick={() => navigate('/login')}
                disabled={status === 'loading'}
              >
                Go to Login
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 border-white/10 bg-black/20 hover:bg-black/40 text-white rounded-xl"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>

            {status === 'error' && (
              <p className="text-xs text-gray-500 mt-6">
                If this keeps failing, request a new confirmation email from the homepage.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
