// pages/_app.tsx
import Layout from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
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

      console.log('Critical data preloading started');
    } catch (error) {
      // Ignore preload errors
    }
  };

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}