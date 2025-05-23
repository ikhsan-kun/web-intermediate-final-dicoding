import { addStory } from "../../data/api";
import { getAccessToken } from "../../utils/auth";
import Database from "../../database";

export default class AddStoryPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async submitStory(formData) {
    const token = getAccessToken();
    try {
      const response = await addStory(formData, token);
      if (response.error) {
        this.#view.onAddStoryFailed(response.message || "Gagal menambah cerita.");
      } else {
        this.#view.onAddStorySuccess("Cerita berhasil ditambahkan!");
      }
    } catch (err) {
      this.#view.onAddStoryFailed("Terjadi kesalahan saat mengirim data.");
    }
    const obj = {};
    for (const [key, value] of formData.entries()) {
      obj[key] = value;
    }
    // Jika ada file, simpan sebagai base64
    if (obj.photo instanceof File) {
      obj.photo = await fileToBase64(obj.photo);
    }
    await Database.savePendingStory(obj);

    // Daftarkan background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-new-story');
    }
    this.#view.onAddStorySuccess("Cerita akan diupload otomatis saat online!");
  }
}

// Helper convert file to base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}