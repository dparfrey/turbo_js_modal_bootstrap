import { Modal } from "bootstrap";
import getMetaValue from "../../src/metaValue";

export const crudMixin = controller => {
  Object.assign(controller, {

    bindFunctions() {
      this.doFormSubmit = this.doFormSubmit.bind(this);
      this.modalHidden = this.modalHidden.bind(this);
      this.setFocus = this.setFocus.bind(this);
    },

    addListeners() {
      document.addEventListener('hidden.bs.modal', this.modalHidden);
      document.addEventListener('bouncerFormValid', this.doFormSubmit, false);
      document.addEventListener('shown.bs.modal', this.setFocus);
    },

    removeListeners() {
      document.removeEventListener('hidden.bs.modal', this.modalHidden);
      document.removeEventListener('bouncerFormValid', this.doFormSubmit, false);
      document.removeEventListener('shown.bs.modal', this.setFocus);
    },

    showFormModal(event) {
      console.log('showFormModal');
      event.preventDefault();

      let id = this.getId(event);
      let url = this.getLinkHref(event);

      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.text();
          }
        })
        .then(html => {
          this.buildAndFillTempContainer(html);
          this.showTheModal();

          this.addListeners();

          if (typeof this.afterShowFormModal == 'function') {
            this.afterShowFormModal(event);
          }
        }).catch(function (error) {
          console.log('Error fetching form: ', error.message);
        });
    },

    setFocus() {
      // console.log('setFocus');
      let fld = document.querySelector("input.autofocus");
      if (fld) { fld.focus(); } else { console.log('no autofocus found'); }
    },

    doFormSubmit(event) {
      // console.log('doFormSubmit');

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
          if (typeof this.afterFormModalResults == 'function') {
            this.afterFormModalResults(event, html);
          } else {
            if (domid === '') {
              window.location.replace(form.dataset.backUrl);
            } else {
              let div = document.querySelector(`#${domid}`);
              if (div) {
                div.innerHTML = html;
                this.closeTheModal();
              }
            }
          }
        })
        .catch(function (error) {
          console.log('doFormSubmit error: ', error.message);
        });

      document.removeEventListener('bouncerFormValid', this.doFormSubmit, false);
    },

    deleteConfirmed(event) {
      event.preventDefault();
      // console.log('deleteConfirmed!');

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
          if (typeof this.afterDelete == 'function') {
            this.afterDelete(event, domid, html);
          } else {
            let div = document.querySelector(`#${domid}`);
            if (div) {
              // console.log('div found');
              this.closeTheModal();
              div.classList.add('delete-animation');
              setTimeout(() => {
                div.remove();
              }, 1000);
            }
          }
        })
        .catch(function (error) {
          console.log('deleteConfirmed error: ', error.message);
        });
    },

    showTheModal() {
      let m = document.querySelector('#the-modal');
      if (m) {
        let modal = new Modal(m, { keyboard: false, backdrop: 'static' });
        modal.show();
      }
    },

    closeTheModal() {
      // console.log('closeTheModal');
      let m = document.querySelector('#the-modal');
      if (m) {
        // console.log('close_modal hiding');
        var modal = Modal.getInstance(m); // Returns a Bootstrap modal instance

        if (modal) {
          // console.log('hiding modal');
          modal.hide();
          this.removeListeners();
          this.clearTempContainer();
        }
      }
    },

    modalHidden() {
      // console.log('modalHidden');
      this.removeListeners();

      this.clearTempContainer();
    },

    // get id, dom_id from data-id and data-domid in links. Not using
    // Stimulus values because they're in each item in the list.
    getId(event) {
      let link = event.target.closest('a');

      return link.dataset.id || '0';
    },

    getDomId(event) {
      let link = event.target.closest('a');

      return link.dataset.domid || '';
    },

    // get href from link
    getLinkHref(event) {
      let link = event.target.closest('a');

      return link.getAttribute('href') || '';
    },

    confirm(event) {
      event.preventDefault();

      let link = event.target.closest('a');
      if (!link) { console.log('confirm: link not found.'); return; }

      let title = link.dataset.title || '';
      let msg = link.dataset.message || '';
      let ok = link.dataset.okButton || 'OK';
      let cancel = link.dataset.cancelButton || 'Cancel';
      let url = link.dataset.url;
      let domid = link.dataset.domid || '0';
      let method = link.dataset.method || 'get';
      let dMethod = method === 'get' ? '' : " data-method=\"" + method + "\"";

      let confirmButton;

      if (link.dataset.doAction) {
        confirmButton = `
        <a href="${url}" ${dMethod} class="btn btn-primary"
          data-action="${link.dataset.doAction}"
          data-url="${url}"
          data-domid="${domid}"
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
              <button type="button" class="btn-close" data-action="${link.dataset.cancelAction}" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${msg}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-link" data-action="${link.dataset.cancelAction}">${cancel}</button>
              ${confirmButton}
            </div>
          </div>
        </div>
      </div >
      `;

      this.buildAndFillTempContainer(html);

      this.showTheModal();
    },


    // temp container functions

    // This lets the using controller override the temp container id
    getTempContainerId() {
      if (typeof this.tempContainerId == 'function') {
        return this.tempContainerId();
      } else {
        return "temp-container";
      }
    },


    buildAndFillTempContainer(html) {
      let tempDiv = this.buildTempContainer();
      if (tempDiv) {
        if (html) {
          tempDiv.innerHTML = html;
        }
      }

      return tempDiv;
    },

    buildTempContainer() {
      let id = this.getTempContainerId();
      let sel = `#${id}`;

      let tempDiv = document.querySelector(sel);
      if (!tempDiv) {
        tempDiv = document.createElement('div');
        tempDiv.id = id;
        document.body.append(tempDiv);
      }

      return tempDiv;
    },

    clearTempContainer() {
      let sel = `#${this.getTempContainerId()}`;
      let tempDiv = document.querySelector(sel);
      if (tempDiv) {
        tempDiv.innerHTML = '';
      }

      return tempDiv;
    },

    deleteTempContainer() {
      let sel = `#${this.getTempContainerId()}`;
      let tempDiv = document.querySelector(sel);
      if (tempDiv) {
        tempDiv.remove();
      }
    }
  });
};
