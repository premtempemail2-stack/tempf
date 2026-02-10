import { Check } from 'lucide-react';
import { Button } from '@/components/ui';

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  buttonText?: string;
  buttonLink?: string;
  isPopular?: boolean;
}

interface PricingProps {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
}

export default function Pricing({
  title = 'Simple, Transparent Pricing',
  subtitle = 'Choose the plan that fits your needs',
  plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for small projects',
      features: ['1 Website', '10GB Storage', 'Basic Analytics', 'Email Support'],
      buttonText: 'Get Started',
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Best for growing businesses',
      features: ['5 Websites', '50GB Storage', 'Advanced Analytics', 'Priority Support', 'Custom Domain'],
      buttonText: 'Get Started',
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations',
      features: ['Unlimited Websites', '500GB Storage', 'Full Analytics Suite', '24/7 Support', 'Custom Domain', 'API Access'],
      buttonText: 'Contact Sales',
    },
  ],
}: PricingProps) {
  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-violet-500/20 to-transparent border-violet-500/50 scale-105'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-sm font-medium bg-violet-500 text-white">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                {plan.description && <p className="text-gray-400 text-sm">{plan.description}</p>}
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-400">{plan.period}</span>}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <a href={plan.buttonLink || '#'}>
                <Button
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {plan.buttonText || 'Get Started'}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
