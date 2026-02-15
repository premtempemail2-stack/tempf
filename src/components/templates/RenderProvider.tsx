"use client";

import React, { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";

interface RenderContextType {
  basePath: string;
  resolveLink: (href: string) => string;
}

const RenderContext = createContext<RenderContextType>({
  basePath: "",
  resolveLink: (href: string) => href,
});

export const useRenderContext = () => useContext(RenderContext);

export function RenderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const basePath = useMemo(() => {
    if (!pathname) return "";

    // Handle /preview/[siteId] routes
    if (pathname.startsWith("/preview/")) {
      const parts = pathname.split("/");
      if (parts.length >= 3) {
        return `/preview/${parts[2]}`;
      }
    }

    // Handle /templates/[id] routes
    if (pathname.startsWith("/templates/")) {
      const parts = pathname.split("/");
      if (parts.length >= 3) {
        // Special case for our seed data "school1" being in its own folder sometimes
        return `/templates/${parts[2]}`;
      }
    }

    // Handle /site/[siteId] routes (though usually accessed via custom domain/subdomain)
    if (pathname.startsWith("/site/")) {
      const parts = pathname.split("/");
      if (parts.length >= 3) {
        return `/site/${parts[2]}`;
      }
    }

    return "";
  }, [pathname]);

  const resolveLink = useMemo(() => {
    return (href: string) => {
      if (!href) return "#";

      // Don't modify absolute URLs or anchor links
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        return href;
      }

      // Normalize href: remove leading "./" or "/"
      const normalizedHref = href.replace(/^(\.\/|\/)/, "");

      // If normalizedHref is empty, it means root (Home)
      if (normalizedHref === "") {
        return basePath === "" ? "/" : basePath;
      }

      // Return combined path
      return basePath ? `${basePath}/${normalizedHref}` : `/${normalizedHref}`;
    };
  }, [basePath]);

  return (
    <RenderContext.Provider value={{ basePath, resolveLink }}>
      {children}
    </RenderContext.Provider>
  );
}
