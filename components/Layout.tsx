// components/Layout.tsx
import Header from "./Header";
import { ReactNode, useEffect } from "react";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
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
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white z-2 rounded-bl-lg rounded-br-lg">{children}</main>
      <Footer />
    </div>
  );
}
