const CACHE_NAME = "pwa-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/assets/logo-galgar-icon.svg"
];

// Instalar e armazenar no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Servir do cache quando offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    const data = await getPendingData();
    if (data) {
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Dados sincronizados com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao sincronizar dados:', error);
  }
}

// Função fictícia para obter dados pendentes do IndexedDB
async function getPendingData() {
  return { message: "Dados pendentes para sincronizar" };
}
// Escuta eventos de sincronização periódica
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "sync-latest-data") {
    event.waitUntil(updateData());
  }
});

// Função para buscar novos dados do servidor
async function updateData() {
  try {
    const response = await fetch("/api/latest-data"); // Substitua pela URL real da sua API
    const data = await response.json();
    console.log("🔄 Dados atualizados:", data);
  } catch (error) {
    console.error("❌ Erro ao atualizar dados:", error);
  }
}
