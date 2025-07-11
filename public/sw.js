const CACHE_NAME = 'gymisctic-v1.0.0';
const STATIC_CACHE_NAME = 'gymisctic-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'gymisctic-dynamic-v1.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  // Core CSS and JS will be cached dynamically
];

// API routes to cache
const API_CACHE_PATTERNS = [
  /\/api\/auth\/user/,
  /\/api\/motivation-quote/,
  /\/api\/achievements/,
  /\/api\/workout-plans/,
  /\/api\/meal-plans/,
];

// Network-first routes (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /\/api\/workout-sessions/,
  /\/api\/meal-logs/,
  /\/api\/progress/,
  /\/api\/admin/,
];

// Cache-first routes (for static assets)
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:css|js)$/,
  /\/fonts\//,
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine caching strategy based on URL pattern
  if (shouldUseNetworkFirst(url.pathname)) {
    event.respondWith(networkFirst(request));
  } else if (shouldUseCacheFirst(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (shouldCacheAPI(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Network-first strategy (for dynamic API content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Cache and network failed:', request.url);
    throw error;
  }
}

// Stale-while-revalidate strategy (for API data)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('Service Worker: Network failed for:', request.url);
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Helper functions to determine caching strategy
function shouldUseNetworkFirst(pathname) {
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(pathname));
}

function shouldUseCacheFirst(pathname) {
  return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(pathname));
}

function shouldCacheAPI(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(pathname));
}

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'workout-completion') {
    event.waitUntil(syncWorkoutCompletion());
  } else if (event.tag === 'meal-logging') {
    event.waitUntil(syncMealLogging());
  } else if (event.tag === 'progress-entry') {
    event.waitUntil(syncProgressEntry());
  }
});

// Sync functions for offline actions
async function syncWorkoutCompletion() {
  try {
    // Get pending workout completions from IndexedDB
    const pendingWorkouts = await getPendingWorkouts();
    
    for (const workout of pendingWorkouts) {
      try {
        await fetch(`/api/workout-sessions/${workout.id}/complete`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workout.data)
        });
        
        // Remove from pending queue on success
        await removePendingWorkout(workout.id);
        
        // Notify clients of sync success
        await notifyClients({
          type: 'SYNC_SUCCESS',
          data: { type: 'workout', id: workout.id }
        });
      } catch (error) {
        console.log('Service Worker: Failed to sync workout:', workout.id);
      }
    }
  } catch (error) {
    console.log('Service Worker: Workout sync failed:', error);
  }
}

async function syncMealLogging() {
  try {
    const pendingMeals = await getPendingMeals();
    
    for (const meal of pendingMeals) {
      try {
        await fetch('/api/meal-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(meal.data)
        });
        
        await removePendingMeal(meal.id);
        
        await notifyClients({
          type: 'SYNC_SUCCESS',
          data: { type: 'meal', id: meal.id }
        });
      } catch (error) {
        console.log('Service Worker: Failed to sync meal:', meal.id);
      }
    }
  } catch (error) {
    console.log('Service Worker: Meal sync failed:', error);
  }
}

async function syncProgressEntry() {
  try {
    const pendingProgress = await getPendingProgress();
    
    for (const progress of pendingProgress) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress.data)
        });
        
        await removePendingProgress(progress.id);
        
        await notifyClients({
          type: 'SYNC_SUCCESS',
          data: { type: 'progress', id: progress.id }
        });
      } catch (error) {
        console.log('Service Worker: Failed to sync progress:', progress.id);
      }
    }
  } catch (error) {
    console.log('Service Worker: Progress sync failed:', error);
  }
}

// IndexedDB helper functions (simplified - would need full implementation)
async function getPendingWorkouts() {
  // Implementation would use IndexedDB to store offline actions
  return [];
}

async function removePendingWorkout(id) {
  // Remove from IndexedDB
}

async function getPendingMeals() {
  return [];
}

async function removePendingMeal(id) {
  // Remove from IndexedDB
}

async function getPendingProgress() {
  return [];
}

async function removePendingProgress(id) {
  // Remove from IndexedDB
}

// Notify all clients of sync events
async function notifyClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage(message);
  });
}

// Handle push notifications for streak reminders
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'Don\'t break your streak! Time for your workout 💪',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: 'workout-reminder',
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'start-workout',
        title: 'Start Workout',
        icon: '/icons/action-workout.png'
      },
      {
        action: 'remind-later',
        title: 'Remind Later',
        icon: '/icons/action-later.png'
      }
    ],
    data: {
      url: '/workouts',
      timestamp: Date.now()
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('GYMISCTIC Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked:', event.action);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'start-workout') {
    event.waitUntil(
      clients.openWindow('/workouts')
    );
  } else if (action === 'remind-later') {
    // Schedule another reminder in 1 hour
    setTimeout(() => {
      self.registration.showNotification('GYMISCTIC Reminder', {
        body: 'Still time for that workout! 🏋️',
        icon: '/icons/icon-192x192.png',
        tag: 'workout-reminder-later'
      });
    }, 60 * 60 * 1000); // 1 hour
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow(data.url || '/')
    );
  }
});

// Handle message events from the main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'QUEUE_OFFLINE_ACTION':
      // Queue action for background sync
      queueOfflineAction(data);
      break;
      
    case 'CLEAR_CACHE':
      // Clear specific cache
      clearCache(data.cacheName);
      break;
      
    case 'GET_CACHE_STATUS':
      // Return cache status
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
      
    default:
      console.log('Service Worker: Unknown message type:', type);
  }
});

async function queueOfflineAction(actionData) {
  // Store action in IndexedDB for background sync
  console.log('Service Worker: Queuing offline action:', actionData);
}

async function clearCache(cacheName) {
  if (cacheName) {
    await caches.delete(cacheName);
  } else {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }
  console.log('Service Worker: Cache cleared:', cacheName || 'all');
}

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status[name] = keys.length;
  }
  
  return status;
}

// Performance monitoring
self.addEventListener('fetch', event => {
  // Track performance metrics
  const start = performance.now();
  
  event.respondWith(
    fetch(event.request).then(response => {
      const duration = performance.now() - start;
      
      // Log slow requests
      if (duration > 1000) {
        console.log(`Service Worker: Slow request detected: ${event.request.url} (${duration}ms)`);
      }
      
      return response;
    })
  );
});

console.log('Service Worker: Script loaded successfully');
