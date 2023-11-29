import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { MixinDoc } from './nc-doc-behavior.js';

import './nc-doc-lines-line.js';

class NcDocLines extends mixinBehaviors([AppLocalizeBehavior], MixinDoc(PolymerElement)) {
  static get template() {
    return html`
      <style>
        ::-webkit-scrollbar {
          width: 15px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
          box-shadow: inset 0 0 1px var(--app-scrollbar-color);
          background-color: #EEEEEE;
          border-radius: 10px;
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
          background: var(--app-scrollbar-color);
          border-radius: 10px;
        }

        :host {
          display: block;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        paper-card{
          padding: 5px;
          height: 100%;
        }

        iron-list {
          height: 100%;
          width: 100%;
        }

        .lines-empty{
          text-align: center;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
        }
        
        .lines{
          height: 100%;
          width:100%;
          color: black;
          overflow: auto;
        }

        .green{
          color: #388E3C;
        }

        .red{
          color: #D32F2F;
        }

        paper-icon-button{
          padding: 2px;
          margin: 5px
        }
        
      </style>

      <paper-card>
        <div id="lines" class="lines">
          <template is="dom-repeat" items="{{lines}}" as="line">
            <template is="dom-if" if="{{_showLine(line)}}">
              <nc-doc-lines-line 
                  id="slot[[line.id]]" 
                  language="{{language}}" 
                  symbol="[[symbol]]"
                  line="{{line}}" 
                  line-actions-enabled="[[lineActionsEnabled]]" 
                  hide-line-actions-multi-level="[[hideLineActionsMultiLevel]]"
                  line-actions="[[dataTicketLinesActions]]" 
                  show-line-delivery-order="[[showLineDeliveryOrder]]" 
                  show-line-group-info="[[showLineGroupInfo]]" 
                  show-line-production-status="[[showLineProductionStatus]]"
                  show-amounts-including-taxes="[[showAmountsIncludingTaxes]]"
                  show-line-pack-mandatory="[[showLinePackMandatory]]"
                  show-packs-reduced="[[showPacksReduced]]"
                  hide-packs-multi-level="[[hidePacksMultiLevel]]"
                  on-open-line-actions="_openLineActions"
                  on-line-action-selected="_lineActionSelectedPrev" 
                  on-selected="_selectLine">
              </nc-doc-lines-line>
            </template>
                    
          </template>
          <template is="dom-if" if="{{showNoLines}}">
            <p class="lines-empty">{{localize('DOC_LINES_NOT_LINES')}}</p>
          </template>
        </div>
      </paper-card>

      
    `;
  }


