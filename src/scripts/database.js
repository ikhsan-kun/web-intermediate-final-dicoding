import { openDB } from "idb";

const DATABASE_NAME = "StoryApp";
const DATABASE_VERSION = 2; // Increment this version to trigger an upgrade
const OBJECT_STORE_NAME = "saved-Story";
const PENDING_STORE_NAME = "pending-story";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database, oldVersion) => {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
    }
    if (!database.objectStoreNames.contains(PENDING_STORE_NAME)) {
      database.createObjectStore(PENDING_STORE_NAME, { autoIncrement: true });
    }
  },
});

const Database = {
  async putReport(report) {
    if (!Object.hasOwn(report, "id")) {
      throw new Error("`id` is required to save.");
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, report);
  },
  async getReportById(id) {
    if (!id) {
      throw new Error("`id` is required.");
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async deleteReport(id) {
    if (!id) {
      throw new Error("`id` is required.");
    }
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
  async getAllReports() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async savePendingStory(formDataObj) {
    return (await dbPromise).add(PENDING_STORE_NAME, formDataObj);
  },
  async getAllPendingStories() {
    return (await dbPromise).getAll(PENDING_STORE_NAME);
  },
  async deletePendingStory(key) {
    return (await dbPromise).delete(PENDING_STORE_NAME, key);
  },
};
export default Database;
