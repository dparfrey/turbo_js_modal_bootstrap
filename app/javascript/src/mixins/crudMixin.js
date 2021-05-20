import { Modal } from "bootstrap";

export const crudMixin = controller => {
  Object.assign(controller, {

    showTheModal() {
      let m = document.querySelector('#the-modal');
      if (m) {
        let modal = new Modal(m, { keyboard: false, backdrop: 'static' });
        modal.show();
      }
    },

    closeTheModal() {
      console.log('closeTheModal');
      let m = document.querySelector('#the-modal');
      if (m) {
        // console.log('close_modal hiding');
        var modal = Modal.getInstance(m); // Returns a Bootstrap modal instance

        if (modal) {
          // console.log('hiding modal');
          modal.hide();

          this.clearTempContainer();
        }
      }
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
      let tempDiv = document.querySelector('#temp-container');
      if (!tempDiv) {
        tempDiv = document.createElement('div');
        tempDiv.id = 'temp-container';
        document.body.append(tempDiv);
      }

      return tempDiv;
    },

    clearTempContainer() {
      let tempDiv = document.querySelector('#temp-container');
      if (tempDiv) {
        tempDiv.innerHTML = '';
      }

      return tempDiv;
    },

    deleteTempContainer() {
      let tempDiv = document.querySelector('#temp-container');
      if (tempDiv) {
        tempDiv.remove();
      }
    }

  });
};
