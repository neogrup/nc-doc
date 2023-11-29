import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
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

      </style>

      <paper-card>
        <div class="footer">
          <template is="dom-repeat" items="{{data.discounts}}">
            <div class="line">
              <div class="label">[[item.name]]</div>
              <div class="value">-[[_getDiscountAmount(item)]]</div>
            </div>
          </template>
          <div class="line">
            <div class="label total-amount">{{localize('DOC_FOOTER_TOTAL_AMOUNT')}}</div>
            <div class="value total-amount">[[_formatPriceCur(totalAmount, data.fiscal.currency.symbol)]]</div>
          </div>
          <template is="dom-if" if="{{showChange}}">
            <div class="line">
              <div class="label">{{localize('DOC_FOOTER_DELIVERED_AMOUNT')}}</div>
              <div class="value">[[_formatPriceCur(totalDeliveredAmount, data.fiscal.currency.symbol)]]</div>
            </div>
            <div class="line">
              <div class="label">{{localize('DOC_FOOTER_CHANGED_AMOUNT')}}</div>
              <div class="value">[[_formatPriceCur(totalChangeAmount, data.fiscal.currency.symbol)]]</div>
            </div>
          </template>
        </div>
      </paper-card>
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
      showAmountsIncludingTaxes: {
        type: Boolean,
        value: false
      },
      hideChangeAndDeliveredAmount: {
        type: Boolean,
        value: false
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
      if (this.showAmountsIncludingTaxes){
        this.totalAmount = this.data.fiscal.totals.totalAmount; 
      } else {
        this.totalAmount = this.data.fiscal.totals.netAmount;
      }

      this.totalDeliveredAmount = (this.data.fiscal.totals.deliveredAmount) ? this.data.fiscal.totals.deliveredAmount : 0; 
      this.totalChangeAmount = (this.data.fiscal.totals.changeAmount) ? this.data.fiscal.totals.changeAmount : 0; 

      if ((this.data.status === 'closed') && (!this.hideChangeAndDeliveredAmount)){
        this.showChange = true;
        if (this.showChangeInDialog){
          this.messageDialog = (this.totalChangeAmount === 0) ? this.localize('DOC_FOOTER_WITHOUT_CHANGED_AMOUNT') : this.localize('DOC_FOOTER_CHANGED_AMOUNT') + ': ' + this._formatPriceCur(this.totalChangeAmount, this.data.fiscal.currency.symbol);
          this.dispatchEvent(new CustomEvent('show-doc-change', {detail: this.messageDialog, bubbles: true, composed: true }));
        }
        
      } else {
        this.showChange = false;
        this.dispatchEvent(new CustomEvent('hide-doc-change', {bubbles: true, composed: true }));
      }
      
    }
  }

  _getDiscountAmount(discount){
    let amount;

    if (this.showAmountsIncludingTaxes){
      amount = discount.discountAmountWithTaxes;
    } else {
      amount = discount.discountAmount;
    }
    
    return this._formatPriceCur(amount, this.data.fiscal.currency.symbol);
  }
}
window.customElements.define('nc-doc-footer', NcDocFooter);
