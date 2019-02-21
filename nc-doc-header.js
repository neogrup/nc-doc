import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { MixinDoc } from './nc-doc-behavior.js';

class NcDocHeader extends mixinBehaviors([AppLocalizeBehavior], MixinDoc(PolymerElement)) {
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
          margin: 0 0 5px 0;
          padding: 5px;
          background-color: #262b65;
          color: white;
        }

        .header {
          line-height: 20px;
          @apply --layout-horizontal;
          @apply --layout-center;
        }

        .order-id{
          @apply --layout-flex;
          font-size: 1.2em;
        }

        .order-employee{
          font-size: 1.2em;
        }

        .order-tariff{
          @apply --layout-flex;
          font-size: 1.2em;
        }

        .order-customer{
          font-size: 1.2em;
        }
      </style>

      <paper-card>
        <div class="header">
          <template is="dom-if" if="{{previewMode}}">
            <div class="order-id">#[[data.order]]</div>
            <div class="order-employee">{{localize('DOC_HEADER_EMPLOYEE')}}: [[data.attendedByName]]</div>
          </template>
          <template is="dom-if" if="{{!previewMode}}">
            <div class="order-tariff">[[data.tariff.code]]</div>
            <div class="order-customer">[[data.buyerParty.name]]</div>
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
        value: {}
      },
      previewMode: Boolean,
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.useKeyIfMissing = true;
    this.loadResources(this.resolveUrl('static/translations.json'));
    // this.loadResources(this.resolveUrl('/static/translations.json'));
  }
}
window.customElements.define('nc-doc-header', NcDocHeader);
