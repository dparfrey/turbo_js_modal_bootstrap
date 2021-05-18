export const tempContainer = controller => {
  Object.assign(controller, {

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
