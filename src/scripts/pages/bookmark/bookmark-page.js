import Database from "../../database";
import BookmarkPresenter from "./bookmark-presenter";

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section class="container my-4">
        <h1 class="mb-4">Story Tersimpan</h1>
        <div id="bookmark-list" class="row g-4"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter(this);
    this.#presenter.loadBookmarks();
  }

  onBookmarksLoaded(stories) {
    const container = document.getElementById("bookmark-list");
    if (!stories.length) {
      container.innerHTML = `<div class="col-12"><div class="alert alert-info">Belum ada story yang disimpan.</div></div>`;
      return;
    }
    container.innerHTML = stories
      .map(
        (story) => `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <img src="${
            story.photoUrl
          }" class="card-img-top rounded-top-4" alt="${story.name}">
          <div class="card-body">
            <h5 class="card-title text-info"><i class="fas fa-user"></i> ${
              story.name
            }</h5>
            <p class="card-text">${story.description}</p>
            <p class="card-text"><small class="text-muted"><i class="fas fa-calendar-alt"></i> ${new Date(
              story.createdAt
            ).toLocaleString()}</small></p>
            <p class="card-text"><small class="text-muted"><i class="fas fa-map-pin"></i> Lat: ${
              story.lat || "-"
            }, Lon: ${story.lon || "-"}</small></p>
            <a href="#/story/${
              story.id
            }" class="btn btn-outline-info mt-2">Lihat Detail</a>
            <button class="btn btn-danger mt-2 delete-bookmark-btn" data-id="${
              story.id
            }"><i class="fas fa-trash"></i> Hapus</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Event listener tombol hapus
    container.querySelectorAll(".delete-bookmark-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        this.#presenter.removeBookmark(id);
      });
    });
  }

  onBookmarksFailed(message) {
    const container = document.getElementById("bookmark-list");
    container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }

  onRemoveBookmarkSuccess(message) {
    alert(message);
  }

  onRemoveBookmarkFailed(message) {
    alert(message);
  }
}
