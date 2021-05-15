import { Controller } from "stimulus";
import { Modal } from "bootstrap";

export default class extends Controller {
  initialize() {
  }

  connect() {
    // console.log('Post modal controller connect');

    // show modal after form loaded
    document.addEventListener("loadForm:load", this.showFormModal);
    document.addEventListener('shown.bs.modal', this.setFocus);
    document.addEventListener('hidden.bs.modal', this.modalHidden);

    // document.addEventListener("loadForm:reload", () => {
    //   console.log('Form reloaded!');
    // });
  }

  disconnect() {
    // console.log('disconnect');

    document.removeEventListener('loadForm:load', this.showFormModal);
    document.removeEventListener('shown.bs.modal', this.setFocus);
    document.removeEventListener('hidden.bs.modal', this.modalHidden);
  }

  showFormModal() {
    // console.log('Form loaded!');

    let m = document.querySelector('#post-modal');
    if (m) {
      let modal = new Modal(m);
      modal.show();
    }
  }

  setFocus() {
    // console.log('setFocus');
    let fld = document.querySelector('#post_title');
    if (fld) { fld.focus(); }
  }

  modalHidden() {
    // console.log('modalHidden');

    // ----- Bug in turbo? https://github.com/hotwired/turbo/issues/249
    let b = document.querySelector('#post');
    if (b) {
      b.src = "";
    }
    // -----

    // remove the form to avoid getting retriggered
    let d = document.querySelector('#post-modal-content');
    if (d) {
      d.innerHTML = '<div id="post-modal-form"></div>';
    }
  }
}
