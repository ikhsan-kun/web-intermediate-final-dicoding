import { getStories } from "../../data/api";
import { getAccessToken } from "../../utils/auth";

export default class HomePresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async loadStories() {
    try {
      const token = getAccessToken();
      const response = await getStories({ token, location: 1 });
      const stories = response.listStory || [];
      this.#view.onStoriesLoaded(stories);
    } catch (err) {
      this.#view.onStoriesFailed("Gagal memuat cerita.");
    }
  }
}