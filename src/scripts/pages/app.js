import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { isServiceWorkerAvailable } from "../utils";
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from "../utils/notif";

class App {
  #content = null;

  constructor({ content }) {
    this.#content = content;
  }
   async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    if (isSubscribed) {
      pushNotificationTools.innerHTML = `<button id="unsubscribe-button" class="btn unsubscribe-button">Unsubscribe <i class="fas fa-bell-slash"></i></button>`;
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });
      return;
    }
 
    pushNotificationTools.innerHTML = `<button id="subscribe-button" class="btn subscribe-button">Subscribe <i class="fas fa-bell"></i></button>`;
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const pageFactory = routes[url];
    const page = pageFactory ? pageFactory() : null;

    if (isServiceWorkerAvailable()) {
      this.#setupPushNotification();
    }
    if (!page) {
      // Transisi untuk 404
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          this.#content.innerHTML =
            '<h1 class="text-center mt-5">404 - Page Not Found</h1>';
        });
      } else {
        this.#content.innerHTML =
          '<h1 class="text-center mt-5">404 - Page Not Found</h1>';
      }
      return;
    }

    // Transisi untuk halaman lain
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }

    // Sembunyikan header di halaman login dan register
    const header = document.querySelector("header");
    if (url === "/login" || url === "/register") {
      header.style.display = "none";
    } else {
      header.style.display = "";
    }
  }
}

export default App;
