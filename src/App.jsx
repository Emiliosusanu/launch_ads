
import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import EditProfile from '@/pages/EditProfile';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import Documentation from '@/pages/Documentation';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';

const LandingPage = () => (
  <>
    <Header />
    <main>
      <Hero />
      <PainPoints />
      <Features />
      <RuleBuilder />
      <DemoSection />
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
        <Helmet>
          <title>AdsAutoPilot - Intelligent Automation for KDP</title>
          <meta name="description" content="The intelligent way to automate your Amazon Ads. Lower ACOS, save time, and scale your book sales with precision." />
        </Helmet>
        <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] overflow-x-hidden font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<EditProfile />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/documentation" element={<Documentation />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
