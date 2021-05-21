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
}
