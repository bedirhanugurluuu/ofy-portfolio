const CACHE_NAME = 'portfolio-v1';
const STATIC_CACHE = 'portfolio-static-v1';
const API_CACHE = 'portfolio-api-v1';

// Critical resources to cache immediately
const urlsToCache = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/contact',
  // Critical API endpoints
  '/api/projects',
  '/api/projects/featured',
  '/api/about',
  '/api/intro-banners',
  '/api/news',
  '/api/news/featured',
  '/api/awards',
  // Critical assets
  '/fonts/switzer/Switzer-Regular.woff2',
  '/fonts/switzer/Switzer-Medium.woff2',
  '/fonts/switzer/Switzer-Semibold.woff2',
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static resources');
        return cache.addAll(urlsToCache);
      }),
      // Aggressively cache API responses on install
      caches.open(API_CACHE).then(async (cache) => {
        console.log('Service Worker: Pre-caching critical API data');
        try {
          // Pre-cache critical API endpoints
          const apiEndpoints = [
            '/api/projects/featured',
            '/api/intro-banners',
            '/api/about',
            '/api/news/featured'
          ];
          
          const cachePromises = apiEndpoints.map(async (endpoint) => {
            try {
              const response = await fetch(endpoint);
              if (response.ok) {
                await cache.put(endpoint, response);
                console.log('Service Worker: Pre-cached', endpoint);
              }
            } catch (error) {
              console.log('Service Worker: Failed to pre-cache', endpoint);
            }
          });
          
          await Promise.all(cachePromises);
        } catch (error) {
          console.log('Service Worker: Pre-caching failed', error);
        }
        
        return cache;
      })
    ])
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim all clients
  self.clients.claim();
});

// Fetch event - serve from cache, update in background
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static resources
  if (url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/images/')) {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Handle page requests
  if (url.pathname === '/' || url.pathname.startsWith('/about') || 
      url.pathname.startsWith('/projects') || url.pathname.startsWith('/blog')) {
    event.respondWith(handlePageRequest(request));
    return;
  }
});

// Handle API requests with cache-first strategy
async function handleApiRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Serving API from cache:', request.url);
      
      // Update cache in background
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, response.clone());
            });
          }
        })
        .catch(() => {
          // Ignore background fetch errors
        });
      
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    console.log('Service Worker: Fetching API from network:', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the response
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Service Worker: API fetch error:', error);
    return new Response(JSON.stringify({ error: 'Network error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static resources with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Serving static from cache:', request.url);
      return cachedResponse;
    }
    
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Service Worker: Static fetch error:', error);
    return new Response('Resource not available', { status: 404 });
  }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the response
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/');
  }
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending data
    console.log('Service Worker: Performing background sync');
  } catch (error) {
    console.error('Service Worker: Background sync error:', error);
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Portfolio Update', options)
  );
});
