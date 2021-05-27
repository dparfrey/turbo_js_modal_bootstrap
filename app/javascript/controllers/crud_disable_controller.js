import { Controller } from "stimulus";
import { crudMixin } from "../src/mixins/crudMixin";

export default class extends Controller {
  connect() {
    crudMixin(this);  // register mixin
    this.bindFunctions();
  }

  disconnect() {
    this.removeListeners();
  }

  tempContainerId() {
    return 'temp-container-disable';
  }

  // Redraw disabled row (used destroy action to set disabled flag)
  afterDelete(event, domid, html) {
    let div = document.querySelector(`#${domid}`);
    if (div) {
      div.innerHTML = html;
      this.closeTheModal();
    }
  }
}
