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

    _formatDate(date, language, format) {
      let lLanguage = (language) ? language : 'es';
      moment.locale(lLanguage);
      let lFormat = (format) ? format : "L";
      let dateText = "";
      if (date) {
        // Check "date" UTC
        if (date.substr(-1,1).toUpperCase() === "Z"){
          dateText = moment.utc(date).format(lFormat);
        } else {
          dateText = moment(date).format(lFormat);
        }
      }
      return dateText;
    }
    
    _formatTime(time, language) {
      let lLanguage = (language) ? language : 'es';
      moment.locale(lLanguage);
      let timeText = "";
      if (time) {
        // Check "time" UTC
        if (time.substr(-1,1).toUpperCase() === "Z"){
          timeText = moment.utc(time).format("HH:mm[h]");
        } else {
          timeText = moment(time).format("HH:mm[h]");
        }
      }
      return timeText;
    }

    _languageChanged(){
      if (typeof(moment)!="undefined") {
        moment.locale(this.language);
      }
    }

    _formatPrice(price) {
      let lPrice = (price) ? price : 0;
      let priceText = ""
      priceText = formatMoney(lPrice, {symbol: "€", precision: 2, thousand: ".", decimal: ",", format: "%v %s"});
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
