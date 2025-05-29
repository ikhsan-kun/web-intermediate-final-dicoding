import { getDetailStories } from "../../data/api";
import { getToken } from "../../config";
import Database from "../../database";

export default class DetailStoryPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async loadDetailStory(id) {
    const token = getToken();
    try {
      const response = await getDetailStories(id, token);
      if (response.error) {
        throw new Error(response.message);
      }
      // Hapus auto-save di sini
      this.#view.onDetailStoryLoaded(response.story || response);
    } catch (err) {
      // Saat offline, ambil dari IndexedDB
      const story = await Database.getReportById(id);
      if (story) {
        this.#view.onDetailStoryLoaded(story);
      } else {
        this.#view.onDetailStoryFailed("Gagal memuat detail cerita (offline & belum pernah dibuka).");
      }
    }
  }

  async saveStory(story) {
    await Database.putReport(story);
    this.#view.saveStorySuccess("Story berhasil disimpan!");
  }

  async removeStory(id) {
    await Database.deleteReport(id);
    this.#view.removeStorySuccess("Story berhasil dihapus!");
  }
}
