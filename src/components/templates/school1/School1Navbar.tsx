"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useRenderContext } from "../RenderProvider";

interface NavLink {
  label: string;
  href: string;
}

interface School1NavbarProps {
  phone?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  logo?: string;
  logoText?: string;
  links?: NavLink[];
  ctaText?: string;
  ctaLink?: string;
}

export default function School1Navbar({
  phone = "+000 - 123 - 456789",
  email = "info@example.com",
  socialLinks = {
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#",
  },
  logo,
  logoText = "KIDS",
  links = [
    { label: "Home", href: "./" },
    { label: "About Us", href: "./about" },
  ],
  ctaText = "Enquire Now",
  ctaLink = "./about",
}: School1NavbarProps) {
  const { resolveLink } = useRenderContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#e91e63] text-white py-2 px-6 flex flex-wrap justify-between items-center text-sm font-medium">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{email}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Follow Us :</span>
          <div className="flex gap-2">
            {socialLinks.facebook && (
              <Link
                href={socialLinks.facebook}
                className="bg-white/20 p-1.5 rounded-full hover:bg-white/40 transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </Link>
            )}
            {socialLinks.twitter && (
              <Link
                href={socialLinks.twitter}
                className="bg-white/20 p-1.5 rounded-full hover:bg-white/40 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
              </Link>
            )}
            {socialLinks.linkedin && (
              <Link
                href={socialLinks.linkedin}
                className="bg-white/20 p-1.5 rounded-full hover:bg-white/40 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </Link>
            )}
            {socialLinks.instagram && (
              <Link
                href={socialLinks.instagram}
                className="bg-white/20 p-1.5 rounded-full hover:bg-white/40 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          isScrolled ? "fixed top-0 bg-white shadow-md py-2" : "bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href={resolveLink("./")} className="flex items-center">
            {logo ? (
              <img src={logo} alt={logoText} className="h-12 w-auto" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <span className="text-3xl font-black text-[#006080] tracking-tighter">
                    {logoText}
                  </span>
                  <div className="absolute -top-4 -right-2 flex">
                    <span className="h-1.5 w-1.5 bg-red-400 rounded-full animate-bounce"></span>
                    <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                  </div>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={resolveLink(link.href)}
                className="text-[#333] font-semibold hover:text-[#e91e63] transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href={resolveLink(ctaLink)}>
              <Button className="bg-[#e91e63] hover:bg-[#c2185b] text-white rounded-full px-8 py-4 text-sm font-bold transition-all transform hover:scale-105 shadow-lg">
                {ctaText}
              </Button>
            </Link>
            <button
              className="lg:hidden text-[#333]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t p-6 shadow-xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={resolveLink(link.href)}
                  className="text-[#333] font-semibold hover:text-[#e91e63]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
