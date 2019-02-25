import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { MixinDoc } from './nc-doc-behavior.js';

class NcDocFooter extends mixinBehaviors([AppLocalizeBehavior], MixinDoc(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host{
          display: block;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
        }
        
        paper-card{
          width: 100%;
          margin: 10px 0 0 0;
          padding: 5px;
          background-color: #FFA726;
        }

        .line{
          @apply --layout-horizontal;
        }

        .label{
        }

        .value{
          @apply --layout-flex;
          text-align: right;
        }

        .fiscal {
          @apply --layout-vertical;
          @apply --layout-center;
        }

        .total-amount{
          font-size: var(--nc-doc-footer-total-font-size);
          font-weight: bolder;
        }

        paper-dialog{
          width: 300px;
          background-color: #262b65;
          color: white;
          @apply --layout-vertical;
          @apply --layout-center;
        }

        .message{
          font-size: 1.8em;
        }
      </style>

      <paper-card>
        <div class="footer">
          <template is="dom-repeat" items="{{data.discounts}}">
            <div class="line">
              <div class="label">[[item.name]]</div>
              <div class="value">-[[_formatPrice(item.discountAmount)]]</div>
            </div>
          </template>
          <div class="line">
            <div class="label total-amount">{{localize('DOC_FOOTER_TOTAL_AMOUNT')}}</div>
            <div class="value total-amount">[[_formatPrice(totalAmount)]]</div>
          </div>
          <template is="dom-if" if="{{showChange}}">
            <div class="line">
              <div class="label">{{localize('DOC_FOOTER_DELIVERED_AMOUNT')}}</div>
              <div class="value">[[_formatPrice(totalDeliveredAmount)]]</div>
            </div>
            <div class="line">
              <div class="label">{{localize('DOC_FOOTER_CHANGED_AMOUNT')}}</div>
              <div class="value">[[_formatPrice(totalChangeAmount)]]</div>
            </div>
          </template>
        </div>
      </paper-card>

      <paper-dialog id="showChangeDialog">
        <div class="content">
          <p class="message">[[messageDialog]]</p>
        </div>
      </paper-dialog>
    `;
  }

  static get properties() {
    return {
      language: String,
      data: {
        type: Object,
        value: {},
        observer: '_dataChanged'
      },
      totalAmount: {
        type: Number,
        value: 0
      },
      totalChangeAmount: {
        type: Number,
        value: 0
      },
      totalDeliveredAmount: {
        type: Number,
        value: 0
      },
      discount: {
        type: Number,
        value: 0
      },
      showChangeInDialog: Boolean,
      showChange: {
        type: Object,
        value: false
      },
      messageDialog: {
        type: String,
        value: ''
      }
    }
  }

  static get importMeta() { 
    return import.meta; 
  }

  connectedCallback() {
    super.connectedCallback();
    this.useKeyIfMissing = true;

    this.loadResources(this.resolveUrl('./static/translations.json'));
  }

  _dataChanged() {
    if (!this.data) return;
    if (this.data.fiscal) {
      this.totalAmount = this.data.fiscal.totals.totalAmount; 

      this.totalDeliveredAmount = (this.data.fiscal.totals.deliveredAmount) ? this.data.fiscal.totals.deliveredAmount : 0; 
      this.totalChangeAmount = (this.data.fiscal.totals.changeAmount) ? this.data.fiscal.totals.changeAmount : 0; 

      if (this.totalDeliveredAmount != 0){
        this.showChange = true;
        if (this.showChangeInDialog){
          this.messageDialog = (this.totalChangeAmount === 0) ? this.localize('DOC_FOOTER_WITHOUT_CHANGED_AMOUNT') : this.localize('DOC_FOOTER_CHANGED_AMOUNT') + ': ' + this._formatPrice(this.totalChangeAmount);
          this.$.showChangeDialog.open();
        }
        
      } else {
        this.showChange = false;
        this.messageDialog = '';
        this.$.showChangeDialog.close();
      }
      
    }
  }
}
window.customElements.define('nc-doc-footer', NcDocFooter);
