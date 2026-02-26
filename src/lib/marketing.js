import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

export const marketingService = {
  sendEmail: async (payload) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: payload,
      });

      if (error) {
        throw new Error(error.message || 'Email send failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data || { ok: true };
    } catch (e) {
      console.warn('Email send failed:', e);
      return { ok: false };
    }
  },

  subscribe: async (email) => {
    // 1. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("That doesn\'t look like a valid email yet. Double-check and try again.");
    }

    // 2. Check for existing (already confirmed) user
    const { data: existingUsers, error: checkError } = await supabase
      .from('ADSPILOT_name')
      .select('email, beta_status')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase check error:', checkError);
      throw new Error("We couldn\'t verify this email right now. Please try again in a moment.");
    }

    if (existingUsers && String(existingUsers.beta_status || '').toLowerCase() === 'confirmed') {
      return {
        success: true,
        message: "Your email is already confirmed. If you're not approved yet, please wait — we'll email you once access is granted.",
      };
    }

    // 3. Request confirmation email (do not reserve spot until confirmed)
    const { data, error } = await supabase.functions.invoke('request-early-access', {
      body: { email },
    });

    if (error) {
      throw new Error(error.message || 'We could not send a confirmation email right now. Please try again.');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return { success: true, message: "Check your email to confirm your address and join the waitlist." };
  },

  triggerEmailSequence: (email) => {
    // This is a simulation. In a real app, this would be handled by a backend service.
    
    // Email 1: Welcome (Immediate)
    setTimeout(() => {
      marketingService.sendMockEmail({
        subject: "Welcome to Inteliads Beta",
        preview: "Confirm your email to join the waitlist. We'll email you once you're approved.",
      });
    }, 1500);
  },

  sendMockEmail: ({ subject, preview }) => {
    toast({
      title: subject,
      description: preview,
      variant: "default",
      duration: 4000,
    });
  }
};
