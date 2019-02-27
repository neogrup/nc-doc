import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { MixinDoc } from './nc-doc-behavior.js';
class NcDocLinesLine extends MixinDoc(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
        }

        .line {
          position: relative;
          min-height: 40px;
          @apply --layout-horizontal;
          @apply --layout-center;
          border-color: #BDBDBD;
          border-style: solid;
          border-width: 0 0 1px 0;
        }

        .line-container {
          min-height: 40px;
          @apply --layout-horizontal;
          @apply --layout-center;
          @apply --layout-flex;
        }

        .line-delivery-order-name{
          font-size: 0.9em;
          width: 40px;
          white-space: nowrap;
          overflow: hidden;
          /* text-overflow: ellipsis; */
        }

        .line-qty {
          width: 40px;
          text-align: center;
        }

        .line-content{
          @apply --layout-flex;
          padding-left: 10px;
        }

        .line-type-pack-incompleted{
          background-color: var(--error-color);
        }

        .line-type-pack-line{
          padding-left: 20px;
          color: #9E9E9E;
        }

        .line-content-name {
          font-size: 1.1em;
        }

        .line-content-format{
          font-size: 0.8em;
        }

        .line-content-comments {
          font-size: 0.8em;
          color: #9E9E9E;
          font-style: italic;
        }

        .line-content-discount {
          font-size: 0.8em;
          color: #9E9E9E;
          font-style: italic;
        }

        .line-price {
          /* width: 90px; */
          padding: 0 5px 0 2px;
          text-align: right;
        }
        
        .line-actions{
          /* font-size: 1em; */
        }


        .green{
          color: #388E3C;
        }

        .red{
          color: #D32F2F;
        }

        paper-icon-button{
          padding: 2px;
        }

        paper-ripple {
          color: var(--app-accent-color);
        }
      </style>

      <div id="line" class\$="{{_getLineClass(line)}}">

        <div class="line-container" on-tap="_selectLine">
          <template is="dom-if" if="{{showLineDeliveryOrder}}">
            <div class="line-delivery-order-name">[[line.kitchen.deliveryName]]</div>
          </template>
          <div class="line-qty">[[line.format.qty]]</div>
          <div class\$="{{_getLineContentClass(line.type)}}">
            <div class="line-content-name">[[line.product.name]]</div>
            <div class="line-content-format">[[line.format.name]]</div>
            <div class="line-content-comments">[[line.comments.private]]</div>
            <template is="dom-repeat" items="{{line.discounts}}">
              <div class="line-content-discount">[[item.name]]</div>
            </template>
          </div>
          <div class="line-price" hidden\$="{{_hidePrice(line)}}">[[_getLineAmount(line)]]</div>
        </div>

        <template is="dom-if" if="{{lineActionsEnabled}}">
          <div class="line-actions">
            <template is="dom-if" if="{{showLinesActionsDialog}}">
              <paper-icon-button icon="more-vert" on-tap="_showLineActions"></paper-icon-button>
            </template>

            <template is="dom-if" if="{{!showLinesActionsDialog}}">
              <template is="dom-repeat" items="{{lineActions}}">
                <paper-icon-button icon="[[item.icon]]" class\$="[[_getLineActionClass(item)]]" on-tap="_lineActionSelected"></paper-icon-button>
              </template>
            </template>
          </div>

        </template>

        <paper-ripple id="ripple" initial-opacity="0.5"></paper-ripple>
      </div>
    `;
  }

  static get properties() {
    return {
      language: String,
      line: {
        type: Object,
        value: {}
      },
      lineActionsEnabled: {
        type: Boolean,
        value: false
      },
      showLinesActionsDialog: {
        type: Boolean,
        value: false
      },
      lineActions: Array,
      showLineDeliveryOrder: {
        type: Boolean,
        value: false
      },
      lineAmountType: {
        type: String,
        value: 'net'
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.lineActions){
      if (this.lineActions.length <= 2){
        this.showLinesActionsDialog = false;
      } else {
        this.showLinesActionsDialog = true;
      }
    }
  }

  _lineActionSelected(e){
    this.dispatchEvent(new CustomEvent('line-action-selected', { detail: e, bubbles: true, composed: true }));
  }

  _selectLine(e){
    this.dispatchEvent(new CustomEvent('selected', { detail: e.target, bubbles: true, composed: true }));
  }

  _showLineActions(e){
    this.dispatchEvent(new CustomEvent('actions', { detail: e.target, bubbles: true, composed: true }));
  }

  _animateLine(){
    this.$.ripple.downAction();
    this.$.ripple.upAction();
  }

  _getLineClass(line){
    let lType = line.type || '';
    let className = 'line';
    switch (lType) {
      case 'pack':
        if (line.packCompleted == 'N'){
          className = className + ' line-type-pack-incompleted';  
          
        }
        break;
    }
    return className;
  }

  _getLineContentClass(lineType) {
    let lType = lineType || '';
    let className = 'line-content';
    switch (lType) {
      case 'packLine':
        className = className + ' line-type-pack-line';
        break;
    }
    return className;
  }

  _getLineAmount(line){
    let amount;

    if (this.lineAmountType === 'total'){
      amount = (line.packNetAmount) ? line.packNetAmount : line.totalAmount;
    } else {
      amount = (line.packNetAmount) ? line.packNetAmount : line.netAmount;
    }
    
    return this._formatPrice(amount);
  }

  _hidePrice(line) {
    let lAffectPrice = line.affectPrice || 'S';
    let lPrintMode = line.printMode || 'print';
    let hidePrice = false;

    if (lAffectPrice === 'N' || lPrintMode !== 'print'){
      hidePrice = true;
    }
    return hidePrice;
  }
}
window.customElements.define('nc-doc-lines-line', NcDocLinesLine);
