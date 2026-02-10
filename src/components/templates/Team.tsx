interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface TeamProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
}

export default function Team({
  title = 'Meet Our Team',
  subtitle = 'The people behind our success',
  members = [
    { name: 'John Doe', role: 'CEO & Founder', bio: 'Visionary leader with 10+ years experience' },
    { name: 'Jane Smith', role: 'CTO', bio: 'Tech expert driving innovation' },
    { name: 'Mike Johnson', role: 'Head of Design', bio: 'Creating beautiful user experiences' },
    { name: 'Sarah Williams', role: 'Lead Developer', bio: 'Building robust solutions' },
  ],
}: TeamProps) {
  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* Team Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all duration-300 text-center"
            >
              {/* Avatar */}
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center ring-4 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}

              {/* Info */}
              <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-violet-400 text-sm mb-3">{member.role}</p>
              {member.bio && <p className="text-gray-400 text-sm">{member.bio}</p>}

              {/* Social Links */}
              {member.social && (
                <div className="flex justify-center gap-3 mt-4">
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
