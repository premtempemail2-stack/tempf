interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface StatsProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
}

export default function Stats({
  title,
  subtitle,
  stats = [
    { value: '10K+', label: 'Websites Built' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50+', label: 'Templates' },
    { value: '24/7', label: 'Support' },
  ],
}: StatsProps) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Optional Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-400">{subtitle}</p>}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
                {stat.suffix && <span className="text-violet-400">{stat.suffix}</span>}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
