import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/ui/logo';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setIsScrolled(currentY > 10);

      const lastY = lastScrollYRef.current;
      const isScrollingDown = currentY > lastY;

      // Only hide when scrolling down past a small threshold and menu is closed
      if (!isMobileMenuOpen) {
        if (isScrollingDown && currentY > 80) {
          setIsHidden(true);
        } else if (!isScrollingDown) {
          setIsHidden(false);
        }
      }

      lastScrollYRef.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    } else {
      if (id === 'login') {
        navigate('/login');
        return;
      }
      toast({
        title: "Navigation",
        description: `Navigating to ${id}`,
        variant: "default"
      });
      setIsMobileMenuOpen(false);
    }
  };

  const handleJoinBeta = () => {
    const ctaSection = document.getElementById('join-beta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    } else {
        // Fallback if ID is missing or on another page
        window.location.href = "/#join-beta";
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: isHidden ? -100 : 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
        isScrolled ? 'bg-[#0B0B0F]/90 backdrop-blur-xl border-white/10 py-3' : 'bg-transparent border-transparent py-5'
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
           <Logo />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'Testimonials'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group py-2"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF7A3D] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <div className="w-px h-5 bg-white/10 mx-2" />
          <button
            onClick={() => scrollToSection('login')}
            className="text-sm font-medium text-white hover:text-[#FF7A3D] transition-colors flex items-center gap-2"
          >
            <Lock size={14} className="text-gray-500" />
            Log in
          </button>
          <Button
            onClick={handleJoinBeta}
            className="bg-gradient-to-r from-[#FF7A3D] to-[#FF4F2C] hover:opacity-90 text-white border border-[#C149FF]/30 shadow-lg rounded-full px-6 h-10 text-sm font-bold transition-all hover:scale-105 active:scale-95"
          >
            Get Early Access
          </Button>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden z-50 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 bg-[#0B0B0F] pt-28 px-6 overflow-y-auto z-40"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              {['Features', 'Pricing', 'Testimonials'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-left text-gray-300 border-b border-white/5 pb-4 hover:text-white hover:border-white/20 transition-all"
                >
                  {item}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('login')}
                className="text-left text-gray-300 border-b border-white/5 pb-4 hover:text-white hover:border-white/20 transition-all"
              >
                Log In
              </button>
              <Button
                onClick={handleJoinBeta}
                className="w-full bg-gradient-to-r from-[#FF7A3D] to-[#FF4F2C] text-white h-14 text-lg rounded-xl mt-6 shadow-lg font-bold"
              >
                Get Early Access Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
