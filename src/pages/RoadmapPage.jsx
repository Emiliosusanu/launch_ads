import React from 'react';
import { Link } from 'react-router-dom';

const RoadmapPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Product roadmap</p>
          <h1 className="text-3xl md:text-4xl font-bold">Where AdsAutoPilot is headed</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            We ship in small, steady iterations. This roadmap is intentionally high‑level and focuses on value to authors, not internal technical tasks.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Now (public beta)</h2>
          <ul className="space-y-1 text-sm md:text-base text-gray-300 list-disc list-inside">
            <li>Bid optimisation for Sponsored Products campaigns.</li>
            <li>Negative keyword automation for obvious money‑wasting terms.</li>
            <li>Keyword harvesting from auto to manual campaigns.</li>
            <li>Core dashboard for spend, sales, ACOS and orders.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Next 3–6 months</h2>
          <ul className="space-y-1 text-sm md:text-base text-gray-300 list-disc list-inside">
            <li>Multi‑region support with currency and tax awareness.</li>
            <li>Deeper series‑level reporting (read‑through aware).</li>
            <li>More battle‑tested rule templates for common situations.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Future experiments</h2>
          <ul className="space-y-1 text-sm md:text-base text-gray-300 list-disc list-inside">
            <li>Generative suggestions for new ad copy and keyword angles.</li>
            <li>Automation recipes shared by top performing authors.</li>
            <li>Deeper integrations with reader analytics tools.</li>
          </ul>
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Roadmap items are subject to change as we learn from beta users. If you have feedback or ideas, we’d love to hear from you.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default RoadmapPage;
