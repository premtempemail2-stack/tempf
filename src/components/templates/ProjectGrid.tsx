import { Briefcase } from "lucide-react";

interface ProjectGridProps {
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  projects?: {
    title: string;
    description?: string;
    image?: string;
    tags?: string[];
    link?: string;
  }[];
}

export default function ProjectGrid({
  title = "Featured Projects",
  subtitle,
  columns = 3,
  projects = [
    {
      title: "Project Alpha",
      description: "A modern web application built with React and Node.js",
      image: "https://picsum.photos/800/600?random=10",
      tags: ["React", "Node.js"],
    },
    {
      title: "Project Beta",
      description: "E-commerce platform with real-time inventory",
      image: "https://picsum.photos/800/600?random=11",
      tags: ["Next.js", "Stripe"],
    },
    {
      title: "Project Gamma",
      description: "Mobile app design for a fitness startup",
      image: "https://picsum.photos/800/600?random=12",
      tags: ["UI/UX", "Figma"],
    },
  ],
}: ProjectGridProps) {
  const columnClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Projects Grid */}
        <div className={`grid gap-8 ${columnClasses[columns]}`}>
          {projects.map((project, index) => (
            <div
              key={index}
              className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:bg-white/10"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden relative">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-violet-400/50" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
