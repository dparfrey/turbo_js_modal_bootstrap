import { Controller } from "stimulus";
import { Modal } from "bootstrap";

export default class extends Controller {
  static values = { selector: String }

  connect() {
    // console.log('close_modal connect');

    let m = document.querySelector(this.selectorValue);
    if (m) {
      // console.log('close_modal hiding');
      var modal = Modal.getInstance(m); // Returns a Bootstrap modal instance

      if (modal) {
        // console.log('hiding modal');
        modal.hide();
      }
    }
  }
}
