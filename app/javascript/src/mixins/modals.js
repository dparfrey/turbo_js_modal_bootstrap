import { Modal } from "bootstrap";

export const modals = controller => {
  Object.assign(controller, {

    closeTheModal() {
      let m = document.querySelector('#the-modal');
      if (m) {
        // console.log('close_modal hiding');
        var modal = Modal.getInstance(m); // Returns a Bootstrap modal instance

        if (modal) {
          // console.log('hiding modal');
          modal.hide();
        }
      }
    }
  });
};
