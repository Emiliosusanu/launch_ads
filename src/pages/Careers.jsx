import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Careers</p>
          <h1 className="text-3xl md:text-4xl font-bold">Work with AdsAutoPilot</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            We’re a small, product‑focused team. There are no open roles listed yet, but we’re always happy to connect with people who deeply understand publishing and performance marketing.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">What we care about</h2>
          <ul className="space-y-2 text-sm md:text-base text-gray-300 list-disc list-inside">
            <li>Hands‑on experience with Amazon KDP or book marketing.</li>
            <li>A bias toward shipping small improvements quickly.</li>
            <li>Respect for authors’ time, money, and creative work.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">Future roles</h2>
          <p className="text-sm md:text-base text-gray-300">
            As we grow, typical roles may include customer success, technical support for ad setups, product design, and integration engineering. If this sounds interesting, we’d like to hear from you early.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">How to reach out</h2>
          <p className="text-sm md:text-base text-gray-300">
            Send a short introduction and a link to something you’ve shipped (a book, a project, a product) to
            <span className="font-medium"> jobs@adsautopilot.com</span>. We read every message, even if we can’t reply to all of them.
          </p>
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            For partnership ideas, please use the <Link to="/contact" className="text-[#FF7A3D] hover:text-[#FF4F2C]">Contact</Link> page instead.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default Careers;
