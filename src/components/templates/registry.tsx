"use client";

import { ComponentType } from "react";
import { Section } from "@/lib/types";

// Import all section components
import Hero from "./Hero";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Contact from "./Contact";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Stats from "./Stats";
import Team from "./Team";
import Gallery from "./Gallery";
import Content from "./Content";
import ProjectGrid from "./ProjectGrid";
import FallbackSection from "./FallbackSection";

// Component Registry - maps section types to React components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentRegistry: Record<string, ComponentType<any>> = {
  hero: Hero,
  features: Features,
  testimonials: Testimonials,
  pricing: Pricing,
  faq: FAQ,
  cta: CTA,
  contact: Contact,
  contactform: ContactForm,
  footer: Footer,
  navbar: Navbar,
  stats: Stats,
  team: Team,
  gallery: Gallery,
  content: Content,
  projectgrid: ProjectGrid,
};

// Render a single section by type (case-insensitive lookup)
export function renderSection(section: Section, index: number) {
  const Component = componentRegistry[section.type.toLowerCase()];

  if (!Component) {
    return <FallbackSection key={section.id || index} type={section.type} />;
  }

  return <Component key={section.id || index} {...section.props} />;
}

// Render multiple sections
export function renderSections(sections: Section[]) {
  return sections.map((section, index) => renderSection(section, index));
}

// Get component by type (for editor)
export function getComponent(type: string): ComponentType | null {
  return componentRegistry[type] || null;
}

// Get all available section types
export function getAvailableSectionTypes(): string[] {
  return Object.keys(componentRegistry);
}

// Section metadata for editor UI
export interface SectionMeta {
  type: string;
  label: string;
  description: string;
  icon: string;
}

export const sectionMeta: SectionMeta[] = [
  {
    type: "hero",
    label: "Hero",
    description: "Large hero section with headline and CTA",
    icon: "Layout",
  },
  {
    type: "features",
    label: "Features",
    description: "Feature grid with icons",
    icon: "Grid",
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Customer testimonials",
    icon: "Quote",
  },
  {
    type: "pricing",
    label: "Pricing",
    description: "Pricing plans comparison",
    icon: "CreditCard",
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Frequently asked questions",
    icon: "HelpCircle",
  },
  {
    type: "cta",
    label: "Call to Action",
    description: "Prominent call to action",
    icon: "MousePointer",
  },
  {
    type: "contact",
    label: "Contact",
    description: "Contact form section",
    icon: "Mail",
  },
  {
    type: "stats",
    label: "Statistics",
    description: "Key numbers and stats",
    icon: "BarChart",
  },
  {
    type: "team",
    label: "Team",
    description: "Team members showcase",
    icon: "Users",
  },
  {
    type: "gallery",
    label: "Gallery",
    description: "Image gallery",
    icon: "Image",
  },
  {
    type: "content",
    label: "Content",
    description: "Rich text content block",
    icon: "FileText",
  },
];
