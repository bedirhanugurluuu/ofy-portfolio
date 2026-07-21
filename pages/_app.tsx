// pages/_app.tsx
import Layout from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import Script from 'next/script'

const GA_MEASUREMENT_ID = 'G-N443NDE4H4'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

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
    // Anasayfaya geri dönüldüğünde scroll pozisyonunu sıfırla
    const handleRouteChangeStart = (url: string) => {
      if (url === '/' || url === '') {
        // Anasayfaya dönüleceğinde scroll'u hemen sıfırla
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };

    const handleRouteChangeComplete = (url: string) => {
      if (url === '/' || url === '') {
        // Anasayfaya dönüldüğünde scroll'u tekrar sıfırla (güvence için)
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 0);
      }

      if (typeof window.gtag === 'function') {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        });
      }
    };

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(() => {
            // Service Worker registered successfully
          })
          .catch(() => {
            // Service Worker registration failed
          });
      });
    }
  }, []);

  // Maintenance sayfası için Layout kullanma
  const isMaintenancePage = Component.displayName === 'MaintenancePage' || router.pathname === '/maintenance';
  
  if (isMaintenancePage) {
    return <Component {...pageProps} />;
  }

  const pageFlags = Component as typeof Component & {
    darkMain?: boolean;
    hideFooter?: boolean;
  };

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Layout darkMain={Boolean(pageFlags.darkMain)} hideFooter={Boolean(pageFlags.hideFooter)}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
