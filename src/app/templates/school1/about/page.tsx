"use client";

import {
  School1Navbar,
  School1Stats,
  School1BrainTraining,
} from "@/components/templates";
import { motion } from "framer-motion";

export default function School1AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <School1Navbar />

      {/* Hero/Header for About Page */}
      <section className="bg-[#006080] py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/notebook.png')",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            About Our School
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl max-w-2xl mx-auto opacity-90 font-medium"
          >
            Dedicated to providing the best learning environment for your
            children since 2010.
          </motion.p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[40px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58,117.26,163.75,140.7,252.12,120,290,111.16,323.09,92.61,351.3,77.83Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* About Content */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              src="https://cdn.britannica.com/24/141224-050-0F5FA19C/Caregivers-children-day-care-centre.jpg"
              alt="Students"
              className="rounded-[60px] shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <span className="text-[#f50057] font-black text-sm uppercase tracking-[4px]">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#006080]">
                Empowering Young Minds for a Brighter Future
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              We believe that every child is unique and has the potential to
              achieve great things. Our school provides a nurturing and
              stimulating environment where children can explore their
              interests, develop their talents, and grow into confident and
              compassionate individuals.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-[#fe9c01]">
                  Our Mission
                </h4>
                <p className="text-gray-500 font-medium">
                  To inspire a love for learning and foster creativity in every
                  student.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-[#00bcd4]">
                  Our Vision
                </h4>
                <p className="text-gray-500 font-medium">
                  To be a leading center for educational excellence and
                  character development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reuse Stats for About Page */}
      <School1Stats />

      {/* More Info Section */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-[#006080]">
              Why Choose Us?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">
              We provide a comprehensive educational experience that goes beyond
              the classroom.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Safe Environment",
                desc: "Your child's safety and well-being are our top priorities.",
                color: "#f50057",
                icon: "🛡️",
              },
              {
                title: "Expert Teachers",
                desc: "Our educators are highly qualified and passionate about teaching.",
                color: "#00bcd4",
                icon: "🎓",
              },
              {
                title: "Rich Activities",
                desc: "From sports to arts, we offer a wide range of extracurriculars.",
                color: "#fe9c01",
                icon: "🎨",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[40px] shadow-xl hover:-translate-y-2 transition-all"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3
                  className="text-2xl font-black mb-4"
                  style={{ color: item.color }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
