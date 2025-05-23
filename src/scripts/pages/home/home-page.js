import HomePresenter from "./home-presenter";

export default class HomePage {
  #stories = [];
  #presenter = null;

  async render() {
    // Sertakan container untuk daftar dan peta
    return `
      <section class="container my-4">
        <div class="my-4">
          <h2>Peta Lokasi Cerita</h2>
          <div id="map" style="height: 400px;"></div>
        </div>
        <h1 class="mb-4">Daftar Cerita</h1>
        <div id="stories-list" class="row g-4"></div>
        
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter(this);
    this.#presenter.loadStories();
  }

  onStoriesLoaded(stories) {
    this.#stories = stories;
    
    // Render daftar stories
    const storiesList = document.getElementById("stories-list");
    storiesList.innerHTML = this.#stories
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
          </div>
        </div>
      </div>
    `
      )
      .join("");

    this.#renderMap();
  }

  onStoriesFailed(message) {
    alert(message);
  }

  #renderMap() {
    // Pastikan leaflet sudah di-load di index.html atau import di sini jika menggunakan npm
    if (!window.L) {
      alert("Leaflet.js belum dimuat. Tambahkan CDN Leaflet di index.html!");
      return;
    }

    // Tentukan posisi awal peta
    const defaultLat = this.#stories[0]?.lat || -6.2;
    const defaultLon = this.#stories[0]?.lon || 106.816666;

    const map = L.map("map").setView([defaultLat, defaultLon], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    this.#stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`
          <strong>${story.name}</strong><br>
          ${story.description}<br>
          <img src="${story.photoUrl}" alt="${story.name}" style="width:100px;">
        `);
      }
    });
  }
}
<<<<<<< HEAD
=======


>>>>>>> 226b58d (final)
