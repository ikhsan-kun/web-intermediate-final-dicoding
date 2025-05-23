import LoginPresenter from './login-presenter';
import * as StoryApi from '../../data/api';
import * as AuthModel from '../../utils/auth';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="d-flex align-items-center justify-content-center min-vh-100 bg-primary bg-gradient">
        <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%;">
          <div class="card-body">
            <h2 class="card-title text-center mb-4 text-primary fw-bold">Masuk Akun</h2>
            <form id="login-form">
              <div class="mb-3">
                <label for="email-input" class="form-label">Email</label>
                <input id="email-input" type="email" name="email" class="form-control" placeholder="Contoh: nama@email.com" required>
              </div>
              <div class="mb-3">
                <label for="password-input" class="form-label">Password</label>
                <input id="password-input" type="password" name="password" class="form-control" placeholder="Masukkan password Anda" required>
              </div>
              <div id="submit-button-container" class="d-grid mb-3">
                <button class="btn btn-primary fw-bold" type="submit">Masuk</button>
              </div>
              <p class="text-center mb-0">Belum punya akun? <a href="#/register" class="text-decoration-none text-primary fw-semibold">Daftar</a></p>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryApi,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };
      await this.#presenter.getLogin(data);
    });
  }

  loginSuccessfully(message) {
    console.log(message);

    location.hash = '/';
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Masuk
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Masuk</button>
    `;
  }
}
