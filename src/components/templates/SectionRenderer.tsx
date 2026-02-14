"use client";

import { Section } from "@/lib/types";
import { renderSections } from "./registry";

interface SectionRendererProps {
  sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  return <>{renderSections(sections)}</>;
}
