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

    // 2. Check for existing user
    const { data: existingUsers, error: checkError } = await supabase
      .from('ADSPILOT_name')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase check error:', checkError);
      throw new Error("We couldn\'t verify this email right now. Please try again in a moment.");
    }

    if (existingUsers) {
      // User exists
      throw new Error("You\'re already on the Inteliads beta list with this email. Try logging in or use another address.");
    }

    // 3. Store in Supabase Database
    const { data, error } = await supabase
      .from('ADSPILOT_name')
      .insert([{ email: email }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error("We couldn\'t add you to the beta list right now. Please try again in a few minutes.");
    }
    
    console.log('Successfully subscribed:', data);

    // 4. Send real early-access confirmation email
    marketingService.sendEmail({
      type: 'early_access_confirmation',
      to: email,
    });

    return { success: true, message: "Spot secured. Check your email for confirmation." };
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
