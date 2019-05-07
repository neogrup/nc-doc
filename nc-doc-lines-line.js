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

        .line-production-container{
          position: relative;
          min-height: 40px;
          @apply --layout-horizontal;
          @apply --layout-center;
          @apply --layout-center-justified;
          border-color: #262b65;
          border-style: solid;
          border-width: 0 0 2px 0;
          color: #262b65;
          font-size: 1.1em;
          font-weight: bolder;
        }

        .line-production-content-time{
          padding-right: 10px;
        }

        .line-production-content-user{
          padding-left: 10px;
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

        .line-delivery-order{
          margin-right: 5px;
          width: 10px;
          min-height: 40px;
          min-width: 10px;
        }

        @media (max-width: 1280px) {
          .line-delivery-order{
            width: 5px;
          }
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

        .line-qty-default { 
          font-size: 1.1em;
          color: white;
          border: 1px solid black;
          margin-left: 5px;
          padding: 2px;
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

        .color-an{
          color: #F44336
        }

        .color-pc {
          color: #1E88E5;
        }

        .color-pf {
          color: #2E7D32;
        }

        .color-pd {
          color: #9E9E9E;
        }

        .bg-ok{
          color: var(--app-primary-color);
          background-color: #E0E0E0;
        }

        .bg-an{
          background-color: #F44336;
        }

        .bg-fi{
          background-color: #BF360C;
        }

        .bg-pe{
          color: var(--app-primary-color);
          background-color: #FFFFFF;
        }

        .bg-pc {
          background-color: #1E88E5;
        }

        .bg-pf {
          background-color: #2E7D32;
        }

        .bg-pd {
          background-color: #9E9E9E;
        }

        .bg-delivery-order-0{
          background-color: #26A69A;
        }

        .bg-delivery-order-1{
          background-color: #9CCC65;
        }

        .bg-delivery-order-2{
          background-color: #FFA726;
        }

        .bg-delivery-order-3{
          background-color: #AB47BC;
        }

        .bg-delivery-order-4{
          background-color: #5C6BC0;
        }

        .bg-delivery-order-5{
          background-color: #26C6DA;
        }

        .bg-delivery-order-6{
          background-color: #D4E157;
        }

        .bg-delivery-order-7{
          background-color: #FFCA28;
        }

        .bg-delivery-order-8{
          background-color: #8D6E63;
        }

        .bg-delivery-order-9{
          background-color: #EC407A;
        }

        .bg-delivery-order-10{
          background-color: #29B6F6;
        }

        paper-icon-button{
          padding: 2px;
        }

        paper-ripple {
          color: var(--app-accent-color);
        }
      </style>

      <template is="dom-if" if="{{showGroupInfo}}">
        <div class="line-production-container" >
          <div class="line-production-content-time">[[_formatTime(line.kitchen.producedTime,language)]]</div>
          <div class="line-production-content-user">[[line.agent]]</div>
        </div>
      </template>

      <div id="line" class\$="{{className}}">
          
          <div class="line-container" on-tap="_selectLine">
            <template is="dom-if" if="{{showLineDeliveryOrder}}">
              <div class\$="{{classNameDeliveryOrder}}"></div>
              <div class="line-delivery-order-name">[[line.kitchen.deliveryName]]</div>
            </template>
            <div class\$="{{classNameStatus}}">[[line.format.qty]]</div>

            <div class\$="{{classNameContent}}">
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
        value: {},
        observer: '_lineChanged'
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
        value: true,
        observer: '_lineChanged'
      },
      showLineGroupInfo: {
        type: Boolean,
        value: false,
        observer: '_lineChanged'
      },
      showLineProductionStatus: {
        type: Boolean,
        value: false,
        observer: '_lineChanged'
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
  

  _lineChanged(){
    let lType = this.line.type || '';
    this.className = 'line';
    this.classNameContent = 'line-content';
    switch (lType) {
      case 'pack':
        if (this.line.packCompleted == 'N'){
          this.className = this.className + ' line-type-pack-incompleted';  
        }
        break;
      case 'packLine':
        this.classNameContent = this.classNameContent + ' line-type-pack-line';
        break;
    }


    let lStatus = this.line.kitchen.status || 'FI';
    this.classNameStatus = 'line-qty';

    if (this.showLineProductionStatus){
      switch (lStatus) {
        case 'OK':
          this.classNameStatus = this.classNameStatus + ' line-qty-default bg-ok';
          break;
        case 'PE':
          this.classNameStatus = this.classNameStatus + ' line-qty-default bg-pe';
          break;
        case 'FI':
          this.classNameStatus = this.classNameStatus + ' line-qty-default bg-fi';
          break;
        case 'MO':
          this.classNameStatus = this.classNameStatus + ' line-qty-default bg-an';
          break;
        case 'AN':
          this.classNameStatus = this.classNameStatus + ' line-qty-default bg-an';
          break;
        case 'PC':
          this.classNameStatus = this.classNameStatus + ' line-qty-default bg-pc';
          break;
        case 'PF':
          this.classNameStatus = this.classNameStatus + ' line-qty-default bg-pf';
          break;
        case 'PD':
          this.classNameStatus = this.classNameStatus + ' line-qty-default bg-pd';
          break;
      }
    }
    
    let lDeliveryOrder = this.line.kitchen.deliveryOrder;
    this.classNameDeliveryOrder = 'line-delivery-order';
    this.classNameDeliveryOrder = this.classNameDeliveryOrder + ' bg-delivery-order-' + lDeliveryOrder;


    this.showGroupInfo = false;
    let lGroup =  '';
    if (this.line.group){
      lGroup =  this.line.group;
    }

    if ((this.showLineGroupInfo) && (this.line.kitchen.producedTime != '0001-01-01T00:00:00Z') && (lGroup === 'user,time')) {
      this.showGroupInfo = true;
    }
  }
}
window.customElements.define('nc-doc-lines-line', NcDocLinesLine);
