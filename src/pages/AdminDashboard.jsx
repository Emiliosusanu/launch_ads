
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import Logo from '@/components/ui/logo';
import { 
    Search, MoreHorizontal, Loader2, CheckCircle2, XCircle, 
    Clock, MessageSquare, Send, LogOut, Users,
    Eye, Settings, Link, Save
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#16161a] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={80} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${color.replace('text-', 'bg-')}/10 border ${color.replace('text-', 'border-')}/20`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
                {subtext && <span className={`text-xs font-bold ${color.replace('text-', 'bg-')}/10 ${color} px-2 py-0.5 rounded-full`}>{subtext}</span>}
            </div>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const chatScrollRef = useRef(null);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  // Messaging State
  const [selectedUserForChat, setSelectedUserForChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const selectedUserEmailRef = useRef(null);

  // All messages view
  const [isAllMessagesOpen, setIsAllMessagesOpen] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [loadingAllMessages, setLoadingAllMessages] = useState(false);

  // Broadcast to all users
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastImportant, setBroadcastImportant] = useState(false);
  const [broadcastSending, setBroadcastSending] = useState(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState([]);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
        try {
            // 1. Attempt to recover email from navigation state or local storage
            let email = location.state?.userEmail || localStorage.getItem('admin_email');
            
            // 2. If still no email, try to get from current active session
            if (!email) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email) {
                    email = session.user.email;
                }
            }
            
            // 3. If still no email, redirect to login
            if (!email) {
                console.warn("No admin email found, redirecting to login");
                navigate('/admin');
                return;
            }

            localStorage.setItem('admin_email', email);

            if(isMounted) {
                await checkAdmin(email);
            }
        } catch (err) {
            console.error("AdminDashboard init error:", err);
            navigate('/admin');
        }
    };
    init();

    return () => {
        isMounted = false;
    };
  }, []);

  useEffect(() => {
      if(chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
  }, [chatMessages, isChatOpen]);

  // Heartbeat: while admin dashboard is open, periodically bump admin last_message_date
  useEffect(() => {
    if (!currentUser?.email) return;

    const interval = setInterval(() => {
      const nowIso = new Date().toISOString();
      supabase
        .from('ADSPILOT_name')
        .update({ last_message_date: nowIso })
        .eq('email', currentUser.email)
        .then(() => {
          // no-op; best-effort heartbeat
        })
        .catch(() => {
          // ignore heartbeat errors
        });
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser?.email]);

  const checkAdmin = async (email) => {
    try {
        // Safety check for active session before querying RLS protected tables
        const { data: { session } } = await supabase.auth.getSession();
        
        // Even if session exists, verify user is admin in our records
        // Use maybeSingle to avoid 406 errors if no rows found
        const { data: adminProfile, error } = await supabase
            .from('ADSPILOT_name')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            console.error("Error fetching admin profile:", error);
            throw error;
        }

        if (!adminProfile || !adminProfile.is_admin) {
            console.warn("User is not an admin or profile not found:", email);
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You do not have administrator privileges."
            });
            navigate('/dashboard');
            return;
        }

        setCurrentUser(adminProfile);
        // Mark this admin as recently active so user presence reflects login
        const nowIso = new Date().toISOString();
        await supabase.from('ADSPILOT_name').update({ last_message_date: nowIso }).eq('email', email);
        
        // Parallel fetch for data
        await Promise.all([
            fetchUsers(), 
            fetchUnreadCounts(email), 
            fetchAppSettings()
        ]);
        
        setupRealtime(email);

    } catch (error) {
        console.error('Admin verification failed:', error);
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please log in again."
        });
        navigate('/admin');
    } finally {
        setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('ADSPILOT_name')
            .select('*')
            .order('last_message_date', { ascending: false, nullsLast: true })
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        setUsers(data || []);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
  };

  const fetchUnreadCounts = async (adminEmail) => {
      try {
        const { data, error } = await supabase
            .from('messages')
            .select('sender_email')
            .eq('read_status', false)
            .eq('receiver_email', adminEmail);
        
        if (error) throw error;

        const counts = (data || []).reduce((acc, msg) => {
            acc[msg.sender_email] = (acc[msg.sender_email] || 0) + 1;
            return acc;
        }, {});
        setUnreadCounts(counts);
      } catch (e) {
          console.error("Error fetching unread counts:", e);
      }
  };

  const fetchAppSettings = async () => {
      try {
        const { data, error } = await supabase.from('app_settings').select('*');
        if (error) throw error;
        if (data) setAppSettings(data);
      } catch (e) {
          console.error("Error fetching settings:", e);
      }
  };

  const fetchAllMessages = async () => {
      if (!currentUser?.email) return;
      setLoadingAllMessages(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_email.eq.${currentUser.email},receiver_email.eq.${currentUser.email}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAllMessages(data || []);
      } catch (e) {
        console.error('Error fetching all messages:', e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load all messages.' });
      } finally {
        setLoadingAllMessages(false);
      }
  };

  const handleBroadcastToAllUsers = async () => {
      if (!broadcastText.trim() || !currentUser) return;
      if (!users.length) {
          toast({ title: 'No users', description: 'There are no users to broadcast to yet.' });
          return;
      }

      setBroadcastSending(true);
      try {
        const baseText = broadcastImportant
          ? `[IMPORTANT] ${broadcastText.trim()}`
          : broadcastText.trim();

        const payloads = users
          .filter(u => !!u.email)
          .map(u => ({
            sender_email: currentUser.email,
            receiver_email: u.email,
            message_text: baseText,
            conversation_id: [currentUser.email, u.email].sort().join('_'),
          }));

        if (!payloads.length) {
          toast({ title: 'No user emails', description: 'No users with valid email addresses found.' });
          return;
        }

        const { error } = await supabase.from('messages').insert(payloads);
        if (error) throw error;

        toast({
          title: 'Broadcast sent',
          description: `Message delivered to ${payloads.length} users.`,
          className: 'bg-[#1F1F25] border-[#2ECC71] text-white',
        });

        setBroadcastText('');
        setBroadcastImportant(false);
        setIsBroadcastOpen(false);
      } catch (e) {
        toast({
          variant: 'destructive',
          title: 'Broadcast failed',
          description: e.message || 'Could not send broadcast.',
        });
      } finally {
        setBroadcastSending(false);
      }
  };

  const setupRealtime = (adminEmail) => {
      const userChannel = supabase.channel('admin-users-rt')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'ADSPILOT_name' }, (payload) => {
            if (payload.eventType === 'INSERT') {
                setUsers(prev => [payload.new, ...prev]);
                toast({ title: "New User", description: `User ${payload.new.email} just joined.` });
            } else if (payload.eventType === 'UPDATE') {
                setUsers(prev => prev.map(u => u.id === payload.new.id ? payload.new : u));
            }
        })
        // Updates to messages SENT by this admin (user has read them)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `sender_email=eq.${adminEmail}`,
        }, (payload) => {
            const updated = payload.new;
            setChatMessages(prev => prev.map(m => m.id === updated.id ? { ...m, ...updated } : m));
        })
        .subscribe();
      
      const msgChannel = supabase.channel('admin-messages-rt')
        // New messages involving this admin
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
            const newMsg = payload.new;
            // Ignore messages sent by the admin itself – these are already
            // added optimistically in handleSendMessage to avoid duplicates.
            if (newMsg.sender_email === adminEmail) {
              // Still bump admin activity timestamp
              supabase.from('ADSPILOT_name').update({ last_message_date: newMsg.created_at }).eq('email', adminEmail);
              return;
            }
            const activeEmail = selectedUserEmailRef.current;

            // If we are currently viewing this conversation (either direction)
            if (activeEmail && (newMsg.sender_email === activeEmail || newMsg.receiver_email === activeEmail)) {
                setChatMessages(prev => [...prev, newMsg]);
                if (newMsg.sender_email === activeEmail) {
                  markAsRead(newMsg.id, newMsg.sender_email);
                }
                // Update admin activity when handling an in-view conversation
                supabase.from('ADSPILOT_name').update({ last_message_date: newMsg.created_at }).eq('email', adminEmail);
            } else if (newMsg.receiver_email === adminEmail) {
                // Background update
                setUnreadCounts(prev => ({
                    ...prev,
                    [newMsg.sender_email]: (prev[newMsg.sender_email] || 0) + 1
                }));
                
                toast({ 
                    title: `Message from ${newMsg.sender_email.split('@')[0]}`, 
                    description: newMsg.message_text.substring(0, 30) + "...",
                    className: "bg-[#1F1F25] border-[#2ECC71] text-white"
                });
                
                // Bump user to top
                setUsers(prev => {
                    const updatedUsers = prev.map(u => u.email === newMsg.sender_email ? { ...u, last_message_date: newMsg.created_at } : u);
                    return updatedUsers;
                });

                // Bump admin activity timestamp for background messages as well
                supabase.from('ADSPILOT_name').update({ last_message_date: newMsg.created_at }).eq('email', adminEmail);
            }
        })
        .subscribe();
        
      return () => {
          supabase.removeChannel(userChannel);
          supabase.removeChannel(msgChannel);
      };
  };

  const sortedUsers = useMemo(() => {
      return [...users].filter(user => {
          const searchMatch = user.email?.toLowerCase().includes(filter.toLowerCase()) || (user.full_name && user.full_name.toLowerCase().includes(filter.toLowerCase()));
          const statusMatch = statusFilter === 'all' || user.approval_status === statusFilter;
          return searchMatch && statusMatch;
      }).sort((a, b) => {
          const unreadA = unreadCounts[a.email] || 0;
          const unreadB = unreadCounts[b.email] || 0;
          if (unreadA > 0 && unreadB === 0) return -1;
          if (unreadB > 0 && unreadA === 0) return 1;
          
          const dateA = new Date(a.last_message_date || 0).getTime();
          const dateB = new Date(b.last_message_date || 0).getTime();
          return dateB - dateA;
      });
  }, [users, unreadCounts, filter, statusFilter]);

  const fetchChatHistory = async (userEmail) => {
      if (!currentUser) return;
      
      try {
        const conversationId = [userEmail, currentUser.email].sort().join('_');

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setChatMessages(data || []);
        
        const unreadIds = (data || []).filter(m => m.sender_email === userEmail && !m.read_status).map(m => m.id);
        if (unreadIds.length > 0) {
            await supabase.from('messages').update({ read_status: true }).in('id', unreadIds);
            setUnreadCounts(prev => {
                const next = { ...prev };
                delete next[userEmail];
                return next;
            });
        }
      } catch (e) {
          console.error("Chat history error:", e);
          toast({ variant: "destructive", title: "Error", description: "Could not load chat history."});
      }
  };

  const openChat = (user) => {
      setSelectedUserForChat(user);
      selectedUserEmailRef.current = user.email;
      setIsChatOpen(true);
      fetchChatHistory(user.email);
  };