  static get properties() {
    return {
      language: String,
      symbol: String,
      data: {
        type: Object,
        value: {},
        observer: '_dataChanged'
      },
      deliveredProducts: Number,
      dataTicketLinesActions: Array,
      editorMode: {
        type: Boolean,
        value: false,
        notify: true
      },
      lineActionsEnabled: Boolean,
      hideLineActionsMultiLevel: Boolean,
      showNoLines: {
        type: Boolean,
        value: true
      },
      showCanceledLines: Boolean,
      showLineDeliveryOrder: Boolean,
      showLineGroupInfo: Boolean,
      showLineProductionStatus: Boolean,
      showAmountsIncludingTaxes: Boolean,
      showLinePackMandatory: Boolean,
      showPacksReduced: Boolean,
      hidePacksMultiLevel: Boolean,
      previewMode: Boolean,
      lines: {
        type: Array,
        value: []
      },
      line: {
        type: Object,
        notify: true,
        value: {}
      },
      _currentLine: {
        type: Object,
        value: {}
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
    this.set('lines', []);
    this.showNoLines = true;
    if (!this.data) return;
    if (this.data.length > 0) {
      if (this.deliveredProducts !== 0){
        this.showNoLines = false;
      }
      this.set('lines', this.data);
    }
  }

  _showLine(line){
    let showLine = true;

    if (this.previewMode) {
      if (line.printMode === "doNotPrint") {
        showLine = false;
      }
    }

    if (!this.showCanceledLines){
      if ((line.status === "canceled") || (line.status === "discard")) showLine = false;
    }

    if (this.hidePacksMultiLevel){
      if (line.level > 0 ) showLine = false;
    }

    return showLine;
  }

  _selectLine(element){
    this._currentLine = element.target.line;
    this.dispatchEvent(new CustomEvent('line-selected', { detail: this._currentLine, bubbles: true, composed: true }));
  }

  _openLineActions(element){
    if (this.editorMode){
      return;
    }
    this._currentLine = element.target.line;
    this.dispatchEvent(new CustomEvent('open-doc-lines-line-actions', { detail: element.detail, bubbles: true, composed: true }));
  }

  _lineActionSelectedPrev(element){
    if (element.target.line){
      this._currentLine = element.target.line;
    }
    this._lineActionSelected(element)
  }

  _lineActionSelected(element){
    let lineAction = (element.model.item) ? element.model.item.action : element.detail.model.item.action;

    switch (lineAction) {
      case '_addQty':
        this._addQty();
        break;
      case '_removeQty':
        this._removeQty();
        break;
      case '_selectQty':
        this._selectQty();
        break;
      case '_selectName':
        this._selectName();
        break;
      case '_selectPrice':
        this._selectPrice();
        break;
      case '_selectComments':
        this._selectComments();
        break;
      case '_selectDeliveryOrder':
        this._selectDeliveryOrder();
        break;
      case '_delete':
        this._delete();
        break;
      case '_showInfo':
        this._showInfo();
        break;
      case '_moveLine':
        this._moveLine();
        break;
      case '_selectStartHour':
        this._selectStartHour();
        break;
      case '_selectFormat':
        this._selectFormat();
        break;
    }
  }

  _addQty(){
    this.dispatchEvent(new CustomEvent('line-inc', { detail: this._currentLine, bubbles: true, composed: true }));
  }

  _removeQty(){
    this.dispatchEvent(new CustomEvent('line-dec', { detail: this._currentLine, bubbles: true, composed: true }));
    if (this._currentLine.format.qty <= 0) {
      this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
    }
  }

  _selectQty(){
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('line-select-qty', { detail: this._currentLine, bubbles: true, composed: true }));
  }

  _selectName(){
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('line-select-name', { detail: this._currentLine, bubbles: true, composed: true }));
  }

  _selectPrice(){
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('line-select-price', { detail: this._currentLine, bubbles: true, composed: true }));
  }

  _selectComments(){
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('line-select-comments', { detail: this._currentLine, bubbles: true, composed: true }));
  }

  _selectDeliveryOrder(){
    this.dispatchEvent(new CustomEvent('line-select-delivery-order', { detail: this._currentLine, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
  }

  _delete(){
    this.dispatchEvent(new CustomEvent('line-del', { detail: this._currentLine, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
  }

  _showInfo(){
    this.dispatchEvent(new CustomEvent('line-show-info', { detail: this._currentLine, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
  }

  _moveLine(){
    this.dispatchEvent(new CustomEvent('line-move', { detail: this._currentLine, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
  }

  _selectStartHour(){
    this.dispatchEvent(new CustomEvent('line-select-start-hour', { detail: this._currentLine, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
  }

  _selectFormat(){
    this.dispatchEvent(new CustomEvent('close-doc-lines-line-actions', {bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('line-select-format', { detail: this._currentLine, bubbles: true, composed: true }));
  }

  _scrollLinesToBottom(){
    this.shadowRoot.querySelector('#lines').scrollTop = this.shadowRoot.querySelector('#lines').scrollHeight;
  }

  _animateLine(lineId){
    let slot;
    slot = '#slot' + lineId
    if (this.shadowRoot.querySelector(slot)){
      this.shadowRoot.querySelector(slot)._animateLine()
    }
  }
}
window.customElements.define('nc-doc-lines', NcDocLines);
