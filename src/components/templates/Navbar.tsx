"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import { NavItem } from "@/lib/types";

interface NavTab {
  id?: string;
  label: string;
  action: string;
}

interface NavbarProps {
  logo?: string;
  logoText?: string;
  links?: NavItem[];
  ctaText?: string;
  ctaLink?: string;
  sticky?: boolean;
  // Seed data aliases
  logoUrl?: string;
  tabs?: NavTab[];
}

export default function Navbar({
  logo,
  logoText = "WebBuilder",
  links,
  ctaText = "Get Started",
  ctaLink = "#",
  sticky = true,
  // Seed data aliases
  logoUrl,
  tabs,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Resolve aliases: convert tabs to links format if links not provided
  const resolvedLogo = logo || logoUrl;
  const resolvedLinks: NavItem[] =
    links ||
    (tabs
      ? tabs.map((t) => ({ label: t.label, href: t.action }))
      : [
          { label: "Home", href: "#" },
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ]);


  return (
    <nav
      className={`w-full py-4 px-6 ${
        sticky
          ? "sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10"
          : ""
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          {resolvedLogo && (
            <img src={resolvedLogo} alt={logoText} className="h-8 w-auto" />
          )}
          {logoText}
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {resolvedLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          {ctaText && (
            <a href={ctaLink}>
              <Button>{ctaText}</Button>
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-b border-white/10 py-4 px-6">
          <div className="flex flex-col gap-4">
            {resolvedLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {ctaText && (
              <a href={ctaLink} className="mt-2">
                <Button className="w-full">{ctaText}</Button>
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