const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedUserForChat || !currentUser) return;
    setSending(true);
      
    try {
        const conversationId = [currentUser.email, selectedUserForChat.email].sort().join('_');
        const { data, error } = await supabase.from('messages').insert([{
            sender_email: currentUser.email,
            receiver_email: selectedUserForChat.email,
            message_text: chatInput,
            conversation_id: conversationId
        }]).select();

        if (error) throw error;

        const insertedMessage = data && data[0] ? data[0] : {
            id: Date.now(),
            sender_email: currentUser.email,
            receiver_email: selectedUserForChat.email,
            message_text: chatInput,
            conversation_id: conversationId,
            created_at: new Date().toISOString(),
        };

        setChatMessages(prev => [...prev, insertedMessage]);
        setChatInput('');
        const nowIso = new Date().toISOString();
        // Optimistic update for user's last message date
        setUsers(prev => prev.map(u => u.id === selectedUserForChat.id ? {...u, last_message_date: nowIso} : u));
        
        // Persist user last_message_date
        await supabase.from('ADSPILOT_name').update({ last_message_date: nowIso }).eq('id', selectedUserForChat.id);
        // Also bump admin's own activity timestamp
        if (currentUser?.email) {
          await supabase.from('ADSPILOT_name').update({ last_message_date: nowIso }).eq('email', currentUser.email);
        }
        
      } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to send', description: error.message });
      } finally {
        setSending(false);
      }
  };

  const handleUpdateStatus = async (userId, userEmail, newStatus) => {
    setActionLoadingId(userId);
    try {
        const { error } = await supabase.from('ADSPILOT_name').update({ approval_status: newStatus }).eq('id', userId);
        if (error) throw error;
        
        toast({
            title: "Status Updated",
            description: `User ${userEmail} marked as ${newStatus}.`,
            className: "bg-[#1F1F25] border-[#2ECC71] text-white"
        });
        
        // Local state update happens via Realtime, but we can do optimistic update if needed
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, approval_status: newStatus } : u));

    } catch (error) {
        toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
        setActionLoadingId(null);
    }
  };

  const markAsRead = async (id, senderEmail) => {
      try {
          await supabase.from('messages').update({ read_status: true, read_at: new Date().toISOString() }).eq('id', id);
          setUnreadCounts(prev => {
              const next = { ...prev };
              if (next[senderEmail] > 0) next[senderEmail]--;
              if (next[senderEmail] <= 0) delete next[senderEmail];
              return next;
          });
      } catch (e) {
          console.error("Mark read error", e);
      }
  };

  const handleSaveSettings = async () => {
      setSavingSettings(true);
      try {
          const updates = appSettings.map(s => supabase.from('app_settings').update({ setting_value: s.setting_value }).eq('setting_key', s.setting_key));
          const results = await Promise.all(updates);
          
          if (results.some(r => r.error)) throw new Error("Some settings failed to save");
          
          toast({ title: "Settings Saved", description: "Configuration updated successfully.", className: "bg-[#1F1F25] border-[#2ECC71] text-white" });
          setIsSettingsOpen(false);
      } catch (e) {
          toast({ variant: "destructive", title: "Error", description: "Failed to save settings." });
      } finally {
          setSavingSettings(false);
      }
  };

  const getStatusBadge = (status) => {
      const styles = { approved: "bg-green-500/10 text-green-400 border-green-500/20", rejected: "bg-red-500/10 text-red-400 border-red-500/20", pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" };
      const icons = { approved: <CheckCircle2 size={12} />, rejected: <XCircle size={12} />, pending: <Clock size={12} /> };
      const display = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
      return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center w-fit gap-1.5 ${styles[status] || styles.pending}`}>
              {icons[status] || icons.pending} {display}
          </span>
      );
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#6A00FF]" /></div>;
  }

  if (!currentUser) {
      return null; // Or redirect component
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col font-sans">
      <header className="border-b border-white/5 bg-[#16161a]/50 backdrop-blur-md py-4 px-6 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
           <div className="flex items-center gap-4">
               <Logo />
               <div className="h-6 w-px bg-white/10" />
               <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 tracking-wide">ADMIN CONSOLE</span>
           </div>
           <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                onClick={() => setIsBroadcastOpen(true)}
              >
                <MessageSquare className="w-4 h-4 mr-2" /> Broadcast
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                onClick={() => {
                  setIsAllMessagesOpen(true);
                  fetchAllMessages();
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" /> All Messages
              </Button>
              <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5" onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                  localStorage.removeItem('admin_email');
                  supabase.auth.signOut();
                  navigate('/admin');
              }} className="text-gray-400 hover:text-white hover:bg-white/5">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
           </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6 max-w-7xl">
         {/* Unread messages banner */}
         {Object.values(unreadCounts).reduce((sum, v) => sum + (v || 0), 0) > 0 && (
           <div className="mb-4 rounded-md border border-yellow-400/30 bg-yellow-500/5 px-4 py-3 flex items-center justify-between text-sm text-yellow-100">
             <div className="flex items-center gap-2">
               <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20 text-xs font-semibold text-yellow-200">
                 !
               </span>
               <span>
                 You have <span className="font-semibold">{Object.values(unreadCounts).reduce((sum, v) => sum + (v || 0), 0)}</span> unread message(s) from users.
               </span>
             </div>
             <button
               type="button"
               onClick={() => {
                 setIsAllMessagesOpen(true);
                 fetchAllMessages();
               }}
               className="text-xs font-semibold text-yellow-200 underline-offset-2 hover:underline"
             >
               View all
             </button>
           </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={users.length} icon={Users} color="text-blue-400" subtext="All Time" />
            <StatCard title="Pending" value={users.filter(u => u.approval_status === 'pending').length} icon={Clock} color="text-yellow-400" />
            <StatCard title="Approved" value={users.filter(u => u.approval_status === 'approved').length} icon={CheckCircle2} color="text-green-400" />
            <StatCard title="Rejected" value={users.filter(u => u.approval_status === 'rejected').length} icon={XCircle} color="text-red-400" />
         </div>

         <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#16161a] p-4 rounded-xl border border-white/5">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input placeholder="Search users..." className="pl-10 bg-[#0B0B0F] border-white/10 text-white focus:border-[#6A00FF] h-10" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <div className="flex gap-1 bg-[#0B0B0F] rounded-lg p-1 border border-white/10">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === status ? 'bg-[#1F1F25] text-white shadow-sm border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
         </div>

         <div className="bg-[#16161a] border border-white/5 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-white/5 bg-[#1F1F25]/50"><tr className="text-gray-400 font-medium"><th className="p-5">User</th><th className="p-5">Status</th><th className="p-5">Joined</th><th className="p-5 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-white/5">
                            {sortedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-[#1F1F25] transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold border border-white/10 text-gray-400">
                                                    {user.email ? user.email.substring(0, 2).toUpperCase() : "??"}
                                                </div>
                                                {unreadCounts[user.email] > 0 && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#16161a] animate-bounce">{unreadCounts[user.email]}</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.full_name || user.email || "Unknown"}</div>
                                                <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">{actionLoadingId === user.id ? <Loader2 className="w-4 h-4 animate-spin text-gray-500" /> : getStatusBadge(user.approval_status)}</td>
                                    <td className="p-5 text-xs text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" className="h-8 text-xs border-white/10 hover:bg-white/5 relative" onClick={() => openChat(user)}>
                                                Message {unreadCounts[user.email] > 0 && `(${unreadCounts[user.email]})`}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1F1F25] border-white/10 text-gray-200 z-50">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, user.email, 'approved')}><CheckCircle2 className="mr-2 h-4 w-4 text-green-400"/> Approve</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, user.email, 'rejected')}><XCircle className="mr-2 h-4 w-4 text-red-400"/> Reject</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
         </div>
      </main>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="bg-[#111118] border border-white/10 text-white w-full h-[100vh] max-w-none sm:max-w-[640px] sm:h-[620px] p-0 overflow-hidden gap-0 flex flex-col shadow-xl shadow-black/40">
          <DialogHeader className="px-4 py-3 border-b border-white/10 bg-[#16161f] flex flex-row items-center justify-between shrink-0 space-y-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#262635] flex items-center justify-center text-sm font-bold border border-white/15">
                    {selectedUserForChat?.email ? selectedUserForChat.email.charAt(0).toUpperCase() : "U"}
                </div>
                <DialogTitle className="text-base font-semibold">
                  {selectedUserForChat?.full_name || selectedUserForChat?.email || "User"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Admin chat conversation between you and the selected user.
                </DialogDescription>
            </div>
          </DialogHeader>
          {selectedUserForChat && (
            <div className="px-4 py-2.5 bg-[#14141d] border-b border-white/10 text-[11px] text-gray-400 flex flex-wrap gap-2">
              <div className="px-2 py-1 rounded-full bg-[#1c1c27] border border-white/10 flex items-center gap-1">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-200 font-medium">{selectedUserForChat.full_name || '—'}</span>
              </div>
              <div className="px-2 py-1 rounded-full bg-[#1c1c27] border border-white/10 flex items-center gap-1">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-200 font-mono text-[10px] truncate max-w-[140px]">{selectedUserForChat.email || '—'}</span>
              </div>
              <div className="px-2 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                <span className="text-gray-500">Status</span>
                <span className="text-gray-200 capitalize">{selectedUserForChat.approval_status || 'pending'}</span>
              </div>
              <div className="px-2 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                <span className="text-gray-500">Joined</span>
                <span className="text-gray-200">{selectedUserForChat.created_at ? new Date(selectedUserForChat.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          )}
          <div className="flex-1 bg-[#0b0b12] px-4 py-3 overflow-y-auto overscroll-contain space-y-4" ref={chatScrollRef}>
             {chatMessages.map((msg) => {
                 const isMe = msg.sender_email === currentUser?.email;
                 const isImportant = msg.message_text?.startsWith('[IMPORTANT]');
                 const displayText = isImportant
                   ? msg.message_text.replace(/^\[IMPORTANT\]\s*/i, '')
                   : msg.message_text;
                 const seenTimeSource = msg.read_at || msg.updated_at || msg.created_at;
                 const seenLabel = isMe && msg.read_status && seenTimeSource
                   ? new Date(seenTimeSource).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                   : null;
                 return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="px-3 py-1 rounded-full bg-[#1f1f2b] flex items-center justify-center shrink-0 text-[11px] font-medium border border-white/10 text-gray-100 max-w-[160px] truncate">
                            {selectedUserForChat?.full_name || msg.sender_email || 'User'}
                          </div>
                        )}
                        <div className="max-w-[80%] space-y-1">
                            <div className={`p-3 rounded-2xl text-sm border ${isMe
                                ? 'bg-[#2a2a3a] border-white/15 text-white rounded-tr-none'
                                : 'bg-[#181821] border-white/10 text-gray-100 rounded-tl-none'}`}>
                              {isImportant && (
                                <div className="mb-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide text-yellow-100 bg-yellow-500/15 border border-yellow-400/40">
                                  Important
                                </div>
                              )}
                              <div className="leading-relaxed whitespace-pre-line">{displayText}</div>
                            </div>
                            <div className={`text-[10px] text-gray-500 flex items-center gap-1 ${isMe ? 'justify-end' : ''}`}>
                              <span>{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                              {seenLabel && (
                                <span className="ml-2 text-[9px] text-green-400">Seen at {seenLabel}</span>
                              )}
                            </div>
                        </div>
                    </div>
                 )
             })}
          </div>
          <div className="p-4 bg-[#151520] border-t border-white/10 shrink-0">
            <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-[#10101b] border-white/15 text-white text-base pl-10 pr-20 rounded-lg focus:border-[#6A00FF] focus:ring-0"
                    onKeyDown={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                  />
                  {/* Simple emoji picker */}
                  <div className="absolute inset-y-0 left-2 flex items-center">
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/30 text-lg leading-none text-gray-200 hover:bg-white/10"
                      onClick={() => setShowEmojiPicker(prev => !prev)}
                    >
                      😊
                    </button>
                  </div>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 z-40 rounded-md border border-white/15 bg-[#10101b] px-2 py-1 text-lg shadow-xl flex gap-1 overflow-x-auto">
                      {"😀 😃 😄 😅 😂 😊 🙂 😉 🙌 🚀".split(" ").map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className="px-1 hover:bg-white/10 rounded flex-shrink-0"
                          onClick={() => {
                            setChatInput(prev => `${prev}${emoji}`);
                            setShowEmojiPicker(false);
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={sending || !chatInput.trim()}
                  className="h-10 w-10 rounded-lg bg-[#2b2b39] hover:bg-[#36364a] text-white flex items-center justify-center border border-white/15 disabled:opacity-60"
                  size="icon"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAllMessagesOpen} onOpenChange={setIsAllMessagesOpen}>
        <DialogContent className="bg-[#16161a] border border-white/10 text-white sm:max-w-[700px] max-h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>All Messages</DialogTitle>
            <DialogDescription>
              Conversation history for all chats involving your admin account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {loadingAllMessages && (
              <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading messages...
              </div>
            )}
            {!loadingAllMessages && allMessages.length === 0 && (
              <div className="text-sm text-gray-500 py-4 text-center">
                No messages found.
              </div>
            )}
            {!loadingAllMessages && allMessages.map((msg) => {
              const isMe = msg.sender_email === currentUser?.email;
              const isImportant = msg.message_text?.startsWith('[IMPORTANT]');
              const displayText = isImportant
                ? msg.message_text.replace(/^\[IMPORTANT\]\s*/i, '')
                : msg.message_text;
              return (
                <div
                  key={msg.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-white/5 bg-[#0B0B0F] px-3 py-2 text-sm"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-0.5 rounded-full bg-[#1F1F25] border border-white/10 font-mono">
                        {isMe ? 'You → ' + (msg.receiver_email || '') : (msg.sender_email || '') + ' → You'}
                      </span>
                      {isImportant && (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] uppercase tracking-wide">
                          Important
                        </span>
                      )}
                      <span>
                        {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                      </span>
                    </div>
                    <div className="text-gray-100 whitespace-pre-wrap break-words">
                      {displayText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
        <DialogContent className="bg-[#16161a] border border-white/10 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Broadcast Message</DialogTitle>
            <DialogDescription>
              Send an announcement to all users. Optionally mark it as important so it stands out in their inbox.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Message</label>
              <textarea
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                rows={4}
                className="w-full rounded-md bg-[#0B0B0F] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6A00FF] resize-none"
                placeholder="Type your announcement..."
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={broadcastImportant}
                onChange={(e) => setBroadcastImportant(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-[#0B0B0F]"
              />
              Mark as important
            </label>
            <Button
              onClick={handleBroadcastToAllUsers}
              disabled={broadcastSending || !broadcastText.trim()}
              className="w-full bg-[#6A00FF] hover:bg-[#7B2FFF] text-white mt-2"
            >
              {broadcastSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Send Broadcast'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
         <DialogContent className="bg-[#16161a] border border-white/10 text-white sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Application Settings</DialogTitle>
                <DialogDescription>
                    Configure global application links and options used across the dashboard.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                 {appSettings.map((setting, index) => (
                     <div key={setting.setting_key || index} className="space-y-2">
                         <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">{setting.setting_key ? setting.setting_key.replace(/_/g, ' ') : "Setting"}</label>
                         <div className="relative">
                             <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                             <Input value={setting.setting_value || ""} onChange={(e) => setAppSettings(prev => prev.map(s => s.setting_key === setting.setting_key ? {...s, setting_value: e.target.value} : s))} className="pl-10 bg-[#0B0B0F] border-white/10 text-white" />
                         </div>
                         {setting.description && <p className="text-xs text-gray-500">{setting.description}</p>}
                     </div>
                 ))}
                 <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full bg-[#6A00FF] hover:bg-[#7B2FFF] text-white mt-4">
                     {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Save Configuration</>}
                 </Button>
             </div>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
