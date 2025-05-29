import { addStory } from "../../data/api";
import { getAccessToken } from "../../utils/auth";

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
  }
}