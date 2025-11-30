
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

export const marketingService = {
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
      throw new Error("You\'re already on the AdsAutoPilot beta list with this email. Try logging in or use another address.");
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

    // 4. Trigger simulated email sequence
    marketingService.triggerEmailSequence(email);

    return { success: true, message: "Check your inbox for beta access details." };
  },

  triggerEmailSequence: (email) => {
    // This is a simulation. In a real app, this would be handled by a backend service.
    
    // Email 1: Welcome (Immediate)
    setTimeout(() => {
      marketingService.sendMockEmail({
        subject: "Welcome to AdsAutoPilot Beta",
        preview: "You are on the list. Here is what happens next.",
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
