
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, User, ArrowLeft, Save, Building, Globe, Phone, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/ui/logo';

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    company: '',
    website: '',
    phone: '',
    bio: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      // 1. Get email from state or fallback to session
      let userEmail = location.state?.userEmail;
      if (!userEmail) {
         const { data: { session } } = await supabase.auth.getSession();
         userEmail = session?.user?.email;
      }

      if (!userEmail) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('ADSPILOT_name')
          .select('*')
          .eq('email', userEmail)
          .single();

        if (error) throw error;

        setFormData({
            email: data.email,
            full_name: data.full_name || '',
            company: data.company || '',
            website: data.website || '',
            phone: data.phone || '',
            bio: data.bio || ''
        });

      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load profile.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, location.state, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
        const { error } = await supabase
            .from('ADSPILOT_name')
            .update({
                full_name: formData.full_name,
                company: formData.company,
                website: formData.website,
                phone: formData.phone,
                bio: formData.bio,
                profile_updated_at: new Date().toISOString()
            })
            .eq('email', formData.email);

        if (error) throw error;

        toast({
            title: "Profile Updated",
            description: "Your information has been saved successfully.",
            className: "bg-[#1F1F25] border-[#2ECC71] text-white"
        });
        
        // Go back to dashboard after short delay
        setTimeout(() => {
            navigate('/dashboard', { state: { userEmail: formData.email } });
        }, 1000);

    } catch (error) {
        toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6A00FF] w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white font-sans">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
             <div className="cursor-pointer" onClick={() => navigate('/')}>
                <Logo />
             </div>
             <Button variant="ghost" onClick={() => navigate('/dashboard', { state: { userEmail: formData.email }})} className="text-gray-400 hover:text-white">
                 <ArrowLeft className="w-4 h-4 mr-2"/> Back to Dashboard
             </Button>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#16161a] border border-white/10 rounded-2xl p-8"
        >
            <div className="mb-8 border-b border-white/5 pb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Edit Profile</h1>
                <p className="text-gray-400 text-sm">Update your personal information and business details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input 
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="pl-10 bg-[#0B0B0F] border-white/10 text-white focus:border-[#6A00FF]"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Company</label>
                        <div className="relative group">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input 
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Acme Inc."
                                className="pl-10 bg-[#0B0B0F] border-white/10 text-white focus:border-[#6A00FF]"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</label>
                        <div className="relative group">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="pl-10 bg-[#0B0B0F] border-white/10 text-white focus:border-[#6A00FF]"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Website</label>
                        <div className="relative group">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input 
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="pl-10 bg-[#0B0B0F] border-white/10 text-white focus:border-[#6A00FF]"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Bio / Notes</label>
                    <div className="relative group">
                        <FileText className="absolute left-3 top-4 text-gray-500 w-4 h-4" />
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full min-h-[100px] pl-10 pr-3 py-3 rounded-md border border-white/10 bg-[#0B0B0F] text-white focus:outline-none focus:ring-2 focus:ring-[#6A00FF] focus:border-transparent text-sm"
                            placeholder="Tell us a bit about your publishing business..."
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => navigate('/dashboard', { state: { userEmail: formData.email }})} className="text-gray-400 hover:text-white">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={saving} className="bg-[#6A00FF] hover:bg-[#7B2FFF] text-white min-w-[140px]">
                        {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
