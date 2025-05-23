import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import CONFIG from './config';
import { openDB } from 'idb';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-pages',
  })
);

// Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

// Font Awesome
registerRoute(
  ({ url }) =>
    url.origin === 'https://cdnjs.cloudflare.com' ||
    url.origin.includes('fontawesome'),
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);

// Ikon avatar dari UI Avatars
registerRoute(
  ({ url }) => url.origin === 'https://ui-avatars.com',
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// API utama (NetworkFirst agar data terbaru, fallback ke cache saat offline)
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api',
  }),
);

// Gambar dari API (StaleWhileRevalidate)
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
  }),
);

// Maptiler API (CacheFirst)
registerRoute(
  ({ url }) => url.origin.includes('maptiler'),
  new CacheFirst({
    cacheName: 'storytiler-api',
  }),
);

// Push notification handler
self.addEventListener('push', (event) => {
  let data = { title: 'Notifikasi', options: { body: '' } };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Notifikasi',
        options: { body: event.data.text() }
      };
    }
  }
  event.waitUntil(
    Promise.resolve(data.options.body).then((body) =>
      self.registration.showNotification(data.title, {
        ...data.options,
        body,
      })
    )
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-story') {
    event.waitUntil(syncPendingStories());
  }
});

async function syncPendingStories() {
  const db = await openDB('StoryApp', 2);
  const pendingStories = await db.getAll('pending-story');
  for (const [key, story] of Object.entries(pendingStories)) {
    try {
      // Convert base64 back to Blob for photo
      let formData = new FormData();
      for (const [k, v] of Object.entries(story)) {
        if (k === 'photo' && typeof v === 'string' && v.startsWith('data:')) {
          const blob = await (await fetch(v)).blob();
          formData.append('photo', blob, 'photo.png');
        } else {
          formData.append(k, v);
        }
      }
      await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + (story.token || '') },
        body: formData,
      });
      await db.delete('pending-story', story.id);
    } catch (err) {
      // Error handling bisa ditambahkan di sini
    }
  }
}
