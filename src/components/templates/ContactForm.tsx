"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Send } from "lucide-react";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  fields?: string[];
  submitLabel?: string;
}

export default function ContactForm({
  title = "Get in Touch",
  subtitle,
  fields = ["name", "email", "message"],
  submitLabel = "Send Message",
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ContactForm submitted:", formData);
  };

  const fieldConfig: Record<
    string,
    { type: string; placeholder: string; rows?: number }
  > = {
    name: { type: "text", placeholder: "Your Name" },
    email: { type: "email", placeholder: "Your Email" },
    phone: { type: "tel", placeholder: "Phone Number" },
    subject: { type: "text", placeholder: "Subject" },
    message: { type: "textarea", placeholder: "Your Message", rows: 4 },
  };

  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && <p className="text-lg text-gray-400">{subtitle}</p>}
        </div>

        {/* Form */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => {
              const config = fieldConfig[field] || {
                type: "text",
                placeholder: field.charAt(0).toUpperCase() + field.slice(1),
              };

              if (config.type === "textarea") {
                return (
                  <textarea
                    key={field}
                    placeholder={config.placeholder}
                    rows={config.rows || 4}
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent hover:border-white/20 resize-none"
                  />
                );
              }

              return (
                <Input
                  key={field}
                  type={config.type}
                  placeholder={config.placeholder}
                  value={formData[field] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              );
            })}
            <Button type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              {submitLabel}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
