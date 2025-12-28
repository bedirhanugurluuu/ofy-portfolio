// components/Layout.tsx
import Header from "./Header";
import { ReactNode, useEffect } from "react";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isGalleryPage = router.pathname === '/gallery';
  useEffect(() => {
    // Dynamic favicon based on system theme
    const updateFavicon = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const favicon = document.getElementById('favicon') as HTMLLinkElement;
      const faviconPng = document.getElementById('favicon-png') as HTMLLinkElement;
      const appleTouchIcon = document.getElementById('apple-touch-icon') as HTMLLinkElement;
      
      if (isDark) {
        // Dark mode - use dark favicon
        if (favicon) favicon.href = '/favicon-light.ico';
        if (faviconPng) faviconPng.href = '/favicon-light.png';
        if (appleTouchIcon) appleTouchIcon.href = '/favicon-light.png';
      } else {
        // Light mode - use light favicon
        if (favicon) favicon.href = '/favicon-dark.ico';
        if (faviconPng) faviconPng.href = '/favicon-dark.png';
        if (appleTouchIcon) appleTouchIcon.href = '/favicon-dark.png';
      }
    };

    // Set initial favicon
    updateFavicon();

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateFavicon);

    // Preload critical pages on mount
    const preloadPages = () => {
      const links = [
        '/about',
        '/projects', 
        '/blog',
        '/contact'
      ];
      
      links.forEach(link => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'prefetch';
        linkElement.href = link;
        document.head.appendChild(linkElement);
      });
    };

    // Preload after initial render
    const timer = setTimeout(preloadPages, 1000);
    
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', updateFavicon);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${isGalleryPage ? 'bg-black' : 'bg-white z-2 rounded-bl-lg rounded-br-lg'}`}>{children}</main>
      {!isGalleryPage && <Footer />}
    </div>
  );
}
