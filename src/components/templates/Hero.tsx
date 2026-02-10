import { Button } from '@/components/ui';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  alignment?: 'left' | 'center' | 'right';
}

export default function Hero({
  headline = 'Build Something Amazing',
  subheadline = 'Starter Template',
  description = 'Create stunning websites with our powerful and easy-to-use platform. No coding required.',
  primaryButtonText = 'Get Started',
  primaryButtonLink = '#',
  secondaryButtonText = 'Learn More',
  secondaryButtonLink = '#',
  backgroundImage,
  backgroundGradient = 'from-violet-900/50 via-gray-900 to-gray-900',
  alignment = 'center',
}: HeroProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${backgroundGradient}`} />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 py-20 flex flex-col gap-6 ${alignmentClasses[alignment]}`}>
        {subheadline && (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {subheadline}
          </span>
        )}
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
          {headline}
        </h1>
        
        {description && (
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-4">
          {primaryButtonText && (
            <a href={primaryButtonLink}>
              <Button size="lg">{primaryButtonText}</Button>
            </a>
          )}
          {secondaryButtonText && (
            <a href={secondaryButtonLink}>
              <Button variant="secondary" size="lg">{secondaryButtonText}</Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
