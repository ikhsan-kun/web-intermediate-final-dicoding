import RegisterPresenter from './register-presenter';
import * as StoryApi from '../../data/api';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="d-flex align-items-center justify-content-center min-vh-100 bg-success bg-gradient">
        <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%;">
          <div class="card-body">
            <h2 class="card-title text-center mb-4 text-success fw-bold">Daftar Akun</h2>
            <form id="register-form">
              <div class="mb-3">
                <label for="name-input" class="form-label">Nama Lengkap</label>
                <input id="name-input" type="text" name="name" class="form-control" placeholder="Masukkan nama lengkap Anda" required>
              </div>
              <div class="mb-3">
                <label for="email-input" class="form-label">Email</label>
                <input id="email-input" type="email" name="email" class="form-control" placeholder="Contoh: nama@email.com" required>
              </div>
              <div class="mb-3">
                <label for="password-input" class="form-label">Password</label>
                <input id="password-input" type="password" name="password" class="form-control" placeholder="Masukkan password baru" required>
              </div>
              <div id="submit-button-container" class="d-grid mb-3">
                <button class="btn btn-success fw-bold" type="submit">Daftar Akun</button>
              </div>
              <p class="text-center mb-0">Sudah punya akun? <a href="#/login" class="text-decoration-none text-success fw-semibold">Masuk</a></p>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryApi,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('register-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };
      await this.#presenter.getRegistered(data);
    });
  }

  registeredSuccessfully(message) {
    console.log(message);

    location.hash = '/login';
  }

  registeredFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Daftar akun
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Daftar akun</button>
    `;
  }
}
