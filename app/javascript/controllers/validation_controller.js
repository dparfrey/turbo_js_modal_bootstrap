
import { Controller } from "stimulus"

export default class extends Controller {
  static values = {
    disableSubmit: Boolean
  }

  connect() {
    console.log(this.disableSubmitValue);
    let disableSubmit = (this.disableSubmitValue) ? this.disableSubmitValue : false;
    console.log('DisableSubmit=' + disableSubmit);

    let bouncer = new Bouncer('[data-validate]', {
      customValidations: {
        valueMismatch: function (field) {
          // Look for a selector for a field to compare
          // If there isn't one, return false (no error)
          var selector = field.getAttribute('data-bouncer-match');
          if (!selector) return false;

          // Get the field to compare
          var otherField = field.form.querySelector(selector);
          if (!otherField) return false;

          // Compare the two field values
          // We use a negative comparison here because if they do match, the field validates
          // We want to return true for failures, which can be confusing
          return otherField.value !== field.value;

        }
      },
      messages: {
        valueMismatch: function (field) {
          var customMessage = field.getAttribute('data-bouncer-mismatch-message');
          return customMessage ? customMessage : 'Please make sure the fields match.'
        }
      },
      disableSubmit: disableSubmit // If true, native form submission is suppressed even when form validates
    });
  }
}
