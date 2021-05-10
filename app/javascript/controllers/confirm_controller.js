// This is a replacement for the built-in Rails ujs confirmation method when using Bootstrap.
// Trying to hook into the built-in stuff is a pain, and changes with every Rails (now Hotwire)
// version.
import { Controller } from "stimulus";
import { Modal } from "bootstrap";

export default class extends Controller {
  static values = {
    title: String,
    message: String,
    okButton: String,
    cancelButton: String,
    url: String,
    method: String,
    frame: String
  }

  connect() {
    // console.log('Confirm controller connect');
  }

  click(event) {
    event.preventDefault();

    let title = this.titleValue;
    let msg = this.messageValue;
    let ok = this.okButtonValue;
    if (!ok) { ok = 'OK'; }
    let cancel = this.cancelButtonValue;
    if (!cancel) { cancel = 'Cancel'; }
    let url = this.urlValue;
    let method = this.methodValue;
    if (!method) { method = 'get'; }
    let frame = this.frameValue
    if (frame) {
      frame = `data-turbo-frame="${frame}"`;
    }

    let dMethod = method === 'get' ? '' : " data-method=\"" + method + "\"";

    let html = `
      <div class="modal fade" id="confirmDialog" tabindex="-1" role="dialog" aria-labelledby="ariaConfirmModal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmModalTitle">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${msg}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-link" id="confirmModalCancelButton" data-bs-dismiss="modal">${cancel}</button>
              <a href="${url}" ${dMethod} class="btn btn-primary"
                ${frame} data-bs-dismiss="modal"
                id="confirmModalConfirmButton">${ok}</a>
            </div>
          </div>
        </div>
      </div >
      `;


    var tempDiv = document.createElement('div');
    tempDiv.id = 'temp-html';
    tempDiv.innerHTML = html;
    document.body.append(tempDiv);

    let m = document.querySelector('#confirmDialog');
    var confirmModal = new Modal(m);
    confirmModal.show();

    m.addEventListener('hidden.bs.modal', function (event) {
      console.log('removing...');
      tempDiv.remove();
    })
  }

}
