import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Product = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] mb-3 font-semibold">Product overview</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">DropScaleAds for Amazon KDP authors</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            DropScaleAds is an automation layer on top of Amazon Ads, built specifically for self‑publishers. It helps you keep ACOS under control, protect against wasted spend, and scale winning campaigns without living inside spreadsheets.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">What problems it solves</h2>
          <ul className="space-y-2 text-sm md:text-base text-gray-300 list-disc list-inside">
            <li>Wasted ad spend on non‑converting keywords.</li>
            <li>Hours lost manually changing bids and searching search term reports.</li>
            <li>No clear view of profitability across markets and campaigns.</li>
            <li>Difficulty scaling winning campaigns without destroying ACOS.</li>
          </ul>
        </section>

        <section className="space-y-4 bg-[#111118] border border-white/10 rounded-2xl p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold">Clarity instead of chaos</h2>
          <p className="text-sm md:text-base text-gray-300">
            Stop guessing what to fix in your Amazon Ads. Let clarity, not chaos, guide your campaigns.
          </p>
          <p className="text-sm md:text-base text-gray-300">
            Built for authors who are tired of spending hours inside the ads dashboard. DropScaleAds helps you understand what’s happening, stay in control, and manage your campaigns with confidence&nbsp;— without the stress and overwhelm.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              onClick={() => {
                const el = document.getElementById('join-beta');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto bg-[#FF7A3D] hover:bg-[#FF4F2C] text-white font-bold px-6 py-2.5 rounded-xl text-sm md:text-base"
            >
              Start controlling my ads &rarr;
            </Button>
            <p className="text-xs md:text-sm text-gray-400 max-w-md">
              No credit card. Cancel anytime. Designed for authors managing ongoing ads.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Who it is for</h3>
            <ul className="space-y-1 text-sm md:text-base text-gray-300 list-disc list-inside">
              <li>Authors spending at least $300–$500/month on Amazon ads.</li>
              <li>Small publishers managing multiple series and pen names.</li>
              <li>Agencies running campaigns for KDP clients.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">What you get</h3>
            <ul className="space-y-1 text-sm md:text-base text-gray-300 list-disc list-inside">
              <li>Always‑on bid optimisation based on your ACOS targets.</li>
              <li>Negative keyword automation that shuts down bad searches before they drain your budget.</li>
              <li>Keyword harvesting from auto to manual campaigns.</li>
              <li>A clean dashboard that shows the numbers that matter: spend, sales, ACOS and orders.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">How it works at a high level</h2>
          <ol className="space-y-2 text-sm md:text-base text-gray-300 list-decimal list-inside">
            <li>You connect your Amazon Ads account to DropScaleAds.</li>
            <li>You set your goals (target ACOS, monthly budgets, and a few guardrails).</li>
            <li>Our engine monitors performance and adjusts bids, keywords, and rules on a regular schedule.</li>
            <li>You review recommendations in the dashboard and keep full control to pause or override any rule.</li>
          </ol>
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Still exploring? Check the <Link to="/features" className="text-[#FF7A3D] hover:text-[#FF4F2C]">Features</Link> and <Link to="/pricing" className="text-[#FF7A3D] hover:text-[#FF4F2C]">Pricing</Link> pages next.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default Product;
