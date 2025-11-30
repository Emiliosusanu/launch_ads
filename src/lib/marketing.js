
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

export const marketingService = {
  subscribe: async (email) => {
    // 1. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    // 2. Check for existing user
    const { data: existingUsers, error: checkError } = await supabase
      .from('ADSPILOT_name')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase check error:', checkError);
      throw new Error("Could not verify email. Please try again.");
    }

    if (existingUsers) {
      // User exists
      throw new Error("This email is already registered.");
    }

    // 3. Store in Supabase Database
    const { data, error } = await supabase
      .from('ADSPILOT_name')
      .insert([{ email: email }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error("Could not subscribe. Please try again later.");
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
