import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import './nc-doc-header.js';
import './nc-doc-lines.js';
import './nc-doc-footer.js';

class NcDoc extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host{
          @apply --layout-vertical;
          height: 100%;
          width: 100%;
          font-size: var(--nc-doc-font-size);
        }

      </style>
      
      <template is="dom-if" if="{{showDocHeader}}">
        <div id="doc-header">
          <nc-doc-header language="{{language}}" data="[[data.data]]" preview-mode="[[previewMode]]">
          </nc-doc-header>
        </div>
      </template>

      <template is="dom-if" if="{{showDocLines}}">
        <div id="doc-lines" style="height: 100%;overflow: auto;">
          <nc-doc-lines language="{{language}}" data="[[data.data.lines]]" delivered-products="[[data.data.stats.deliveredProducts]]" data-ticket-lines-actions="[[dataTicketLinesActions]]" preview-mode="[[previewMode]]" show-canceled-lines="[[showCanceledLines]]" line-actions-enabled="[[lineActionsEnabled]]" show-line-delivery-order="[[showLineDeliveryOrder]]" line-amount-type="[[lineAmountType]]">
          </nc-doc-lines>
        </div>
      </template>
      
      <template is="dom-if" if="{{showDocFooter}}">
        <div id="doc-footer">
          <nc-doc-footer language="{{language}}" data="[[data.data]]" show-change-in-dialog="[[showChangeInDialog]]">
          </nc-doc-footer>
        </div>
      </template>
    `;
  }

  static get properties() {
    return {
      language: String,
      data: Object,
      dataTicketLinesActions: Array,
      showDocHeader: {
        type: Boolean,
        value: false
      },
      showDocLines: {
        type: Boolean,
        value: false
      },
      showDocFooter: {
        type: Boolean,
        value: false
      },
      lineActionsEnabled: {
        type: Boolean,
        value: false
      },
      showLineDeliveryOrder: {
        type: Boolean,
        value: false
      },
      showCanceledLines: {
        type: Boolean,
        value: false
      },
      showChangeInDialog: {
        type: Boolean,
        value: false
      },
      previewMode: {
        type: Boolean,
        value: false
      },
      lineAmountType: {
        type: String,
        value: 'gross'
      }
    }
  }

  scrollLinesToBottom(){
    this.shadowRoot.querySelector('nc-doc-lines')._scrollLinesToBottom();
  }

  animateLine(lineId){
    this.shadowRoot.querySelector('nc-doc-lines')._animateLine(lineId);
  }
}
window.customElements.define('nc-doc', NcDoc);
