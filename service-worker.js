const CACHE_NAME = 'galgar-consultoria-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// Instalando o Service Worker e armazenando em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Ativa imediatamente
  );
});

// Intercepta requisições para servir conteúdo do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html')) // Offline fallback
  );
});

// Atualiza o cache quando o Service Worker é ativado
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🔄 Background Sync para envio de dados offline
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      sendPendingRequests()
    );
  }
});

// Função para reenviar requisições pendentes quando a internet voltar
async function sendPendingRequests() {
  const requests = await getPendingRequests();
  for (const request of requests) {
    fetch(request.url, {
      method: request.method,
      body: request.body
    }).then(response => {
      if (response.ok) {
        removePendingRequest(request.id);
      }
    }).catch(err => console.error('Falha ao reenviar:', err));
  }
}

// 🔔 Push Notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Notificação', body: 'Nova mensagem recebida' };
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
      badge: '/badge.png'
    })
  );
});

// 📅 Periodic Background Sync (PWA instalado)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(fetchAndCacheData());
  }
});

// Função para buscar novos dados periodicamente
async function fetchAndCacheData() {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch('/api/latest-data');
  if (response.ok) {
    await cache.put('/api/latest-data', response.clone());
  }
}
