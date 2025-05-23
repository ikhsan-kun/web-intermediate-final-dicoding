// filepath: c:\Users\ACER\OneDrive\Desktop\project-web-intermediate\starter-project-with-webpack\src\scripts\data\api.js
import CONFIG from '../config';
import { getAccessToken, removeAccessToken, saveToken } from '../utils/auth';
const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  addStory: `${CONFIG.BASE_URL}/stories`,
  addStoryGuest: `${CONFIG.BASE_URL}/stories/guest`,
  getStories: `${CONFIG.BASE_URL}/stories` ,
  detailStories: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  subscribe : `${CONFIG.BASE_URL}/notifications/subscribe`,
  delSubscribe : `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function loginUser(credentials) {
  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return await fetchResponse.json();
}

export async function registerUser(userData) {
  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return await fetchResponse.json();
}

export async function addStory(formData, token) {
  const fetchResponse = await fetch(ENDPOINTS.addStory, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return await fetchResponse.json();
}

export async function addStoryGuest(storyData) {
  const fetchResponse = await fetch(ENDPOINTS.addStoryGuest, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: storyData,
  });
  return await fetchResponse.json();
}

export async function getStories({ page, size, location = 0, token }) {
  const params = new URLSearchParams();
  if (page !== undefined) params.append('page', page);
  if (size !== undefined) params.append('size', size);
  if (location !== undefined) params.append('location', location);

  const url = `${ENDPOINTS.getStories}?${params.toString()}`;

  const fetchResponse = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await fetchResponse.json();
}

export async function getDetailStories(id, token) {
  const fetchResponse = await fetch(ENDPOINTS.detailStories(id), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await fetchResponse.json();
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });
 
  const fetchResponse = await fetch(ENDPOINTS.subscribe, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
 
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
 
export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const fetchResponse = await fetch(ENDPOINTS.delSubscribe, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
