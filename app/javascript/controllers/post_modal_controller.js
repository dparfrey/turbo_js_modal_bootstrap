import { Controller } from "stimulus";
import { Modal } from "bootstrap";
import { tempContainer } from "../src/mixins/tempContainer";
import { modals } from "../src/mixins/modals";

export default class extends Controller {
  static values = {
    newUrl: String,
    afterAddUrl: String,
    editDomId: String
  }

  initialize() {
    // console.log('Post modal controller initialize');
    this.modalHidden = this.modalHidden.bind(this);
    this.doFormSubmit = this.doFormSubmit.bind(this);
  }

  connect() {
    // console.log('Post modal controller connect');
    tempContainer(this);  // register mixin
    modals(this);
  }

  disconnect() {
    // console.log('disconnect');
    document.removeEventListener('hidden.bs.modal', this.modalHidden);
    document.removeEventListener('bouncerFormValid', this.doFormSubmit, false);
  }

  showFormModal(event) {
    // console.log('Show modal');
    event.preventDefault();

    let id = this.getId(event);
    this.setDomId(event);
    // this.editDomIdValue = this.getDomId(event);

    let url = (id === '0') ? this.newUrlValue : this.getLinkHref(event);

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
      })
      .then(html => {
        this.buildAndFillTempContainer(html);

        let m = document.querySelector('#the-modal');
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

  getId(event) {
    let link = event.target.closest('a');

    return link.dataset.id || '0';
  }

  getDomId(event) {
    let link = event.target.closest('a');

    return link.dataset.domid || '';
  }

  getLinkHref(event) {
    let link = event.target.closest('a');

    return link.getAttribute('href') || '';
  }

  setDomId(event) {
    this.editDomIdValue = this.getDomId(event);
  }

  doFormSubmit(event) {
    // The successfully validated form
    var form = event.target;

    let data = new FormData(form);
    fetch(form.action, {
      method: form.method,
      body: data
    })
      .then(response => response.text())
      .then(html => {
        if (this.editDomIdValue === '') {
          window.location.replace(this.afterAddUrlValue);
        } else {
          let div = document.querySelector(`#${this.editDomIdValue}`);
          if (div) {
            div.innerHTML = html;
            this.closeTheModal();
          }
          this.editDomIdValue = '';
        }
      })
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

  deleteConfirmed(event) {
    event.preventDefault();
    console.log('deleteConfirmed');

    let link = event.target.closest('a');
    if (!link) {
      console.log('deleteConfirmed: Link not found');
      this.closeTheModal();
      return;
    }

    fetch(link.dataset.url, {
      method: 'DELETE'
    })
      .then(response => response.text())
      .then(html => {
        let div = document.querySelector(`#${this.editDomIdValue}`);
        if (div) {
          div.remove();
          this.closeTheModal();
        }
        this.editDomIdValue = '';
      })
      .catch(function (error) {
        console.log('deleteConfirmed error: ', error.message);
      });
  }

  modalHidden() {
    // console.log('modalHidden');
    document.removeEventListener('hidden.bs.modal', this.modalHidden);
    this.clearTempContainer();
  }
}
