// Create and register the card editor
import { customElement } from "lit/decorators";
import { html, css, LitElement } from "lit";

import { HomeAssistantFixed } from "./types";
import { EDITOR_CARD_TAG_NAME, AvReceiverdevicemap } from "./const";
import { getMediaPlayerEntitiesByPlatform } from "./utils";





@customElement(EDITOR_CARD_TAG_NAME)
class AmpliPanelCardEditor extends LitElement {
  private _config: any;
  private hass: HomeAssistantFixed;

  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }

  // setConfig works the same way as for the card itself
  setConfig(config) {
    this._config = config;
  }

  // This function is called when the input element of the editor loses focus or is changed
  configChanged(ev) {

    const _config = Object.assign({}, this._config);
    _config[ev.target.name.toString()] = ev.target.value;
    this._config = _config;

    // A config-changed event will tell lovelace we have made changed to the configuration
    // this make sure the changes are saved correctly later and will update the preview
    const event = new CustomEvent("config-changed", {
      detail: { config: _config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  configChangedBool(ev) {
    const inputName = ev.target.name;
    const newValue = ev.target.value === 'true';

    const _config = Object.assign({}, this._config);
    _config[inputName] = newValue;
    this._config = _config;

    // Invia l'evento "config-changed"
    const event = new CustomEvent('config-changed', {
      detail: { config: _config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }





  getDeviceAVReceiverDropdown(optionvalue) {
    const familykeys = [...AvReceiverdevicemap.keys()];
    const blankEntity = (!this._config.av_receiver_family || this._config.av_receiver_family === '')
    ? html`<option value="" selected> - - - - </option>`
    : '';
    return html`
        <div>AV-Receiver config option:</div>
        <div style="display: flex;width: 40ch;align-items: center;">
         <select 
            name="av_receiver_family"
            id="av_receiver_family"
            class="select-item"
            style="width:100%;"
            .value=${optionvalue}
            @focusout=${this.configChanged}
            @change=${this.configChanged}>
            ${blankEntity}
            ${familykeys.map((family) => {
              const receiverData = AvReceiverdevicemap.get(family);
              return html`
                <option value="${family}" ?selected=${optionvalue === family}>
                  ${receiverData.friendlyName}
                </option>
              `;})}
          </select>
          ${this._config.av_receiver_family && this._config.av_receiver_family != '' ? html`
          <ha-icon 
            style="padding-left: 0.8em;"
            icon="mdi:trash-can-outline" 
            @click=${this._erase_av_receiver}
            @mouseover=${() => this.focus()}
          ></ha-icon>`
          : ''}
        </div>
        <br />
    `;
  }

  getMediaPlayerEntityDropdown(optionValue) {
    if (this._config.av_receiver_family) {
      const mediaPlayerEntities = getMediaPlayerEntitiesByPlatform(this.hass, optionValue);
      const blankEntity = (this._config.entity === '' || !mediaPlayerEntities.includes(optionValue))
        ? html`<option value="" selected> - - - - </option>`
        : '';
      return html`
                A-Receiver entity:<br>
                <select name="entity" id="entity" class="select-item" .value="${optionValue}"
                        @focusout=${this.configChanged}
                        @change=${this.configChanged}>
                    ${blankEntity}
                    ${mediaPlayerEntities.map((eid) => html`
                        <option value="${eid}" ?selected=${eid === this._config.entity}>
                            ${this.hass.states[eid].attributes.friendly_name || eid}
                        </option>
                    `)}
                </select>
                <br><br>
            `;
    } else {
      return html``; // Gestire il caso in cui `deviceFamily` non corrisponda a nessuna piattaforma
    }
  }

  getMediaPlayerZone2(optionValue) {
    if (this._config.entity || this._config.entity === '') {
      const mediaPlayerEntities = getMediaPlayerEntitiesByPlatform(this.hass, optionValue);
      const blankEntity = (this._config.entity === '' || !mediaPlayerEntities.includes(optionValue))
        ? html`<option value="" selected> - - - - </option>`
        : '';
      return html`
                Zone 2 entity (option):<br>
                <select name="zone2" id="zone2" class="select-item" .value="${optionValue}"
                        @focusout=${this.configChanged}
                        @change=${this.configChanged}>
                    ${blankEntity}
                    ${mediaPlayerEntities.map((eid) => html`
                        <option value="${eid}" ?selected=${eid === this._config.entity}>
                            ${this.hass.states[eid].attributes.friendly_name || eid}
                        </option>
                    `)}
                </select>
                <br><br>
            `;
    } else {
      return html``; 
    }
  }

  _erase_av_receiver() {
    this._config.av_receiver_family = '';
    this.requestUpdate(); // Aggiunta per forzare il render
  }

  setAmpliName(ampliNameValue) {
    if (this._config.av_receiver_family) {
    let heading = 'AV receiver Brand Name (option):';
    return html`
            ${heading}<br>
            <input type="text" name="brand" id="brand" style="width: 37.8ch;padding: .6em; font-size: 1em;" .value="${this._config.av_receiver_family ? AvReceiverdevicemap.get(this._config.av_receiver_family).name : "Receiver Name"}"
                   @input=${this.configChanged}
            <br><br>
        `;
      } else {
        return html``; 
      }
  }

  setAmpliInfo(ampliNameValue) {
    if (this._config.av_receiver_family) {
    let heading = 'AV receiver Model Description (option):';
    return html`
            ${heading}<br>
            <input type="text" name="info" id="info" style="width: 37.8ch;padding: .6em; font-size: 1em;" .value="${ampliNameValue}"
                   @input=${this.configChanged}
            <br><br>
        `;
      } else {
        return html``; 
      }
  }

  setZona1Name(ampliNameValue) {
    let heading = 'AV receiver Model Description (option):';
    return html`
            ${heading}<br>
            <input type="text" name="name" id="name" style="width: 37.8ch;padding: .6em; font-size: 1em;" .value="${ampliNameValue}"
                   @input=${this.configChanged}
            <br><br>
        `;
  }
  setZona2Name(ampliNameValue) {
    let heading = 'AV receiver Model Description (option):';
    return html`
            ${heading}<br>
            <input type="text" name="name_zona2" id="name_zona2" style="width: 37.8ch;padding: .6em; font-size: 1em;" .value="${ampliNameValue}"
                   @input=${this.configChanged}
            <br><br>
        `;
  }


  render() {


    return html`

      ${this.getDeviceAVReceiverDropdown(this._config.av_receiver_family)}
      ${this.getMediaPlayerEntityDropdown(this._config.av_receiver_family)}
      ${this.getMediaPlayerZone2(this._config.av_receiver_family)}
      ${this.setAmpliName(this._config.av_receiver_family)}
      ${this.setAmpliInfo(this._config.info)}
      ${this.setZona1Name(this._config.name)} 
      ${this.setZona2Name(this._config.name_zona2)}

prova
            Other functionalities must be configured manually in YAML editor
        `;
  }

  static get styles() {
    return css`
 
        .color-selector {
            display: grid;
            grid-template-columns: auto 8ch 3ch;
            width: 40ch;
        }
 
        .color-item {
            padding: .6em;
            font-size: 1em;
        }
 
        .heading {
            font-weight: bold;
        }
 
        .select-item {
            background-color: var(--label-badge-text-color);
            width: 40ch;
            padding: .6em; 
            font-size: 1em;
        }
 
        `;
  }

}