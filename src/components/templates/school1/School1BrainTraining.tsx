"use client";

import { motion } from "framer-motion";

interface Activity {
  title: string;
  image: string;
  color: string;
}

interface School1BrainTrainingProps {
  title?: string;
  subtitle?: string;
  description?: string;
  activities?: Activity[];
}

export default function School1BrainTraining({
  title = "Brain Training Activities",
  subtitle = "Extra Curricular",
  description = "Tincidunt arcu non sodales neque sodales ut etiam. Diam phasellus vestibulum lorem sed risus. Elit scelerisque mauris pellentesque pulvinar pellentesque tincidunt arcu non sodales neque sodales.",
  activities = [
    {
      title: "Swimming",
      image: "https://cdn-icons-png.flaticon.com/512/10418/10418446.png",
      color: "#006080",
    },
    {
      title: "Learning",
      image: "https://cdn-icons-png.flaticon.com/512/10134/10134308.png",
      color: "#fe9c01",
    },
    {
      title: "Cycling",
      image: "https://cdn-icons-png.flaticon.com/256/10294/10294706.png",
      color: "#f50057",
    },
  ],
}: School1BrainTrainingProps) {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      {/* Background Doodles */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <img
          src="https://www.transparenttextures.com/patterns/notebook.png"
          alt="notebook"
          className="w-full h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-20 space-y-4">
          <div className="flex flex-col items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/10295/10295587.png"
              className="w-12 h-12 mb-2"
              alt="hat"
            />
            <span className="text-[#f50057] font-black text-sm uppercase tracking-[4px]">
              {subtitle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#006080]">
            {title}
          </h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Activities Layout */}
        <div className="relative flex flex-wrap justify-center items-center gap-12 lg:gap-24 pt-10">
          {activities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group flex flex-col items-center"
            >
              <div
                className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-3 border-4 border-dashed transition-all duration-500 group-hover:rotate-12`}
                style={{ borderColor: item.color }}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>

              <div className="mt-8">
                <span className="text-2xl font-black text-[#006080] group-hover:text-[#f50057] transition-colors tracking-tight">
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 left-10 opacity-40 select-none pointer-events-none"
      >
        <span className="text-6xl text-[#fe9c01]">🦋</span>
      </motion.div>
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-1/4 right-10 opacity-30 select-none pointer-events-none"
      >
        <span className="text-5xl text-[#00bcd4]">🎈</span>
      </motion.div>
    </section>
  );
}
