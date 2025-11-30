
import React from 'react';
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
                {['Features', 'Pricing', 'Roadmap', 'Changelog'].map(item => <li key={item}>
                    <a href="#" onClick={handleClick} className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">{item}</a>
                  </li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                {['About', 'Careers', 'Legal', 'Contact'].map(item => <li key={item}>
                    <a href="#" onClick={handleClick} className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">{item}</a>
                  </li>)}
              </ul>
            </div>
            <div className="hidden md:block">
               <h4 className="font-bold text-white mb-4 text-sm">Social</h4>
               <ul className="space-y-3">
                {['Twitter', 'LinkedIn', 'Instagram'].map(item => <li key={item}>
                    <a href="#" onClick={handleClick} className="text-sm text-gray-500 hover:text-[#FF7A3D] transition-colors">{item}</a>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2025 AdsAutoPilot LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" onClick={handleClick} className="text-xs text-gray-600 hover:text-gray-400">Privacy</a>
            <a href="#" onClick={handleClick} className="text-xs text-gray-600 hover:text-gray-400">Terms</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
