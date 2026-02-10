'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

interface ContactInfo {
  type: 'address' | 'phone' | 'email';
  value: string;
  label?: string;
}

interface ContactProps {
  title?: string;
  subtitle?: string;
  contactInfo?: ContactInfo[];
  showForm?: boolean;
  formTitle?: string;
}

export default function Contact({
  title = 'Get in Touch',
  subtitle = 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
  contactInfo = [
    { type: 'address', value: '123 Main Street, City, Country', label: 'Our Office' },
    { type: 'phone', value: '+1 (555) 123-4567', label: 'Phone' },
    { type: 'email', value: 'hello@example.com', label: 'Email' },
  ],
  showForm = true,
  formTitle = 'Send us a message',
}: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const icons = {
    address: MapPin,
    phone: Phone,
    email: Mail,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className={`grid gap-12 ${showForm ? 'lg:grid-cols-2' : ''}`}>
          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => {
              const Icon = icons[info.type];
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    {info.label && (
                      <p className="text-sm text-gray-400 mb-1">{info.label}</p>
                    )}
                    <p className="text-white">{info.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          {showForm && (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              {formTitle && (
                <h3 className="text-xl font-semibold text-white mb-6">{formTitle}</h3>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent hover:border-white/20 resize-none"
                />
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
