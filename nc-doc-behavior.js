import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';
import moment from 'moment/src/moment.js';
import 'moment/src/locale/es.js';
import 'moment/src/locale/ca.js';
import {formatMoney} from 'accounting-js';

/* @polymerMixin */
let ncDocBehavior = (base) =>
  class extends base {
    constructor() {
      super();
    }

    static get properties() {
      return {
        language: {
          type: String,
          observer: '_languageChanged'
        }
      }
    }

    _validate(){
      let inputs = dom(this.root).querySelectorAll("paper-input,paper-textarea");
      let firstInvalid = false;
      let i;
      for (i = 0; i < inputs.length; i++) {
        inputs[i].validate();
      }
      for (i = 0; i < inputs.length; i++) {
        if (!firstInvalid && inputs[i].invalid===true) {
          inputs[i].focus();
          firstInvalid = true;
        }
      }
      return !firstInvalid;
    }

    _languageChanged(){
      if (typeof(moment)!="undefined") {
        moment.locale(this.language);
      }
    }

    _formatPrice(price) {
      let priceText = ""
      priceText = formatMoney(price, {symbol: "€", precision: 2, thousand: ".", decimal: ",", format: "%v %s"});
      return priceText;
    }

    _getLineActionClass(element){
      let className = '';
      let lineAction = element.action;

      switch (lineAction) {
        case '_addQty':
          className = 'green';
          break;
        case '_removeQty':
        case '_delete':
          className = 'red';
          break;
      }

      return className;
    }
  };
  export const MixinDoc = dedupingMixin(ncDocBehavior);
