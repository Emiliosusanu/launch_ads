
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "I stopped checking my ads daily. My ACOS went down 40% and I have my mornings back. It literally paid for itself in 3 days.",
    author: "Sarah Jenkins",
    role: "USA Today Bestselling Author",
    initials: "SJ",
    rating: 5
  },
  {
    quote: "The most elegant software I've used for KDP. It just works, without the clutter. The AI bid adjustments are scary accurate.",
    author: "David Ross",
    role: "Thriller Writer (50+ Books)",
    initials: "DR",
    rating: 5
  },
  {
    quote: "Finally, a tool that doesn't look like a spreadsheet from 1995. Absolute game changer for my nonfiction catalog.",
    author: "Emily Chen",
    role: "Self-Publishing Coach",
    initials: "EC",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 px-6 bg-[#0B0B0F] relative">
      <div className="container mx-auto max-w-6xl">
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Trusted by 2,000+ Authors
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col p-8 rounded-3xl bg-[#1F1F25] border border-white/5 relative group hover:border-[#6A00FF]/20 transition-all hover:-translate-y-1 duration-300 h-full"
            >
              <Quote className="absolute top-8 right-8 text-white/5 w-12 h-12 group-hover:text-[#6A00FF]/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#FFB84D] text-[#FFB84D]" />
                ))}
              </div>

              <p className="text-lg text-gray-300 leading-relaxed font-medium mb-8 relative z-10 flex-1">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6A00FF] to-[#FF4F2C] flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.author}</div>
                  <div className="text-xs text-[#FF7A3D] font-medium">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
