import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Contact</p>
          <h1 className="text-3xl md:text-4xl font-bold">Get in touch</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            We’d love to hear from you—whether you’re an author curious about the beta, a partner, or just have feedback about the site.
          </p>
        </header>

        <section className="space-y-3 text-sm md:text-base text-gray-300">
          <h2 className="text-xl md:text-2xl font-semibold">Support & product questions</h2>
          <p>
            For help with the product or questions about your account, email us at
            <span className="font-medium"> support@adsautopilot.com</span>.
          </p>
        </section>

        <section className="space-y-3 text-sm md:text-base text-gray-300">
          <h2 className="text-xl md:text-2xl font-semibold">Partnerships & collaborations</h2>
          <p>
            For podcast appearances, joint promotions, or education partnerships, contact
            <span className="font-medium"> partners@adsautopilot.com</span>.
          </p>
        </section>

        <section className="space-y-3 text-sm md:text-base text-gray-300">
          <h2 className="text-xl md:text-2xl font-semibold">Press</h2>
          <p>
            For press and media enquiries, reach out to
            <span className="font-medium"> press@adsautopilot.com</span>.
          </p>
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            For privacy or legal questions, please see our <Link to="/legal" className="text-[#FF7A3D] hover:text-[#FF4F2C]">Legal</Link> page.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default Contact;
