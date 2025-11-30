import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">
          Last updated: November 30, 2025
        </p>

        <div className="space-y-6 text-sm md:text-base text-gray-300 leading-relaxed">
          <p>
            AdsAutoPilot ("we", "our", or "us") provides tools to help Amazon KDP authors monitor and optimize their advertising campaigns. This policy explains how we handle data when you use our website and dashboard.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">1. Data we collect</h2>
          <p>
            We collect only the information necessary to operate the beta and improve the product:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><span className="font-medium">Account details:</span> email address and basic profile information you provide.</li>
            <li><span className="font-medium">Usage data:</span> actions taken in the app (for example, viewing dashboards or changing settings).</li>
            <li><span className="font-medium">Advertising data:</span> performance metrics we pull from your connected ad accounts, where applicable.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-4">2. How we use data</h2>
          <p>We use your data to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide and maintain the AdsAutoPilot service.</li>
            <li>Show you reporting, insights, and automation suggestions.</li>
            <li>Improve the product based on aggregated, anonymised usage patterns.</li>
            <li>Communicate important product updates, security notices, and billing‑related information.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-4">3. Data sharing</h2>
          <p>
            We do <span className="font-semibold">not</span> sell your data. We only share it with trusted subprocessors that help us run the service (for example hosting, analytics, authentication), and only to the extent necessary for them to perform their work.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">4. Data retention</h2>
          <p>
            We keep your data for as long as your account is active or as needed to provide the service. You can request deletion of your account and associated data at any time.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">5. Your rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request corrections to inaccurate data.</li>
            <li>Request deletion of your data, subject to legal obligations.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-4">6. Contact</h2>
          <p>
            For any privacy questions or requests, contact us at
            <span className="font-medium"> support@adsautopilot.com</span>.
          </p>

          <div className="mt-10">
            <Link to="/" className="text-sm text-[#FF7A3D] hover:text-[#FF4F2C]">← Back to homepage</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
