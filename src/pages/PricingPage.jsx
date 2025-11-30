import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Pricing</p>
          <h1 className="text-3xl md:text-4xl font-bold">Simple pricing that scales with you</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            During the beta, we keep pricing straightforward so you can focus on results, not line items. Plans are designed around how many campaigns you run and how aggressively you want to automate.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-[#1F1F25] border border-white/5 p-6 space-y-3">
            <h2 className="text-lg font-semibold">Starter</h2>
            <p className="text-3xl font-bold">$29<span className="text-sm text-gray-500">/mo</span></p>
            <p className="text-sm text-gray-400">For authors testing Amazon ads with a small catalogue.</p>
            <ul className="mt-3 space-y-1 text-sm text-gray-300 list-disc list-inside">
              <li>Up to 3 active campaigns</li>
              <li>Daily bid optimisation</li>
              <li>Basic reporting</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-[#1F1F25] border border-[#6A00FF] p-6 space-y-3 shadow-[0_0_40px_rgba(106,0,255,0.2)]">
            <h2 className="text-lg font-semibold">Growth</h2>
            <p className="text-3xl font-bold">$79<span className="text-sm text-gray-500">/mo</span></p>
            <p className="text-sm text-gray-400">For authors with multiple series ready to scale.</p>
            <ul className="mt-3 space-y-1 text-sm text-gray-300 list-disc list-inside">
              <li>Up to 15 active campaigns</li>
              <li>Hourly optimisation and keyword harvesting</li>
              <li>Smart automation rules and priority support</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-[#1F1F25] border border-white/5 p-6 space-y-3">
            <h2 className="text-lg font-semibold">Pro</h2>
            <p className="text-3xl font-bold">$149<span className="text-sm text-gray-500">/mo</span></p>
            <p className="text-sm text-gray-400">For publishers and agencies running many accounts.</p>
            <ul className="mt-3 space-y-1 text-sm text-gray-300 list-disc list-inside">
              <li>Unlimited campaigns</li>
              <li>Real‑time optimisation and API access</li>
              <li>Dedicated account manager</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-semibold">Beta guarantee</h2>
          <p className="text-sm md:text-base text-gray-300">
            If you do not see a clear improvement in ACOS or time saved within the first 30 days, you can cancel and request a refund for your last month of subscription.
          </p>
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Pricing may be adjusted after beta as we add more automation and reporting. You will always be notified before any change.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default PricingPage;
