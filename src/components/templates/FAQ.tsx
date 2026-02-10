'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
}

export default function FAQ({
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions',
  items = [
    {
      question: 'How do I get started?',
      answer: 'Simply sign up for an account, choose a template, and start customizing. Our intuitive editor makes it easy to create beautiful websites in minutes.',
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes! You can connect your own custom domain to any website you create. We provide step-by-step instructions to help you set it up.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'We offer a 14-day free trial on all plans. No credit card required to start.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time, no questions asked.',
    },
  ],
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-medium text-white">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
