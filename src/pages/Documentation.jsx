
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Code, Terminal, Zap, Shield, BarChart3, Target, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

const DocSection = ({ title, icon: Icon, children }) => (
    <section className="mb-12 border-b border-white/5 pb-12 last:border-0">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#6A00FF]/10 rounded-lg border border-[#6A00FF]/20">
                <Icon className="text-[#6A00FF] w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="text-gray-400 leading-relaxed space-y-4">
            {children}
        </div>
    </section>
);

const Documentation = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-white font-sans">
            <header className="border-b border-white/5 bg-[#16161a]/50 backdrop-blur-md py-4 px-6 sticky top-0 z-30">
                <div className="container mx-auto flex justify-between items-center max-w-5xl">
                    <div className="cursor-pointer" onClick={() => navigate('/')}><Logo /></div>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </div>
            </header>

            <main className="container mx-auto max-w-4xl px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Documentation</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to know about how AdsAutoPilot works and how your automation flow is structured.</p>
                    </div>

                    <div className="bg-[#16161a] border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl space-y-12">
                        <DocSection title="0. System Overview" icon={Zap}>
                            <p>This app helps KDP authors automatically optimize Amazon Ads using clear, rule-based automation. No AI, no multi-market complexity – just transparent rules and a clean dashboard.</p>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div className="space-y-2">
                                    <h3 className="text-white font-semibold text-sm tracking-wide uppercase">What it optimizes</h3>
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                        <li>Bid adjustments</li>
                                        <li>Keyword cleanup</li>
                                        <li>Negative keyword automation</li>
                                        <li>Budget protection</li>
                                        <li>Campaign monitoring</li>
                                        <li>Reporting &amp; ACOS tracking</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-white font-semibold text-sm tracking-wide uppercase">What it does <span className="text-gray-400">(and does not) do</span></h3>
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                        <li><strong>No AI:</strong> fully rule-based, predictable behavior.</li>
                                        <li><strong>No multi-market:</strong> focused on a single Amazon Ads region for clarity.</li>
                                        <li><strong>Transparent automation:</strong> every change is logged and can be reviewed.</li>
                                    </ul>
                                </div>
                            </div>
                        </DocSection>

                        <DocSection title="1. First Contact – From Landing Page to Verified Account" icon={BookOpen}>
                            <h3 className="text-white font-bold text-lg mt-2 mb-2">1.1 Landing Page → Signup</h3>
                            <p>The landing page explains what the tool does, why Amazon Ads are hard to manage manually, how automation works, and shows benefits, pricing, and testimonials. Main calls to action:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm mt-2">
                                <li><strong>Join the Beta Waitlist</strong></li>
                                <li><strong>Start Free Trial</strong> (post-beta)</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">1.2 Signup</h3>
                            <p>On the signup page, the user creates an account by providing:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Full name</li>
                                <li>Email</li>
                                <li>Password</li>
                                <li>Country</li>
                                <li>Optional: KDP ad spend range</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">1.3 Email Verification</h3>
                            <p>After signup, the user receives a verification email:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>"Verify your email to activate your account."</li>
                                <li>Once they click the link, the account becomes active and they can log in.</li>
                            </ul>
                        </DocSection>

                        <DocSection title="2. Onboarding Wizard (First Login)" icon={Terminal}>
                            <p>On first login, an onboarding wizard guides the user through setup in under 3 minutes.</p>
                            <ol className="list-decimal list-inside pl-4 space-y-3 mt-4 text-sm">
                                <li>
                                    <strong>Step 1 – Welcome Screen</strong>
                                    <p className="mt-1 text-gray-400">“Welcome! Let’s set up your Amazon Ads optimization in under 3 minutes.”</p>
                                    <p className="mt-1">Primary action: <span className="text-white font-semibold">Start Setup</span>.</p>
                                </li>
                                <li>
                                    <strong>Step 2 – Connect Amazon Ads Account</strong>
                                    <p className="mt-1 text-gray-400">The user clicks <span className="text-white">Connect Amazon Ads</span>, is redirected to Amazon Advertising to authorize:</p>
                                    <ul className="list-disc list-inside pl-4 space-y-1 mt-1">
                                        <li>Campaign data</li>
                                        <li>Keywords &amp; search terms</li>
                                        <li>Spend &amp; performance metrics (ACOS, CPC, CTR, revenue)</li>
                                    </ul>
                                    <p className="mt-1 text-gray-400">After authorization, the user is redirected back with a secure access token. Only the necessary rights for managing and reading campaigns are requested.</p>
                                </li>
                                <li>
                                    <strong>Step 3 – Import Campaigns</strong>
                                    <p className="mt-1 text-gray-400">The system imports:</p>
                                    <ul className="list-disc list-inside pl-4 space-y-1 mt-1">
                                        <li>Sponsored Products campaigns &amp; status</li>
                                        <li>Daily budgets &amp; ad groups</li>
                                        <li>Keywords and targets (broad, phrase, exact)</li>
                                        <li>Search terms</li>
                                        <li>ACOS, CPC, CTR, spend, revenue</li>
                                    </ul>
                                    <p className="mt-1 text-gray-400">A loading message is shown: “Importing campaigns… this may take up to 30 seconds.”</p>
                                </li>
                                <li>
                                    <strong>Step 4 – Choose Optimization Mode</strong>
                                    <p className="mt-1 text-gray-400">The user picks the risk level for automation:</p>
                                    <div className="grid md:grid-cols-3 gap-4 mt-2">
                                        <div className="bg-[#0B0B0F] border border-white/10 rounded-xl p-3 space-y-1">
                                            <h4 className="text-sm font-semibold text-white">Mode 1 – Safe (Recommended)</h4>
                                            <p className="text-xs text-gray-400">Very conservative, low risk, minimal adjustments.</p>
                                            <ul className="list-disc list-inside pl-4 text-xs text-gray-400 space-y-1">
                                                <li>Bid changes around ±5–10%</li>
                                                <li>Negatives only after very clear data</li>
                                                <li>No automated new keyword tests</li>
                                            </ul>
                                        </div>
                                        <div className="bg-[#0B0B0F] border border-white/10 rounded-xl p-3 space-y-1">
                                            <h4 className="text-sm font-semibold text-white">Mode 2 – Growth</h4>
                                            <p className="text-xs text-gray-400">Balanced changes for moderate growth.</p>
                                            <ul className="list-disc list-inside pl-4 text-xs text-gray-400 space-y-1">
                                                <li>Bid changes around ±10–25%</li>
                                                <li>Faster keyword pruning</li>
                                                <li>Higher allowed spend ceiling</li>
                                            </ul>
                                        </div>
                                        <div className="bg-[#0B0B0F] border border-white/10 rounded-xl p-3 space-y-1">
                                            <h4 className="text-sm font-semibold text-white">Mode 3 – Aggressive</h4>
                                            <p className="text-xs text-gray-400">High automation, fast pruning, big bid shifts.</p>
                                            <ul className="list-disc list-inside pl-4 text-xs text-gray-400 space-y-1">
                                                <li>Bid changes around ±30–50%</li>
                                                <li>Quick negatives on low performers</li>
                                                <li>Strict adherence to ACOS target</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <p className="mt-2">The user selects a mode and clicks <span className="text-white font-semibold">Next</span>.</p>
                                </li>
                            </ol>
                        </DocSection>

                        <DocSection title="3. Dashboard Home" icon={BarChart3}>
                            <p>After onboarding, the user lands on the main dashboard. It is split into overview, campaigns, alerts, and automation summary.</p>
                            <h3 className="text-white font-bold text-lg mt-4 mb-2">3.1 Daily Overview Card</h3>
                            <p>Shows a snapshot of performance, color-coded by health:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Today’s spend, ACOS, orders, revenue</li>
                                <li>CTR, CPC</li>
                                <li>Campaign health indicator – Green (profitable), Yellow (ok), Red (burning money)</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">3.2 Campaigns Table</h3>
                            <p>A sortable table with key columns:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Campaign name &amp; status (enabled/paused)</li>
                                <li>Spend, ACOS, CPC, impressions, clicks, orders</li>
                                <li>Optimization status: “OK”, “Needs Attention”, “Critical”</li>
                            </ul>
                            <p className="mt-1 text-sm text-gray-400">Actions: enable/disable campaigns, open detailed analytics, optionally trigger manual optimization.</p>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">3.3 Alerts Panel</h3>
                            <p>Automatic alerts help surface issues before money is wasted:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>ACOS exceeding target</li>
                                <li>Budget depleted early in the day</li>
                                <li>High CPC spikes</li>
                                <li>Useless keyword detected</li>
                                <li>Too many broad matches or low click volume</li>
                                <li>High ad spend with 0 orders</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">3.4 Optimization Summary</h3>
                            <p>This section summarizes what the automation engine did recently:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Bid increases and decreases</li>
                                <li>Negatives added, keywords paused</li>
                                <li>New opportunities identified</li>
                                <li>Daily automation actions and logs for transparency</li>
                            </ul>
                        </DocSection>

                        <DocSection title="4. Detailed Campaign View" icon={Target}>
                            <p>Opening an individual campaign reveals granular diagnostics and controls.</p>
                            <h3 className="text-white font-bold text-lg mt-4 mb-2">4.1 Campaign Header</h3>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Campaign name &amp; daily budget</li>
                                <li>Assigned optimization mode (Safe, Growth, Aggressive)</li>
                                <li>Key suggested actions, if any</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">4.2 Performance Metrics</h3>
                            <p>Charts and stats over 7 / 14 / 30 days:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Spend, ACOS, orders, revenue</li>
                                <li>CPC, clicks, impressions</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">4.3 Keywords Table</h3>
                            <p>Per-keyword metrics and recommended actions:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Keyword, match type, impressions, clicks, spend, orders, ACOS, bid</li>
                                <li>Suggested action: lower, raise, pause</li>
                                <li>Actions: adjust bid, add negative, pause keyword, view search terms</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">4.4 Search Term Cleaner</h3>
                            <p>Highlights terms that waste budget:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Search terms with high spend and 0 orders</li>
                                <li>Very low CTR terms</li>
                                <li>Budget-draining, non-converting terms</li>
                            </ul>
                            <p className="mt-1 text-sm text-gray-400">The user can bulk-add to negatives, approve suggestions, or skip specific terms.</p>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">4.5 Automation Settings</h3>
                            <p>Per-campaign tuning of the rule engine:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>ACOS target &amp; daily spend limit</li>
                                <li>Max CPC</li>
                                <li>Bid increase/decrease percentages</li>
                                <li>Minimum impressions/clicks before decisions</li>
                                <li>How aggressively automation acts over time</li>
                            </ul>
                        </DocSection>

                        <DocSection title="5. Automation Engine (Rules)" icon={Code}>
                            <p>The engine is built on clear, deterministic rules instead of black-box AI.</p>
                            <div className="grid md:grid-cols-3 gap-6 mt-4 text-sm">
                                <div className="space-y-2">
                                    <h3 className="text-white font-semibold text-sm tracking-wide uppercase">Bid Rules</h3>
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                                        <li>If ACOS &lt; target → increase bid by X%.</li>
                                        <li>If ACOS &gt; target → decrease bid by X%.</li>
                                        <li>If no clicks → gradually decrease bid down to a threshold.</li>
                                        <li>If many clicks and 0 orders → reduce or pause the keyword.</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-white font-semibold text-sm tracking-wide uppercase">Negative Keyword Rules</h3>
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                                        <li>If a search term spends X with 0 orders → add as negative.</li>
                                        <li>If CTR is below threshold for 14 days → negative keyword.</li>
                                        <li>If impressions are too low → skip instead of overreacting.</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-white font-semibold text-sm tracking-wide uppercase">Budget Protection &amp; Limits</h3>
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                                        <li>If a campaign hits ~80% of budget by midday → reduce bids.</li>
                                        <li>If CPC suddenly spikes by ~30% → bids are reduced automatically.</li>
                                        <li>Daily caps on total bid increments and negatives added.</li>
                                        <li>Hard ACOS ceiling to prevent runaway spend.</li>
                                    </ul>
                                </div>
                            </div>
                        </DocSection>

                        <DocSection title="6. Reporting" icon={BarChart3}>
                            <p>Reporting is built to answer two questions: “What happened?” and “What did the automation do about it?”</p>
                            <h3 className="text-white font-bold text-lg mt-4 mb-2">6.1 Daily Summary Reports</h3>
                            <p>Delivered via email and/or inside the dashboard:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Yesterday’s spend &amp; ACOS</li>
                                <li>Top performers</li>
                                <li>Budget waste avoided</li>
                                <li>Automation actions taken</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">6.2 Weekly Insights Report</h3>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Top rising and failing keywords</li>
                                <li>Suggested improvements and missed opportunities</li>
                                <li>Spend optimization summary</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">6.3 Export &amp; History</h3>
                            <p>Users can export CSV/PDF views and download full automation logs for auditing.</p>
                        </DocSection>

                        <DocSection title="7. Account, Billing &amp; Sessions" icon={Settings}>
                            <h3 className="text-white font-bold text-lg mt-2 mb-2">7.1 Subscription Plans</h3>
                            <p>Plans such as Starter, Growth, and Pro define usage limits, features, and price. Users can see:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Next billing date</li>
                                <li>Payment method</li>
                                <li>Current usage and upgrade/downgrade options</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">7.2 Account Settings</h3>
                            <p>Users can manage profile and preferences:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Name, email, password</li>
                                <li>Notification preferences (email / in-app)</li>
                                <li>Default time zone</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">7.3 Connected Amazon Accounts</h3>
                            <p>Controls around the Amazon Ads connection:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li>Reconnect if tokens expire</li>
                                <li>Refresh access</li>
                                <li>Disconnect Amazon Ads</li>
                            </ul>

                            <h3 className="text-white font-bold text-lg mt-6 mb-2">8–10. Sessions, Returning Users &amp; Error Handling</h3>
                            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                                <li><strong>Logout &amp; session end:</strong> when the user logs out, the session token is invalidated.</li>
                                <li><strong>Returning users:</strong> on next login the dashboard loads automatically, automation continues to run, and alerts/reports refresh.</li>
                                <li><strong>Amazon Ads disconnected:</strong> “Amazon Ads connection expired. Reconnect now to continue automation.”</li>
                                <li><strong>Spend spikes:</strong> a notice explains that bids were reduced to protect ACOS.</li>
                                <li><strong>No campaigns found:</strong> “We couldn’t find any active campaigns in your account.”</li>
                            </ul>
                        </DocSection>

                        <DocSection title="Security &amp; Privacy" icon={Shield}>
                            <p>We take your data seriously. AdsAutoPilot uses the official Amazon Advertising API and never stores your Amazon login credentials.</p>
                            <p>Your data is encrypted at rest and in transit using modern encryption standards.</p>
                        </DocSection>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Documentation;
