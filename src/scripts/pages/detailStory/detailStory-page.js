import DetailStoryPresenter from "./detailStory-presenter";
import Database from "../../database";
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

  async onDetailStoryLoaded(story) {
    this.#story = story;
    const container = document.getElementById("story-detail-container");
    container.innerHTML = `
      <div class="card h-100 shadow-sm border-0 rounded-4">
        <img src="${story.photoUrl}" class="card-img-top rounded-top-4" alt="${story.name}">
        <div class="card-body">
          <h2 class="card-title text-info"><i class="fas fa-user"></i> ${story.name}</h2>
          <p class="card-text">${story.description}</p>
          <p class="card-text"><small class="text-muted"><i class="fas fa-calendar-alt"></i> ${new Date(
            story.createdAt
          ).toLocaleString()}</small></p>
          <p class="card-text"><small class="text-muted"><i class="fas fa-map-pin"></i> Lat: ${
            story.lat || "-"
          }, Lon: ${story.lon || "-"}</small></p>
          <div id="save-remove-btn" class="mt-3"></div>
        </div>
      </div>
    `;
    this.renderSaveOrRemoveButton();
  }

  async renderSaveOrRemoveButton() {
    const btnContainer = document.getElementById("save-remove-btn");
    const isSaved = await Database.getReportById(this.#story.id);
    if (isSaved) {
      btnContainer.innerHTML = `<button id="remove-btn" class="btn btn-danger">Hapus Story</button>`;
      document.getElementById("remove-btn").onclick = () =>
        this.#presenter.removeStory(this.#story.id);
    } else {
      btnContainer.innerHTML = `<button id="save-btn" class="btn btn-success">Simpan Story</button>`;
      document.getElementById("save-btn").onclick = () =>
        this.#presenter.saveStory(this.#story);
    }
  }

  saveStorySuccess(message) {
    this.renderSaveOrRemoveButton();
    alert(message);
  }

  removeStorySuccess(message) {
    this.renderSaveOrRemoveButton();
    alert(message);
  }

  onDetailStoryFailed(message) {
    const container = document.getElementById("story-detail-container");
    container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }
}
