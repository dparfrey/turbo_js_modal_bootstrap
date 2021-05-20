import { Controller } from "stimulus";
import getMetaValue from "../src/metaValue";
import { crudMixin } from "../src/mixins/crudMixin";

export default class extends Controller {
  static values = {
    newUrl: String,
    afterAddUrl: String,
  }

  initialize() {
    // console.log('Post modal controller initialize');
    this.doFormSubmit = this.doFormSubmit.bind(this);
  }

  connect() {
    // console.log('Post modal controller connect');
    crudMixin(this);  // register mixin
  }

  disconnect() {
    // console.log('disconnect');
    document.removeEventListener('bouncerFormValid', this.doFormSubmit, false);
  }

  showFormModal(event) {
    // console.log('Show modal');
    event.preventDefault();

    let id = this.getId(event);

    let url = (id === '0') ? this.newUrlValue : this.getLinkHref(event);

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
      })
      .then(html => {
        this.buildAndFillTempContainer(html);

        this.showTheModal();

        // document.addEventListener('hidden.bs.modal', this.modalHidden);
        document.addEventListener('bouncerFormValid', this.doFormSubmit, false);
      }).catch(function (error) {
        console.log('Error fetching form: ', error.message);
      });
  }


  doFormSubmit(event) {
    console.log('doFormSubmit');
    // The successfully validated form
    var form = event.target;

    let domid = form.dataset.domid || '';

    let data = new FormData(form);
    fetch(form.action, {
      method: form.method,
      body: data
    })
      .then(response => response.text())
      .then(html => {
        if (domid === '') {
          window.location.replace(this.afterAddUrlValue);
        } else {
          let div = document.querySelector(`#${domid}`);
          if (div) {
            div.innerHTML = html;
            this.closeTheModal();
          }
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
    console.log('deleteConfirmed!');

    let link = event.target.closest('a');
    if (!link) {
      console.log('deleteConfirmed: Link not found');
      this.closeTheModal();
      return;
    }

    let domid = link.dataset.domid;

    fetch(link.dataset.url, {
      method: 'DELETE',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        "X-CSRF-Token": getMetaValue("csrf-token")
      },
      credentials: 'same-origin'
    })
      .then(response => response.text())
      .then(html => {
        let div = document.querySelector(`#${domid}`);
        if (div) {
          console.log('div found');
          div.remove();
          this.closeTheModal();
        }
      })
      .catch(function (error) {
        console.log('deleteConfirmed error: ', error.message);
      });
  }
}
