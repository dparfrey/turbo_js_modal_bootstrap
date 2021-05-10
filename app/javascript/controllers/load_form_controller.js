import { Controller } from "stimulus";

export default class extends Controller {
  static values = {
    reload: Boolean
  }

  connect() {
    let event;

    if (this.reloadValue) {
      // console.log('loadFormController connect: reloading');
      event = new CustomEvent("loadForm:reload", { bubbles: true, cancelable: true });
    } else {
      // console.log('loadFormController connect: first time');
      event = new CustomEvent("loadForm:load", { bubbles: true, cancelable: true });
    }

    document.dispatchEvent(event);
  }
}
