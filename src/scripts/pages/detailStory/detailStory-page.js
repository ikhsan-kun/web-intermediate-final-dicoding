import DetailStoryPresenter from "./detailStory-presenter";
import { parseActivePathname } from "../../routes/url-parser";

export default class StoryDetailPage {
  #presenter = null;
  #story = null;

  async render() {
    return `
      <section class="container my-4">
        <div id="story-detail-container" class="my-4">
          <div class="text-center"><span>Loading...</span></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new DetailStoryPresenter(this);
    const { id } = parseActivePathname();
    this.#presenter.loadDetailStory(id);
  }

  onDetailStoryLoaded(story) {
    this.#story = story;
    this.renderSaveOrRemoveButton();
  }

  renderSaveOrRemoveButton() {
    const story = this.#story;
    const container = document.getElementById("story-detail-container");
    container.innerHTML = `
      <div class="card shadow-sm">
        <img src="${story.photoUrl}" class="card-img-top" alt="${story.name}">
        <div class="card-body">
          <h3 class="card-title">${story.name}</h3>
          <p class="card-text">${story.description}</p>
          <p class="card-text"><small class="text-muted">${new Date(
            story.createdAt
          ).toLocaleString()}</small></p>
          <p class="card-text"><small class="text-muted">Lat: ${
            story.lat || "-"
          }, Lon: ${story.lon || "-"}</small></p>
          <div id="save-remove-btn-container"></div>
        </div>
      </div>
    `;
    this.#presenter.showSaveButton();
  }

  renderSaveButton() {
    const btnContainer = document.getElementById("save-remove-btn-container");
    btnContainer.innerHTML = `<button id="save-story-btn" class="btn btn-success mt-3"><i class="fas fa-save"></i> Simpan Story</button>`;
    document.getElementById("save-story-btn").addEventListener("click", () => {
      this.#presenter.saveStory(this.#story);
    });
  }

  renderRemoveButton() {
    const btnContainer = document.getElementById("save-remove-btn-container");
    btnContainer.innerHTML = `<button id="remove-story-btn" class="btn btn-danger mt-3"><i class="fas fa-trash"></i> Hapus Story</button>`;
    document
      .getElementById("remove-story-btn")
      .addEventListener("click", () => {
        this.#presenter.removeStory(this.#story.id);
      });
  }

  saveStorySuccess(message) {
    alert(message);
    this.renderSaveOrRemoveButton();
  }

  saveStoryFailed(message) {
    alert(message);
  }

  removeStorySuccess(message) {
    alert(message);
    this.renderSaveOrRemoveButton();
  }

  removeStoryFailed(message) {
    alert(message);
  }

  onDetailStoryFailed(message) {
    const container = document.getElementById("story-detail-container");
    container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }
}
