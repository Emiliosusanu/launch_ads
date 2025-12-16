import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Features</p>
          <h1 className="text-3xl md:text-4xl font-bold">What DropScaleAds actually does for you</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            Under the hood, DropScaleAds is a collection of automation engines focused on a single outcome: more royalties from the same or lower ad spend.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">Core automation engines</h2>
          <ul className="space-y-3 text-sm md:text-base text-gray-300 list-disc list-inside">
            <li>
              <span className="font-semibold">Bid optimisation:</span> automatically nudges bids up or down based on your target ACOS, recent performance, and minimum/maximum bounds you control.
            </li>
            <li>
              <span className="font-semibold">Negative keyword shield:</span> detects search terms that never convert or are wildly unprofitable and excludes them before they eat more budget.
            </li>
            <li>
              <span className="font-semibold">Keyword harvester:</span> promotes winning terms from auto campaigns into tightly‑grouped manual campaigns.
            </li>
            <li>
              <span className="font-semibold">Rules engine:</span> lets you create simple "if ACOS &gt; X for Y days then lower bid by Z%" style automations without code.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">Analytics and reporting</h2>
          <ul className="space-y-2 text-sm md:text-base text-gray-300 list-disc list-inside">
            <li>Unified view of spend, sales, ACOS, and orders across campaigns and marketplaces.</li>
            <li>Simple trends cards that show whether you are moving in the right direction, not just raw numbers.</li>
            <li>Exportable snapshots so you can share performance with clients or collaborators.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">Designed for authors, not media buyers</h2>
          <p className="text-sm md:text-base text-gray-300">
            Everything in the product is designed around the realities of KDP: series vs standalones, price changes, read‑through, and seasonal spikes. The goal is to give you the feel of a dedicated ads manager, without needing to hire one.
          </p>
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Ready to see it in action? Visit the <Link to="/" className="text-[#FF7A3D] hover:text-[#FF4F2C]">homepage</Link> or go straight to <Link to="/pricing" className="text-[#FF7A3D] hover:text-[#FF4F2C]">Pricing</Link>.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default FeaturesPage;
