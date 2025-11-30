import React from 'react';
import { Link } from 'react-router-dom';

const Legal = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold">Legal information</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            This page collects links to the legal documents that govern your use of AdsAutoPilot during the beta.
          </p>
        </header>

        <section className="space-y-3 text-sm md:text-base text-gray-300">
          <p>
            By using AdsAutoPilot you agree to the following documents:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <Link to="/terms" className="text-[#FF7A3D] hover:text-[#FF4F2C]">Terms of Use</Link> – what you can expect from us and what we expect from you.
            </li>
            <li>
              <Link to="/privacy" className="text-[#FF7A3D] hover:text-[#FF4F2C]">Privacy Policy</Link> – how we handle your data.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-sm md:text-base text-gray-300">
          <h2 className="text-xl md:text-2xl font-semibold">Contact for legal questions</h2>
          <p>
            For anything related to legal terms, data processing, or compliance, please contact us at
            <span className="font-medium"> legal@adsautopilot.com</span>.
          </p>
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            You can always access these documents from the footer of the site.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default Legal;
