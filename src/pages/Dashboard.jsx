import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/customSupabaseClient";
import Logo from "@/components/ui/logo";
import {
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Send,
  LogOut,
  BellRing,
  Settings,
  PenSquare,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart3,
  Target,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [redirectUrls, setRedirectUrls] = useState({
    amazon_ads_url: "#",
    documentation_url: "/documentation",
  });
  const [importantBanner, setImportantBanner] = useState(null);
  const importantBannerTimeoutRef = useRef(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [adminPresence, setAdminPresence] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Initial load: get email, session, user, settings, messages, admin presence
  useEffect(() => {
    const init = async () => {
      try {
        let emailFromLogin =
          location.state?.userEmail || localStorage.getItem("user_email");

        if (!emailFromLogin) {
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            console.error("Error getting session:", sessionError);
          }

          if (session?.user?.email) {
            emailFromLogin = session.user.email;
          }
        }

        if (!emailFromLogin) {
          console.warn("No user email found, redirecting to login");
          navigate("/login");
          return;
        }

        localStorage.setItem("user_email", emailFromLogin);
        await fetchUserDataAndMessages(emailFromLogin);
      } catch (err) {
        console.error("Dashboard init failed:", err);
        navigate("/login");
      }
    };

    init();
  }, []);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen for any admin presence updates in real time (supports multiple admins)
  useEffect(() => {
    const presenceChannel = supabase
      .channel("admin-presence-all")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ADSPILOT_name",
          filter: "is_admin=eq.true",
        },
        (payload) => {
          const updated = payload.new;
          setAdminPresence((prev) => {
            if (!prev?.last_message_date) return updated;
            const prevTime = new Date(prev.last_message_date).getTime();
            const newTime = updated.last_message_date
              ? new Date(updated.last_message_date).getTime()
              : prevTime;
            return newTime >= prevTime ? updated : prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, []);

  // Show [IMPORTANT] banner for latest important message
  useEffect(() => {
    if (!userData || !messages.length) return;

    const latestImportant = [...messages]
      .reverse()
      .find(
        (m) =>
          m.sender_email !== userData.email &&
          typeof m.message_text === "string" &&
          m.message_text.startsWith("[IMPORTANT]")
      );

    if (!latestImportant) return;

    const text = latestImportant.message_text.replace(/^\[IMPORTANT\]\s*/i, "");

    setImportantBanner({ id: latestImportant.id, text });

    if (importantBannerTimeoutRef.current) {
      clearTimeout(importantBannerTimeoutRef.current);
    }

    importantBannerTimeoutRef.current = setTimeout(() => {
      setImportantBanner(null);
    }, 30000);

    return () => {
      if (importantBannerTimeoutRef.current) {
        clearTimeout(importantBannerTimeoutRef.current);
      }
    };
  }, [messages, userData]);

const fetchUserDataAndMessages = async (email) => {
  setLoading(true);
  try {
    const userPromise = supabase
      .from("ADSPILOT_name")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    const settingsPromise = supabase
      .from("app_settings")
      .select("setting_key, setting_value");

    const messagesPromise = supabase
      .from("messages")
      .select("*")
      .or(`sender_email.eq.${email},receiver_email.eq.${email}`)
      .order("created_at", { ascending: true });

    const adminPresencePromise = supabase
      .from("ADSPILOT_name")
      .select("email,last_message_date")
      .eq("is_admin", true)
      .order("last_message_date", { ascending: false, nullsLast: true })
      .limit(1)
      .maybeSingle();

    const [
      { data: user, error: userError },
      { data: settings, error: settingsError },
      { data: msgs, error: msgError },
      { data: adminProfile, error: adminError },
    ] = await Promise.all([
      userPromise,
      settingsPromise,
      messagesPromise,
      adminPresencePromise,
    ]);

    if (userError) throw userError;
    if (settingsError) console.warn("Settings error:", settingsError);
    if (msgError) console.warn("Messages error:", msgError);
    if (adminError) console.warn("Admin profile error:", adminError);

    if (!user) throw new Error("Account not found.");

    setUserData(user);

    if (settings) {
      const urls = settings.reduce(
        (acc, s) => ({ ...acc, [s.setting_key]: s.setting_value }),
        {}
      );
      setRedirectUrls(urls);
    }

    if (msgs) setMessages(msgs || []);

    if (adminProfile && !adminError) {
      setAdminPresence(adminProfile);
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "Failed to load data.",
    });
    navigate("/login");
  } finally {
    setLoading(false);
  }
};


  const setupRealtime = (userId, email) => {
    const profileChannel = supabase
      .channel(`user-profile-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ADSPILOT_name",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setUserData((prev) => {
            const next = { ...prev, ...payload.new };
            if (prev && payload.new.approval_status !== prev.approval_status) {
              toast({
                title: "Status Update",
                description: `Your application status is now ${payload.new.approval_status}.`,
              });
            }
            return next;
          });
        }
      )
      .subscribe();

    const messageChannel = supabase
      .channel(`user-messages-${email}`)
      // New incoming messages to this user
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_email=eq.${email}`,
        },
        async (payload) => {
          const msg = payload.new;
          setMessages((prev) => [...prev, msg]);

          // If message is from admin/support, mark it as read immediately so admin sees 'Seen at'
          if (msg.sender_email !== email) {
            const nowIso = new Date().toISOString();
            try {
              await supabase
                .from("messages")
                .update({ read_status: true, read_at: nowIso })
                .eq("id", msg.id);
            } catch (e) {
              console.warn("Mark incoming message as read failed", e);
            }

            toast({
              title: "New Message",
              description: "Support has sent you a message.",
              className: "bg-[#1F1F25] border-[#2ECC71] text-white",
            });
          }
        }
      )
      // Updates to messages SENT by this user (admin marking them read)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `sender_email=eq.${email}`,
        },
        (payload) => {
          const updated = payload.new;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
          );
        }
      )
      .subscribe();

    return [profileChannel, messageChannel];
  };

  // Realtime subscriptions + cleanup
  useEffect(() => {
    if (!userData?.id || !userData?.email) return;

    const channels = setupRealtime(userData.id, userData.email);

    return () => {
      channels.forEach((c) => supabase.removeChannel(c));
    };
  }, [userData?.id, userData?.email]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userData) return;
    setSending(true);

    try {
      const { data: adminData, error: adminError } = await supabase
        .from("ADSPILOT_name")
        .select("email")
        .eq("is_admin", true)
        .limit(1)
        .maybeSingle();

      if (adminError) {
        console.warn("Error finding admin:", adminError);
      }

      const receiverEmail = adminData?.email || "support@adsautopilot.com";
      const conversationId = [userData.email, receiverEmail]
        .sort()
        .join("_");

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            sender_email: userData.email,
            receiver_email: receiverEmail,
            message_text: newMessage,
            conversation_id: conversationId,
          },
        ])
        .select();

      if (error) throw error;

      const insertedMessage =
        data && data[0]
          ? data[0]
          : {
              id: Date.now(),
              sender_email: userData.email,
              receiver_email: receiverEmail,
              message_text: newMessage,
              conversation_id: conversationId,
              created_at: new Date().toISOString(),
            };

      setMessages((prev) => [...prev, insertedMessage]);
      setNewMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setSending(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      approved: "bg-green-500/10 text-green-400 border-green-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };
    const normalized = (status || "pending").toLowerCase();
    const className = styles[normalized] || styles.pending;
    return (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${className}`}
      >
        {normalized}
      </div>
    );
  };

  const renderMainContent = () => {
    if (!userData) return null;

    const status = userData.approval_status || "pending";

    if (status === "approved") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <Sparkles
              size={120}
              className="absolute top-0 right-0 p-4 opacity-10"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="bg-green-500 text-black p-2 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  You're In! Welcome Aboard.
                </h2>
              </div>
              <p className="text-gray-300 max-w-xl mb-3 text-sm md:text-base">
                Your beta access has been granted. You now have full access to
                the AdsAutoPilot automation engine.
              </p>
              <div className="mb-5 md:mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 md:px-4 py-3 text-xs md:text-sm text-yellow-200">
                <p className="font-semibold uppercase tracking-wide mb-1">
                  Beta disclaimer
                </p>
                <p>
                  AdsAutoPilot is currently in beta. By continuing to use this
                  app you acknowledge and accept that there may be bugs, errors,
                  downtime, or non-functional features, and you agree to use it
                  at your own risk during this testing phase.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={redirectUrls.amazon_ads_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-bold">
                    Access the Official Portal of AdsAutoPilot Beta{" "}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a
                  href={redirectUrls.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-white/10 bg-black/20 hover:bg-black/40 text-white"
                  >
                    View Documentation{" "}
                    <BookOpen className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (status === "rejected") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#16161a] border border-red-500/20 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <XCircle className="text-red-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Application Update
              </h2>
              <p className="text-sm text-gray-400">Status: Rejected</p>
            </div>
          </div>
          <p className="text-gray-300">
            Unfortunately, we cannot grant beta access at this time. Please
            contact support if you believe this is a mistake.
          </p>
        </motion.div>
      );
    }

    // Pending / Default
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#16161a] border border-white/5 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <Clock className="text-yellow-400" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Application Under Review
            </h2>
            <p className="text-sm text-gray-400">
              Estimated wait time: 24-48 hours
            </p>
          </div>
        </div>
        <p className="text-gray-300 mb-4">
          Our team is reviewing your details. You can complete your profile to
          speed up the process.
        </p>
        <Button
          variant="outline"
          className="border-white/10 hover:bg-white/5"
          onClick={() =>
            navigate("/dashboard/profile", {
              state: { userEmail: userData.email },
            })
          }
        >
          Complete Profile{" "}
          <PenSquare size={14} className="ml-2 text-[#6A00FF]" />
        </Button>
      </motion.div>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6A00FF]" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col font-sans">
      {importantBanner && (
        <div className="bg-red-600 text-white text-sm px-4 py-2 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold uppercase tracking-wide text-xs">
              Important
            </span>
            <span className="text-xs md:text-sm truncate max-w-xs md:max-w-lg">
              {importantBanner.text}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setImportantBanner(null)}
            className="ml-4 text-xs text-white/80 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      <header className="border-b border-white/5 bg-[#16161a]/50 backdrop-blur-md py-4 px-6 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={userData?.approval_status || "pending"} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate("/dashboard/profile", {
                  state: { userEmail: userData?.email },
                })
              }
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Settings size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                localStorage.removeItem("user_email");
                try {
                  await supabase.auth.signOut();
                } catch (e) {
                  console.error("Sign out error:", e);
                }
                navigate("/login");
              }}
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">{renderMainContent()}</div>
          <div className="lg:col-span-1 flex justify-center lg:justify-end">
            <div
              className={`w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl flex flex-col shadow-xl shadow-black/40 transition-all duration-200 ${
                isChatExpanded
                  ? "fixed inset-0 z-40 h-full max-h-screen rounded-none max-w-none"
                  : "h-[75vh] md:h-[640px] sm:sticky sm:top-24"
              }`}
            >
              {/* Extra close button when expanded on small screens */}
              {isChatExpanded && (
                <button
                  type="button"
                  className="absolute top-3 right-3 z-50 inline-flex items-center justify-center rounded-full bg-black/40 border border-white/20 px-3 py-1 text-[11px] text-gray-100 backdrop-blur-sm md:hidden"
                  onClick={() => setIsChatExpanded(false)}
                >
                  Close
                </button>
              )}

              <div className="px-4 py-3 border-b border-white/10 bg-[#16161f] flex items-center justify-between relative z-40">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <BellRing className="text-[#6A00FF]" size={18} />
                    <h3 className="font-bold text-white text-sm md:text-base">
                      Support &amp; Messages
                    </h3>
                  </div>
                  {adminPresence && (
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      {(() => {
                        const last = adminPresence.last_message_date
                          ? new Date(adminPresence.last_message_date)
                          : null;
                        if (!last) return <span>Support status: unknown</span>;
                        const diffMs = Date.now() - last.getTime();
                        const diffMin = Math.floor(diffMs / 60000);

                        // Consider support online only within the last 1 minute
                        if (diffMin < 1)
                          return (
                            <span className="text-green-400">
                              Support is online
                            </span>
                          );

                        const diffHours = Math.floor(diffMin / 60);
                        if (diffHours < 24)
                          return (
                            <span>Last active {diffHours}h ago</span>
                          );
                        const diffDays = Math.floor(diffHours / 24);
                        return (
                          <span>Last active {diffDays}d ago</span>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="md:hidden text-[11px] px-2 py-1 rounded border border-white/10 text-gray-300 hover:bg-white/5"
                  onClick={() => setIsChatExpanded((prev) => !prev)}
                >
                  {isChatExpanded ? "Close" : "Full screen"}
                </button>
              </div>

              <div
                className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-4 bg-[#0b0b12]"
                ref={scrollRef}
              >
                {messages.map((msg) => {
                  const isMe =
                    userData && msg.sender_email === userData.email;
                  const isImportant =
                    msg.message_text?.startsWith("[IMPORTANT]");
                  const displayText = isImportant
                    ? msg.message_text.replace(/^\[IMPORTANT\]\s*/i, "")
                    : msg.message_text;
                  const seenTimeSource =
                    msg.read_at || msg.updated_at || msg.created_at;
                  const seenLabel =
                    isMe && msg.read_status && seenTimeSource
                      ? new Date(seenTimeSource).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : null;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-[#1f1f2b] flex items-center justify-center shrink-0 text-xs font-bold border border-white/10 text-gray-100">
                          S
                        </div>
                      )}
                      <div className="space-y-1 max-w-[80%]">
                        <div
                          className={`p-3 rounded-2xl text-sm border ${
                            isMe
                              ? "bg-[#2a2a3a] border-white/15 text-white rounded-tr-none"
                              : "bg-[#181821] border-white/10 text-gray-100 rounded-tl-none"
                          }`}
                        >
                          {isImportant && (
                            <div className="mb-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide text-yellow-100 bg-yellow-500/15 border border-yellow-400/40">
                              Important
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {displayText}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 text-[10px] text-gray-500 ${
                            isMe ? "justify-end" : ""
                          }`}
                        >
                          <span>
                            {new Date(
                              msg.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {seenLabel && (
                            <span className="ml-2 text-[9px] text-green-400">
                              Seen at {seenLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-white/10 bg-[#151520] rounded-b-2xl">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="bg-[#10101b] border-white/15 text-white pl-10 pr-20 text-base rounded-lg focus:border-[#6A00FF] focus:ring-0"
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        !sending &&
                        handleSendMessage()
                      }
                    />
                    {/* Simple emoji picker */}
                    <div className="absolute inset-y-0 left-2 flex items-center">
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/30 text-lg leading-none text-gray-200 hover:bg-white/10"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
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
                              setNewMessage((prev) => `${prev}${emoji}`);
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
                    size="icon"
                    className="h-10 w-10 rounded-lg bg-[#2b2b39] hover:bg-[#36364a] text-white flex items-center justify-center border border-white/15 disabled:opacity-60"
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                  >
                    {sending ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
