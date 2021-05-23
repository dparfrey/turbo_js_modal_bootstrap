// This is a replacement for the built-in Rails ujs confirmation method when using Bootstrap.
// Trying to hook into the built-in stuff is a pain, and changes with every Rails (now Hotwire)
// version.

// This has been embedded into the crud controller, but left "just in case".
import { Controller } from "stimulus";
import { Modal } from "bootstrap";
import { crudMixin } from "../src/mixins/crudMixin";

export default class extends Controller {
  static values = {
    title: String,
    message: String,
    okButton: String,
    cancelButton: String,
    url: String,
    method: String,
    doAction: String
  }

  connect() {
    // console.log('Confirm controller connect');
    crudMixin(this);  // register mixin
  }

  confirm(event) {
    event.preventDefault();

    let title = this.titleValue;
    let msg = this.messageValue;
    let ok = this.okButtonValue || 'OK';
    let cancel = this.cancelButtonValue || 'Cancel';
    let url = this.urlValue;
    let method = this.methodValue || 'get';
    let dMethod = method === 'get' ? '' : " data-method=\"" + method + "\"";

    let confirmButton;

    if (this.doActionValue) {
      confirmButton = `
        <a href="${url}" ${dMethod} class="btn btn-primary"
          data-action="${this.doActionValue}"
          data-url="${url}"
          id="confirmModalConfirmButton">${ok}</a>
      `;
    } else {
      confirmButton = `
        <a href="${url}" ${dMethod} class="btn btn-primary"
          data-bs-dismiss="modal"
          id="confirmModalConfirmButton">${ok}</a>
      `;
    }

    let html = `
      <div class="modal fade" id="the-modal" tabindex="-1" role="dialog" aria-labelledby="ariaConfirmModal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmModalTitle">${title}</h5>
              <button type="button" class="btn-close" data-action="confirm#closeTheModal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${msg}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-link" data-action="confirm#closeTheModal">${cancel}</button>
              ${confirmButton}
            </div>
          </div>
        </div>
      </div >
      `;

    this.buildAndFillTempContainer(html);

    this.showTheModal();
  }

}
