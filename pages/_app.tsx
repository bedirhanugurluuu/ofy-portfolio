// pages/_app.tsx
import Layout from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Scroll to top on page refresh/load
    if (typeof window !== 'undefined') {
      // Scroll to top when page loads
      window.scrollTo(0, 0);
      
      // Also handle beforeunload for refresh
      const handleBeforeUnload = () => {
        sessionStorage.setItem('scrollToTop', 'true');
      };

      const handleLoad = () => {
        if (sessionStorage.getItem('scrollToTop') === 'true') {
          window.scrollTo(0, 0);
          sessionStorage.removeItem('scrollToTop');
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('load', handleLoad);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // Service Worker registered successfully
          })
          .catch((error) => {
            // Service Worker registration failed
          });
      });
    }

    // Preload critical data immediately for first visit
    if (typeof window !== 'undefined') {
      // Start preloading immediately, no waiting
      preloadCriticalData();
    }
  }, []);

  const preloadCriticalData = async () => {
    try {
      // Preload most visited pages' data
      const preloadPromises = [
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/intro-banners').then(r => r.json()),
        fetch('/api/about').then(r => r.json()),
        fetch('/api/news/featured').then(r => r.json()),
      ];

      // Don't wait for all, just start the requests
      Promise.all(preloadPromises).catch(() => {
        // Ignore preload errors
      });

      // Critical data preloading started
    } catch (error) {
      // Ignore preload errors
    }
  };

  // Maintenance sayfası için Layout kullanma
  if (Component.displayName === 'MaintenancePage' || 
      (typeof window !== 'undefined' && window.location.pathname === '/maintenance')) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}