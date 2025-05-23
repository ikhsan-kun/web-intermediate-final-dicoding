import { convertBase64ToUint8Array } from "./index";
import { subscribePushNotification, unsubscribePushNotification } from "../data/api";
import { getAccessToken } from "../utils/auth";
import CONFIG, { VAPID_PUBLIC_KEY } from "../config";

export function isNotificationAvailable() {
  return "Notification" in window;
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export function isNotificationGranted() {
  return Notification.permission === "granted";
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error("Notification API unsupported.");
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === "denied") {
    alert("Izin notifikasi ditolak.");
    return false;
  }

  if (status === "default") {
    alert("Izin notifikasi ditutup atau diabaikan.");
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    console.error("Service worker belum terdaftar.");
    return null;
  }
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) return;

  const registration = await navigator.serviceWorker.ready;
  let pushSubscription = await registration.pushManager.getSubscription();
  if (!pushSubscription) {
    pushSubscription = await registration.pushManager.subscribe(
      generateSubscribeOptions()
    );
  }
  if (!pushSubscription) {
    alert("Gagal mendapatkan push subscription.");
    return;
  }

  const { endpoint, keys } = pushSubscription.toJSON();
  const response = await subscribePushNotification({ endpoint, keys });

  if (!response.ok) {
    alert("Langganan push notification gagal diaktifkan.");
    return;
  }
  alert("Langganan push notification berhasil diaktifkan.");
}

export async function unsubscribe() {
  const pushSubscription = await getPushSubscription();
  if (!pushSubscription) {
    alert("Belum berlangganan push notification.");
    return;
  }
  const { endpoint } = pushSubscription.toJSON();
  const response = await unsubscribePushNotification({ endpoint });
  await pushSubscription.unsubscribe();

  if (!response.ok) {
    alert("Gagal berhenti langganan push notification.");
    return;
  }
  alert("Berhasil berhenti langganan push notification.");
}