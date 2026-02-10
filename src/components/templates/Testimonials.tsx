import { Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role?: string;
  company?: string;
  image?: string;
  content: string;
  rating?: number;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

export default function Testimonials({
  title = 'What Our Customers Say',
  subtitle = 'Trusted by thousands of businesses worldwide',
  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechCorp',
      content: 'This platform has completely transformed how we build websites. The ease of use is unmatched.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Director',
      company: 'GrowthLabs',
      content: 'We\'ve seen a 300% increase in conversions since switching to this platform. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Founder',
      company: 'DesignStudio',
      content: 'The customization options are incredible. We can create exactly what we envision.',
      rating: 5,
    },
  ],
}: TestimonialsProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-violet-500/30 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-violet-500/50 mb-4" />

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.content}</p>

              {/* Rating */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="text-violet-400 font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-gray-400">
                      {testimonial.role}{testimonial.role && testimonial.company && ' at '}{testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
