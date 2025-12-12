import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PainPoints from '@/components/PainPoints';
import Features from '@/components/Features';
import RuleBuilder from '@/components/RuleBuilder';
import DemoSection from '@/components/DemoSection';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Roadmap from '@/components/Roadmap';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import EditProfile from '@/pages/EditProfile';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import Documentation from '@/pages/Documentation';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Product from '@/pages/Product';
import FeaturesPage from '@/pages/FeaturesPage';
import PricingPage from '@/pages/PricingPage';
import RoadmapPage from '@/pages/RoadmapPage';
import Changelog from '@/pages/Changelog';
import About from '@/pages/About';
import Careers from '@/pages/Careers';
import Legal from '@/pages/Legal';
import Contact from '@/pages/Contact';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';

// SPA Meta Pixel PageView tracker
function MetaPixelPageView() {
  const location = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      // Skip initial render since the Pixel script in <head> already sent PageView
      first.current = false;
      return;
    }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, location.search]);

  return null;
}

const MidBetaNudge = () => (
  <section className="px-4 md:px-6 py-10 md:py-14 bg-[#0B0B0F]">
    <div className="container mx-auto max-w-4xl rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-br from-[#16161a] to-[#0B0B0F] px-5 py-6 md:px-8 md:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center md:text-left flex flex-col md:flex-row items-center gap-5 md:gap-8">
      <div className="flex-1 space-y-2 md:space-y-3">
        <p className="text-xs md:text-[11px] uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Thinking about the beta?</p>
        <h3 className="text-xl md:text-2xl font-bold text-white">
          So far, does this look like the help your ads needed?
        </h3>
        <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto md:mx-0">
          If youre curious to see AdsAutoPilot in your own numbers, reserve a beta spot now and finish reading the page while we hold your place.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 w-full md:w-auto">
        <Button
          onClick={() => {
            const el = document.getElementById('join-beta');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-full md:w-auto bg-[#FF7A3D] hover:bg-[#FF4F2C] text-white font-bold px-6 py-2.5 rounded-xl text-sm md:text-base shadow-[0_0_25px_rgba(255,122,61,0.4)]"
        >
          Yes, I want to try the beta
        </Button>
        <p className="text-[11px] md:text-xs text-gray-500">
          No commitment. You can always leave later if its not for you.
        </p>
      </div>
    </div>
  </section>
);

const LandingPage = () => (
  <>
    <Header />
    <main>
      <Hero />
      <PainPoints />
      <Features />
      <RuleBuilder />
      <DemoSection />
      <MidBetaNudge />
      <Pricing />
      <Testimonials />
      <Roadmap />
      <div id="join-beta">
        <FinalCTA />
      </div>
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <MetaPixelPageView />
        <Helmet>
          <title>AdsAutoPilot - Intelligent Automation for KDP</title>
          <meta name="description" content="The intelligent way to automate your Amazon Ads. Lower ACOS, save time, and scale your book sales with precision." />
        </Helmet>
        <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] overflow-x-hidden font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<EditProfile />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
