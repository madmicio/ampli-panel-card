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

  resize(optionvalue) {
    let heading = 'Do you want to configure an AV-Receiver';

    // Controlla se esiste una configurazione "auto_size" e usa quel valore come opzione selezionata
    const autoresize = this._config.auto_size || 'none';

    return html`
          <div>Card size config</div>
          <select name="auto_size" id="auto_size" class="select-item"
                  .value="${autoresize}"
                  @change=${this.configChanged}
          >
            <option value="none" ?selected=${autoresize === 'none'}>none</option> 
            <option value="autosize" ?selected=${autoresize === 'autosize'}>auto size</option>
            <option value="scale" ?selected=${autoresize === 'scale'}>scale</option>
          </select>
          <br><br>
        `;
  }

  setDimensions(dimensions) {
    if (this._config.auto_size === 'scale')  {
    let heading = 'Dimensions';

    const scale = this._config.scale ? this._config.scale : "1000";

    return html`

          <div  class="heading">${heading}:</div>
          <div style="display:flex;flex-direction:row;">
            <label for="scale">Card Scale: </label><br>
            <input style="flex-grow: 1; width:auto;" type="number" min="500" max="1500" step="1" .value="${scale}" id="scale" name="scale" @input=${this.configChanged} style="width: 40ch;">
            </input>
          </div>
          <br>
        `;
    }
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
    let heading = 'Zone 1 name (option):';
    return html`
            ${heading}<br>
            <input type="text" name="name" id="name" style="width: 37.8ch;padding: .6em; font-size: 1em;" .value="${ampliNameValue}"
                   @input=${this.configChanged}
            <br><br>
        `;
  }
  setZona2Name(ampliNameValue) {
    let heading = 'Zone 2 name (option):';
    return html`
            ${heading}<br>
            <input type="text" name="name_zona2" id="name_zona2" style="width: 37.8ch;padding: .6em; font-size: 1em;" .value="${ampliNameValue}"
                   @input=${this.configChanged}
            <br><br>
        `;
  }


  render() {


    return html`
    <div class="container">
      ${this.getDeviceAVReceiverDropdown(this._config.av_receiver_family)}
      ${this.getMediaPlayerEntityDropdown(this._config.av_receiver_family)}
      ${this.getMediaPlayerZone2(this._config.av_receiver_family)}
      ${this.resize(this._config)}
      ${this.setDimensions(this._config)}
      ${this.setAmpliName(this._config.av_receiver_family)}
      ${this.setAmpliInfo(this._config.info)}
      ${this.setZona1Name(this._config.name)} 
      ${this.setZona2Name(this._config.name_zona2)}
      <br>
            Other functionalities must be configured manually in YAML editor
      <div class="donations" style="display: flex">
          <a href="https://www.buymeacoffee.com/madmicio" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
          <form action="https://www.paypal.com/donate" method="post" target="_top">
          <input type="hidden" name="hosted_button_id" value="U5VQ9LHM82B7Q" />
          <input type="image" src="https://pics.paypal.com/00/s/ODdjZjVlZjAtOWVmYS00NjQyLTkyZTUtNWQ3MmMzMmIxYTcx/file.PNG" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" style="height:60px;" />
          <img alt="" border="0" src="https://www.paypal.com/en_IT/i/scr/pixel.gif" width="1" height="1" />
          </form>
      </div>
    </div>
        `;
  }

  static get styles() {
    return css`

    .container {
            width: 40ch;
        }
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
            background-color: var(--secondary-background-color);
            width: 40ch;
            padding: .6em; 
            font-size: 1em;
        }
 
        `;
  }

}