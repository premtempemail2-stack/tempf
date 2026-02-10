import { Button } from '@/components/ui';

interface ContentProps {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  buttonText?: string;
  buttonLink?: string;
}

export default function Content({
  title = 'About Us',
  subtitle,
  content = 'We are passionate about creating beautiful, functional websites that help businesses succeed online. Our team of experts combines creativity with technical expertise to deliver exceptional results.',
  image = 'https://picsum.photos/600/400',
  imagePosition = 'right',
  buttonText,
  buttonLink,
}: ContentProps) {
  const contentBlock = (
    <div className="flex flex-col justify-center">
      {subtitle && (
        <span className="text-violet-400 text-sm font-medium mb-2">{subtitle}</span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-4">
        {content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {buttonText && (
        <div className="mt-8">
          <a href={buttonLink || '#'}>
            <Button>{buttonText}</Button>
          </a>
        </div>
      )}
    </div>
  );

  const imageBlock = (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl blur-3xl" />
      <img
        src={image}
        alt={title}
        className="relative rounded-2xl w-full object-cover shadow-2xl"
      />
    </div>
  );

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {imagePosition === 'left' ? (
            <>
              {imageBlock}
              {contentBlock}
            </>
          ) : (
            <>
              {contentBlock}
              {imageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
