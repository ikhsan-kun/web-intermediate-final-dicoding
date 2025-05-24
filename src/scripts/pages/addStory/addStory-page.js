import AddStoryPresenter from "./addStory-presenter";

export default class AddStoryPage {
  #lat = null;
  #lon = null;
  #stream = null;
  #presenter = null;

  async render() {
    return `
      <section class="container my-4">
        <h1 class="mb-4">Tambah Cerita Baru</h1>
        <form id="add-story-form" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="story-desc" class="form-label">Deskripsi</label>
            <textarea class="form-control" id="story-desc" name="description" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Ambil Gambar (Kamera)</label>
            <div>
              <video id="camera-stream" width="320" height="240" autoplay class="mb-2 border"></video>
              <canvas id="snapshot-canvas" width="320" height="240" style="display:none;"></canvas>
              <br>
              <button type="button" class="btn btn-primary mb-2" id="take-photo-btn">Ambil Foto</button>
            </div>
            <input type="file" id="photo-input" name="photo" accept="image/*" class="form-control" style="display:none;">
            <img id="preview-img" src="" alt="Preview" class="img-fluid mb-2" style="display:none;max-width:100%;">
          </div>
          <div class="mb-3">
            <label class="form-label">Pilih Lokasi pada Peta</label>
            <div id="add-map" style="height: 300px;"></div>
            <input type="hidden" id="lat-input" name="lat">
            <input type="hidden" id="lon-input" name="lon">
            <div class="form-text">Klik pada peta untuk memilih lokasi.</div>
          </div>
          <button type="submit" class="btn btn-success">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddStoryPresenter(this);
    this.#setupCamera();
    this.#setupMap();
    this.#setupForm();
  }

  #setupCamera() {
    const video = document.getElementById("camera-stream");
    const canvas = document.getElementById("snapshot-canvas");
    const takePhotoBtn = document.getElementById("take-photo-btn");
    const photoInput = document.getElementById("photo-input");
    const previewImg = document.getElementById("preview-img");

    // Start camera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.#stream = stream;
        video.srcObject = stream;
      })
      .catch(() => {
        takePhotoBtn.disabled = true;
        alert("Tidak dapat mengakses kamera.");
      });

    // Ambil foto dari stream
    takePhotoBtn.addEventListener("click", () => {
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        // Simpan blob ke input file
        const file = new File([blob], "photo.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;

        // Preview
        previewImg.src = URL.createObjectURL(blob);
        previewImg.style.display = "block";
      }, "image/png");
    });

    // Matikan kamera saat pindah halaman
    window.addEventListener("hashchange", () => {
      if (this.#stream) {
        this.#stream.getTracks().forEach((track) => track.stop());
      }
    });
  }

  #setupMap() {
    if (!window.L) {
      alert("Leaflet.js belum dimuat.");
      return;
    }
    const map = L.map("add-map").setView([-6.2, 106.816666], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    let marker = null;
    map.on("click", (e) => {
      this.#lat = e.latlng.lat;
      this.#lon = e.latlng.lng;
      document.getElementById("lat-input").value = this.#lat;
      document.getElementById("lon-input").value = this.#lon;

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
      marker.bindPopup(`Lat: ${this.#lat}<br>Lon: ${this.#lon}`).openPopup();
    });
  }

  #setupForm() {
    document
      .getElementById("add-story-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        if (
          !formData.get("photo") ||
          !formData.get("lat") ||
          !formData.get("lon")
        ) {
          alert("Foto dan lokasi wajib diisi!");
          return;
        }

        // Panggil presenter, bukan langsung Model/API
        this.#presenter.submitStory(formData);
      });
  }

  // Callback untuk presenter
  onAddStorySuccess(message) {
    alert(message);
    location.hash = "/";
  }

  onAddStoryFailed(message) {
    alert(message);
  }
}
