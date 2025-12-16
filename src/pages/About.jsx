import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Company</p>
          <h1 className="text-3xl md:text-4xl font-bold">About DropScaleAds</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            DropScaleAds was created for authors who are tired of guessing their way through Amazon Ads. Our goal is simple: help serious KDP publishers protect their royalties and scale winning campaigns without turning into full‑time media buyers.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">What we believe</h2>
          <ul className="space-y-2 text-sm md:text-base text-gray-300 list-disc list-inside">
            <li>Your time is better spent writing and marketing than inside ad consoles.</li>
            <li>Automation should be transparent, explainable, and always under your control.</li>
            <li>Indie authors deserve the same quality of tooling as big publishers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">Who we build for</h2>
          <p className="text-sm md:text-base text-gray-300">
            We work closely with a small group of beta authors and publishers who collectively manage hundreds of campaigns. Their feedback directly shapes the product: every new rule template, every dashboard tweak, and every automation preset.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold">Where we are now</h2>
          <p className="text-sm md:text-base text-gray-300">
            At this stage we’re intentionally small and focused. The public beta lets us prove that DropScaleAds can reliably lower ACOS and save time before we open the doors wider.
          </p>
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Curious about the product itself? Visit the <Link to="/product" className="text-[#FF7A3D] hover:text-[#FF4F2C]">Product overview</Link>.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default About;
