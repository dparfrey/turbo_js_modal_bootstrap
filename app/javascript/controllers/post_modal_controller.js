import { Controller } from "stimulus";
import { Modal } from "bootstrap";

export default class extends Controller {
  connect() {
    // console.log('Post modal controller connect');

    // show modal after form loaded
    document.addEventListener("loadForm:load", () => {
      // console.log('Form loaded!');

      let m = document.querySelector('#post-modal');
      if (m) {
        this.modal = new Modal(m);
        this.modal.show();
      }

      m.addEventListener('shown.bs.modal', function (event) {
        let fld = document.querySelector('#post_title');
        if (fld) { fld.focus(); }
      });

      m.addEventListener('hidden.bs.modal', function (event) {
        console.log('removing...');

        // ----- Bug in turbo? https://github.com/hotwired/turbo/issues/249
        let b = document.querySelector('#contact');
        b.src = "";
        // -----
      });
    });
  }
}
