import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

export const marketingService = {
  sendEmail: async (payload) => {
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Email send failed');
      }

      return await res.json().catch(() => ({ ok: true }));
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
      // User exists
      throw new Error("You\'re already on the Inteliads beta list with this email. Try logging in or use another address.");
    }

    // 3. Request confirmation email (do not reserve spot until confirmed)
    const res = await fetch('/api/request-early-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      const msg = json?.error || 'We could not send a confirmation email right now. Please try again.';
      throw new Error(msg);
    }

    return { success: true, message: "Check your email to confirm and reserve your spot." };
  },

  triggerEmailSequence: (email) => {
    // This is a simulation. In a real app, this would be handled by a backend service.
    
    // Email 1: Welcome (Immediate)
    setTimeout(() => {
      marketingService.sendMockEmail({
        subject: "Welcome to Inteliads Beta",
        preview: "Your spot is reserved. You can log in any time to complete access.",
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
