'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Layout, Palette, Zap, Globe } from 'lucide-react';
import { Button, Card, LoadingScreen } from '@/components/ui';
import { getTemplates } from '@/lib/api';
import { Template } from '@/lib/types';

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (err) {
        console.error('Failed to fetch templates:', err);
        setError('Failed to load templates');
        // Use mock templates for demo
        setTemplates([
          {
            _id: '1',
            name: 'SaaS Landing',
            version: '1.0.0',
            description: 'Perfect for SaaS products and startups',
            thumbnail: 'https://picsum.photos/800/600?random=1',
            category: 'saas',
            config: { pages: [], theme: {}, navigation: [], footer: {} },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '2',
            name: 'Portfolio Pro',
            version: '1.0.0',
            description: 'Showcase your work beautifully',
            thumbnail: 'https://picsum.photos/800/600?random=2',
            category: 'portfolio',
            config: { pages: [], theme: {}, navigation: [], footer: {} },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '3',
            name: 'Agency Bold',
            version: '1.0.0',
            description: 'Make a statement with bold design',
            thumbnail: 'https://picsum.photos/800/600?random=3',
            category: 'agency',
            config: { pages: [], theme: {}, navigation: [], footer: {} },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '4',
            name: 'E-commerce Store',
            version: '1.0.0',
            description: 'Launch your online store',
            thumbnail: 'https://picsum.photos/800/600?random=4',
            category: 'ecommerce',
            config: { pages: [], theme: {}, navigation: [], footer: {} },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '5',
            name: 'Blog Modern',
            version: '1.0.0',
            description: 'Share your stories with the world',
            thumbnail: 'https://picsum.photos/800/600?random=5',
            category: 'blog',
            config: { pages: [], theme: {}, navigation: [], footer: {} },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '6',
            name: 'Restaurant Menu',
            version: '1.0.0',
            description: 'Elegant restaurant website',
            thumbnail: 'https://picsum.photos/800/600?random=6',
            category: 'restaurant',
            config: { pages: [], theme: {}, navigation: [], footer: {} },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const features = [
    {
      icon: Layout,
      title: 'Beautiful Templates',
      description: 'Start with professionally designed templates',
    },
    {
      icon: Palette,
      title: 'Full Customization',
      description: 'Customize every aspect of your site',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance',
    },
    {
      icon: Globe,
      title: 'Custom Domains',
      description: 'Connect your own domain easily',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-400" />
            WebBuilder
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              No coding required
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Build stunning websites{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              in minutes
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Choose from our beautiful templates, customize everything, and publish 
            your website with a single click. No coding skills needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg">
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#templates">
              <Button variant="secondary" size="lg">
                Browse Templates
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Template
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Start with a professionally designed template and make it yours
            </p>
          </div>

          {isLoading ? (
            <LoadingScreen message="Loading templates..." />
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template, index) => (
                <motion.div
                  key={template._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * index }}
                >
                  <Card hover className="overflow-hidden group">
                    {/* Thumbnail */}
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={template.thumbnail || `https://picsum.photos/800/600?random=${index}`}
                        alt={template.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <Link href={`/templates/${template._id}`}>
                          <Button size="sm">
                            Preview
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 capitalize">
                          {template.category || 'general'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                      <Link href={`/templates/${template._id}`}>
                        <Button variant="outline" className="w-full">
                          Use This Template
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-center text-gray-500 text-sm mt-4">
              Showing demo templates. Connect to the backend to see real templates.
            </p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-violet-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Website?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Join thousands of creators and businesses who trust WebBuilder
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-violet-600 hover:bg-gray-100 shadow-lg"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="font-semibold text-white">WebBuilder</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} WebBuilder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
