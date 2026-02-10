import * as LucideIcons from 'lucide-react';

interface Feature {
  icon?: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  columns?: 2 | 3 | 4;
}

export default function Features({
  title = 'Amazing Features',
  subtitle = 'Everything you need to build stunning websites',
  features = [
    { icon: 'Zap', title: 'Lightning Fast', description: 'Optimized for speed and performance' },
    { icon: 'Shield', title: 'Secure', description: 'Built with security best practices' },
    { icon: 'Smartphone', title: 'Responsive', description: 'Looks great on all devices' },
    { icon: 'Palette', title: 'Customizable', description: 'Easy to customize and extend' },
    { icon: 'Globe', title: 'SEO Ready', description: 'Optimized for search engines' },
    { icon: 'Headphones', title: '24/7 Support', description: 'Always here to help you' },
  ],
  columns = 3,
}: FeaturesProps) {
  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* Features Grid */}
        <div className={`grid gap-8 ${columnClasses[columns]}`}>
          {features.map((feature, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (LucideIcons as any)[feature.icon || 'Star'] || LucideIcons.Star;
            
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:bg-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
                  <IconComponent className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
