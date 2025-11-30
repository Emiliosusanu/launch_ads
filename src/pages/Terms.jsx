import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3F3F4] px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Use</h1>
        <p className="text-sm text-gray-400 mb-8">
          Last updated: November 30, 2025
        </p>

        <div className="space-y-6 text-sm md:text-base text-gray-300 leading-relaxed">
          <p>
            These Terms of Use ("Terms") govern your access to and use of AdsAutoPilot, our platform that helps Amazon KDP authors monitor and optimize advertising campaigns.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">1. Beta service</h2>
          <p>
            AdsAutoPilot is currently offered as a beta product. Features may change, be added, or be removed at any time. The service is provided on an "as is" and "as available" basis.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">2. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Attempt to reverse‑engineer or copy the service.</li>
            <li>Use the product in violation of Amazon’s own policies or applicable law.</li>
            <li>Share login credentials or access with unauthorised parties.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-4">3. No guarantees</h2>
          <p>
            While AdsAutoPilot is designed to help optimise advertising, we do not guarantee specific results, sales, or performance. You remain responsible for your advertising decisions and compliance with Amazon’s policies.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">4. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, AdsAutoPilot will not be liable for any indirect, incidental, or consequential damages, or any loss of profits or revenue arising from your use of the service.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">5. Termination</h2>
          <p>
            We may suspend or terminate access to the service at any time if we reasonably believe you are misusing it or violating these Terms.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">6. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we will notify you via the app or email. Continued use of the service after changes means you accept the updated Terms.
          </p>

          <h2 className="text-xl font-semibold text-white mt-4">7. Contact</h2>
          <p>
            If you have questions about these Terms, contact us at
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

export default Terms;
