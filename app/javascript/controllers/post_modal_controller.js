import { Controller } from "stimulus";
import { Modal } from "bootstrap";

export default class extends Controller {
  static values = {
    newUrl: String,
    afterAddUrl: String
  }

  initialize() {
    console.log('Post modal controller initialize');
    this.modalHidden = this.modalHidden.bind(this);
    this.doFormSubmit = this.doFormSubmit.bind(this);
  }

  connect() {
    console.log('Post modal controller connect');
  }

  disconnect() {
    console.log('disconnect');
    document.removeEventListener('hidden.bs.modal', this.modalHidden);
    document.removeEventListener('bouncerFormValid', this.doFormSubmit, false);
  }

  showFormModal(event) {
    console.log('Show modal');
    event.preventDefault();

    var link = event.target.closest('a');
    console.log(link.dataset.id);

    fetch(this.newUrlValue)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
      })
      .then(html => {
        var tempDiv = document.createElement('div');
        tempDiv.id = 'temp-html';
        tempDiv.innerHTML = html;
        document.body.append(tempDiv);

        let m = document.querySelector('#post-modal');
        if (m) {
          let modal = new Modal(m);
          modal.show();
        }

        document.addEventListener('hidden.bs.modal', this.modalHidden);
        document.addEventListener('bouncerFormValid', this.doFormSubmit, false);
      }).catch(function (error) {
        console.log('Error fetching form: ', error.message);
      });
  }

  doFormSubmit(event) {
    // The successfully validated form
    var form = event.target;

    // console.log(form.action);
    // console.log(form.method);
    // console.log(event.target);
    // console.log(this.newUrlValue);

    let data = new FormData(form);
    fetch(form.action, {
      method: form.method,
      body: data
    })
    .then(response => response.text())
    .then(html => window.location.replace(this.afterAddUrlValue))
    .catch(function (error) {
      console.log('doFormSubmit error: ', error.message);
    });

    document.removeEventListener('bouncerFormValid', this.doFormSubmit, false);
  }

  setFocus() {
    // console.log('setFocus');
    let fld = document.querySelector('#post_title');
    if (fld) { fld.focus(); }
  }

  modalHidden() {
    console.log('modalHidden');
    document.removeEventListener('hidden.bs.modal', this.modalHidden);

    let tempDiv = document.querySelector('#temp-html');
    tempDiv.remove();
  }
}
