import { getDetailStories } from "../../data/api";
import { getAccessToken } from "../../utils/auth";
import Database from "../../database";

export default class DetailStoryPresenter {
  #view;
  #dbModel = Database;
  #reportId = null;

  constructor(view) {
    this.#view = view;
  }

  async loadDetailStory(id) {
    this.#reportId = id;
    const token = getAccessToken();
    try {
      const response = await getDetailStories(id, token);
      if (response.error) {
        this.#view.onDetailStoryFailed(response.message);
        return;
      }
      // Simpan ke IndexedDB untuk offline
      await this.#dbModel.putReport(response.story || response);
      this.#view.onDetailStoryLoaded(response.story || response);
    } catch (err) {
      // Saat offline, ambil dari IndexedDB
      const story = await this.#dbModel.getReportById(id);
      if (story) {
        this.#view.onDetailStoryLoaded(story);
      } else {
        this.#view.onDetailStoryFailed(
          "Gagal memuat detail cerita (offline & belum pernah dibuka)."
        );
      }
    }
  }

  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#view.renderRemoveButton();
    } else {
      this.#view.renderSaveButton();
    }
  }

  async #isReportSaved() {
    if (!this.#reportId) return false;
    return !!(await this.#dbModel.getReportById(this.#reportId));
  }

  async saveStory(story) {
    try {
      await this.#dbModel.putReport(story);
      this.#view.saveStorySuccess(
        "Story berhasil disimpan ke daftar tersimpan!"
      );
    } catch (error) {
      this.#view.saveStoryFailed("Gagal menyimpan story: " + error.message);
    }
  }

  async removeStory(id) {
    try {
      await this.#dbModel.deleteReport(id);
      this.#view.removeStorySuccess(
        "Story berhasil dihapus dari daftar tersimpan!"
      );
    } catch (error) {
      this.#view.removeStoryFailed("Gagal menghapus story: " + error.message);
    }
  }
}
