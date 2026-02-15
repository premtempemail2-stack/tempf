"use client";

import {
  School1Navbar,
  School1Hero,
  School1Stats,
  School1BrainTraining,
} from "@/components/templates";

export default function School1PreviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <School1Navbar />
      <School1Hero />
      <School1Stats />
      <School1BrainTraining />
    </div>
  );
}
