import CONFIG from '../config';

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  addStory: `${CONFIG.BASE_URL}/stories`,
  getStories: `${CONFIG.BASE_URL}/stories`,
  detailStories: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  subscribe: `${CONFIG.BASE_URL}/notifications/subscribe`,
  delSubscribe: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

// Login user
export async function loginUser(credentials) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return await response.json();
}

// Register user
export async function registerUser(data) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// Get stories (list)
export async function getStories({ page, size, location = 0, token }) {
  const params = new URLSearchParams();
  if (page !== undefined) params.append('page', page);
  if (size !== undefined) params.append('size', size);
  if (location !== undefined) params.append('location', location);

  const url = `${ENDPOINTS.getStories}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

// Get detail story
export async function getDetailStories(id, token) {
  const response = await fetch(ENDPOINTS.detailStories(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

// Add story (with photo)
export async function addStory(formData, token) {
  const response = await fetch(ENDPOINTS.addStory, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Jangan set Content-Type, biarkan browser yang set (karena FormData)
    },
    body: formData,
  });
  return await response.json();
}

// Subscribe push notification
export async function subscribePushNotification(subscription, token) {
  return fetch(ENDPOINTS.subscribe, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // <-- pastikan ini ada dan token valid
    },
    body: JSON.stringify(subscription),
  });
}

// Unsubscribe push notification
export async function unsubscribePushNotification(data, token) {
  const response = await fetch(ENDPOINTS.delSubscribe, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export default ENDPOINTS;
