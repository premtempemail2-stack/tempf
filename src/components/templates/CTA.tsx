import { Button } from '@/components/ui';

interface CTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundStyle?: 'gradient' | 'solid' | 'image';
  backgroundImage?: string;
}

export default function CTA({
  title = 'Ready to Get Started?',
  description = 'Join thousands of satisfied customers and start building your dream website today.',
  primaryButtonText = 'Start Free Trial',
  primaryButtonLink = '#',
  secondaryButtonText = 'Talk to Sales',
  secondaryButtonLink = '#',
  backgroundStyle = 'gradient',
  backgroundImage,
}: CTAProps) {
  const bgClasses = {
    gradient: 'bg-gradient-to-r from-violet-600 to-indigo-600',
    solid: 'bg-violet-600',
    image: '',
  };

  return (
    <section
      className={`relative py-20 px-6 ${backgroundStyle !== 'image' ? bgClasses[backgroundStyle] : ''}`}
      style={
        backgroundStyle === 'image' && backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {}
      }
    >
      {/* Overlay for image background */}
      {backgroundStyle === 'image' && (
        <div className="absolute inset-0 bg-violet-900/80" />
      )}

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{title}</h2>
        {description && (
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {primaryButtonText && (
            <a href={primaryButtonLink}>
              <Button
                size="lg"
                className="bg-white text-violet-600 hover:bg-gray-100 shadow-lg"
              >
                {primaryButtonText}
              </Button>
            </a>
          )}
          {secondaryButtonText && (
            <a href={secondaryButtonLink}>
              <Button
                variant="secondary"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {secondaryButtonText}
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
