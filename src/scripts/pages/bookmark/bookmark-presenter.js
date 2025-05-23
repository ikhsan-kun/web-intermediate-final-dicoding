import Database from "../../database";

export default class BookmarkPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async loadBookmarks() {
    try {
      // Ambil semua story tersimpan dari IndexedDB
      const dbInstance = await import("idb").then(({ openDB }) =>
        openDB("StoryApp", 1)
      );
      const stories = await dbInstance.getAll("saved-Story");
      // const stories = await Database.getAllReports();
      this.#view.onBookmarksLoaded(stories);
    } catch (err) {
      this.#view.onBookmarksFailed("Gagal memuat story tersimpan.");
    }
  }

  async removeBookmark(id) {
    try {
      await Database.deleteReport(id);
      this.#view.onRemoveBookmarkSuccess(
        "Story berhasil dihapus dari daftar tersimpan!"
      );
      this.loadBookmarks(); // refresh list
    } catch (err) {
      this.#view.onRemoveBookmarkFailed(
        "Gagal menghapus story: " + err.message
      );
    }
  }
}