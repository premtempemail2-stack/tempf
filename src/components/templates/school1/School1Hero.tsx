"use client";

import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRenderContext } from "../RenderProvider";

interface School1HeroProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  mainImage?: string; // The KIDS letter graphic
  leftGraphic?: string; // The boy character
  rightGraphic?: string; // The girl character
}

export default function School1Hero({
  headline = "A Perfect Place To Explore Your Kid's Talent",
  subheadline = "Happy World",
  description = "Tincidunt arcu non sodales neque sodales ut etiam. Diam phasellus vestibulum lorem sed risus. Elit scelerisque mauris pellentesque pulvinar pellentesque.",
  ctaText = "Learn More",
  ctaLink = "#",
  mainImage, // KIDS letters
  leftGraphic, // Boy
  rightGraphic, // Girl
}: School1HeroProps) {
  const { resolveLink } = useRenderContext();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#fafafa] pt-20">
      {/* Decorative Top Border (Scalloped edge effect) */}
      <div className="absolute top-0 left-0 w-full h-12 flex z-10">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="w-[2.5%] h-full bg-[#00bcd4] rounded-b-full"
          ></div>
        ))}
      </div>

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/baby-bottles.png')`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="max-w-7xl relative z-10 w-full">
        <div className="flex flex-col items-center justify-center text-center w-full">
          <div className="w-full z-10 mb-12">
            <img
              src={
                mainImage ||
                "https://static.vecteezy.com/system/resources/previews/024/656/091/non_2x/colorful-playroom-with-toys-and-educational-materials-generated-by-ai-free-photo.jpg"
              }
              alt="KIDS"
              className="w-full h-auto drop-shadow-lg"
            />
          </div>

          <div className="max-w-3xl flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#f50057] font-black text-lg mb-4 italic"
            >
              {subheadline}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-black text-[#006080] leading-tight mb-8"
            >
              {headline}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link href={resolveLink(ctaLink)}>
                <Button className="bg-[#e91e63] hover:bg-[#c2185b] text-white rounded-full px-12 py-4 text-lg font-bold transition-all transform hover:scale-105 shadow-xl">
                  {ctaText}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wave Divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[80px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58,117.26,163.75,140.7,252.12,120,290,111.16,323.09,92.61,351.3,77.83Z"
            className="fill-[#fe9c01]"
          ></path>
        </svg>
      </div>
    </section>
  );
}
