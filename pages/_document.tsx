import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Font Preloading for Performance */}
        <link
          rel="preload"
          href="/fonts/switzer/Switzer-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/switzer/Switzer-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/switzer/Switzer-Semibold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        
        {/* DNS Prefetch for External Resources */}
        <link rel="dns-prefetch" href="//lsxafginsylkeuyzuiau.supabase.co" />
        
        {/* Preconnect to Critical Origins */}
        <link rel="preconnect" href="https://lsxafginsylkeuyzuiau.supabase.co" />
        
        {/* Prefetch Critical API Endpoints */}
        <link rel="prefetch" href="/api/projects/featured" as="fetch" crossOrigin="anonymous" />
        <link rel="prefetch" href="/api/intro-banners" as="fetch" crossOrigin="anonymous" />
        <link rel="prefetch" href="/api/about" as="fetch" crossOrigin="anonymous" />
        
        {/* Preload Critical Pages */}
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/projects" />
        
        {/* Favicon - will be updated dynamically by JavaScript */}
        <link id="favicon" rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link id="favicon-png" rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link id="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
        
        {/* Meta Tags for Performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        
        {/* Critical CSS - Above the fold styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for initial paint */
            html, body { margin: 0; padding: 0; }
            body { 
              font-family: 'Switzer', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* Prevent layout shift */
            .pt-35 { padding-top: 8.75rem; }
            .pt-50 { padding-top: 12.5rem; }
            
            /* Loading skeleton styles */
            .animate-pulse {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .5; }
            }
            
            /* Critical font display */
            @font-face {
              font-family: 'Switzer';
              src: url('/fonts/switzer/Switzer-Regular.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Switzer';
              src: url('/fonts/switzer/Switzer-Medium.woff2') format('woff2');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Switzer';
              src: url('/fonts/switzer/Switzer-Semibold.woff2') format('woff2');
              font-weight: 600;
              font-style: normal;
              font-display: swap;
            }
          `
        }} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
