"use client";

import { motion } from "framer-motion";

interface StatItem {
  value: string;
  label: string;
  image: string; // The circular icon graphic
}

interface School1StatsProps {
  stats?: StatItem[];
  leftCharacter?: string; // Girl reading
  rightCharacter?: string; // Boy on bike
  backgroundImage?: string;
}

export default function School1Stats({
  stats = [
    {
      value: "20+",
      label: "International Curriculum",
      image: "https://cdn-icons-png.flaticon.com/512/3074/3074058.png",
    },
    {
      value: "1000+",
      label: "Students",
      image: "https://cdn-icons-png.flaticon.com/512/10294/10294706.png",
    },
    {
      value: "100+",
      label: "Excellent Teachers",
      image: "https://cdn-icons-png.flaticon.com/512/8686/8686118.png",
    },
    {
      value: "500+",
      label: "Best Activities",
      image: "https://cdn-icons-png.flaticon.com/512/8628/8628052.png",
    },
  ],
  backgroundImage = "https://www.transparenttextures.com/patterns/handmade-paper.png",
}: School1StatsProps) {
  return (
    <section className="bg-[#fe9c01] py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Floating Letters Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <span className="absolute top-10 left-1/4 text-8xl font-black text-white/10">
          a
        </span>
        <span className="absolute top-40 right-1/3 text-6xl font-black text-white/10">
          b
        </span>
        <span className="absolute bottom-20 left-10 text-9xl font-black text-white/10">
          o
        </span>
        <span className="absolute top-1/2 left-1/2 text-[150px] font-black text-white/10 -translate-x-1/2 -translate-y-1/2">
          Z
        </span>
        <span className="absolute top-10 right-1/4 text-8xl font-black text-[#00bcd4]/20 animate-bounce">
          4
        </span>
        <span className="absolute bottom-40 right-10 text-7xl font-black text-[#f50057]/20">
          k
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center p-6 mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {item.value}
                  </span>
                  <p className="text-white font-bold text-sm tracking-wide">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
