import { openDB } from 'idb';

const DB_NAME = 'StoryApp';
const STORE_NAME = 'saved-Story';

function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

const Database = {
  async putReport(story) {
    return (await getDB()).put(STORE_NAME, story);
  },
  async getReportById(id) {
    return (await getDB()).get(STORE_NAME, id);
  },
  async deleteReport(id) {
    return (await getDB()).delete(STORE_NAME, id);
  },
  async getAllReports() {
    return (await getDB()).getAll(STORE_NAME);
  },
};

export default Database;