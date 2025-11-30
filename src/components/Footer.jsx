
import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
const Footer = () => {
  const {
    toast
  } = useToast();
  const handleClick = e => {
    e.preventDefault();
    toast({
      title: "Feature under construction",
      description: "We are updating this page.",
      variant: "default"
    });
  };
  return <footer className="bg-[#0B0B0F] border-t border-white/5 py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#6A00FF] to-[#FF7A3D] block mb-4">
              AdsAutoPilot
            </span>
            <p className="text-sm text-gray-500 leading-relaxed">
              Intelligent automation for Amazon KDP authors. 
              Designed for the modern publisher.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/product/features" className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">Features</Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">Pricing</Link>
                </li>
                <li>
                  <Link to="/roadmap" className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">Roadmap</Link>
                </li>
                <li>
                  <Link to="/changelog" className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">Changelog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">About</Link>
                </li>
                <li>
                  <Link to="/careers" className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">Careers</Link>
                </li>
                <li>
                  <Link to="/legal" className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">Legal</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="font-bold text-white mb-4 text-sm">Social</h4>
              <ul className="space-y-3">
                {['Twitter', 'LinkedIn', 'Instagram'].map(item => (
                  <li key={item}>
                    <a href="#" onClick={handleClick} className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2025 AdsAutoPilot LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-gray-600 hover:text-gray-400">Privacy</Link>
            <Link to="/terms" className="text-xs text-gray-600 hover:text-gray-400">Terms</Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
