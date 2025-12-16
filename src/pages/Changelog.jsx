import React from 'react';
import { Link } from 'react-router-dom';

const entries = [
  {
    date: '2025-11-30',
    title: 'Public beta polish release',
    items: [
      'Smoothed all scroll animations to remove flashing/pulsing.',
      'Added 7D / 30D / 90D views to the demo dashboards with synced KPIs.',
      'Improved hero layout, header hide-on-scroll behavior, and features grid spacing.',
      'Added Privacy and Terms pages.',
    ],
  },
  {
    date: '2025-11-25',
    title: 'Initial public beta landing page',
    items: [
      'Launched the new DropScaleAds marketing site.',
      'Added demo dashboard, pricing section, testimonials, and roadmap preview.',
    ],
  },
];

const Changelog = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-20 md:py-24">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF7A3D] font-semibold">Changelog</p>
          <h1 className="text-3xl md:text-4xl font-bold">What’s new in DropScaleAds</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl">
            A brief history of visible changes to the marketing site and product during the beta.
          </p>
        </header>

        <section className="space-y-8">
          {entries.map((entry) => (
            <article key={entry.date} className="border border-white/10 rounded-2xl p-5 md:p-6 bg-[#111118]">
              <p className="text-xs text-gray-500 mb-1 font-mono">{entry.date}</p>
              <h2 className="text-lg md:text-xl font-semibold mb-3">{entry.title}</h2>
              <ul className="space-y-1 text-sm md:text-base text-gray-300 list-disc list-inside">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <footer className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Want to see these updates live? Visit the <Link to="/" className="text-[#FF7A3D] hover:text-[#FF4F2C]">homepage</Link> or log into your dashboard.
          </p>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Back to homepage</Link>
        </footer>
      </div>
    </div>
  );
};

export default Changelog;
