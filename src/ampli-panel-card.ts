import { type CSSResultGroup , html, LitElement, } from "lit";
import { customElement, property } from 'lit/decorators';
import { TemplateResult } from 'lit-html';
import { HomeAssistant } from "custom-card-helpers";

import styles from './styles'

import "./editor";

import { HomeAssistantFixed, WindowWithCards } from "./types";
import { CARD_TAG_NAME, CARD_VERSION, EDITOR_CARD_TAG_NAME, AvReceiverdevicemap } from "./const";


const line1 = '  AV Receiver Panel Card  ';
const line2 = `  version: ${CARD_VERSION}  `;
/* eslint no-console: 0 */
console.info(
  `%c${line1}\n%c${line2}`,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// Allow this card to appear in the card chooser menu
const windowWithCards = window as unknown as WindowWithCards;
windowWithCards.customCards = windowWithCards.customCards || [];
windowWithCards.customCards.push({
    type: CARD_TAG_NAME,
    name: "AV Receiver - Ampli",
    preview: true,
    description: "AV Receiver - Ampli custom card"
});




@customElement(CARD_TAG_NAME)
export class AmpliPanelCard extends LitElement {
   @property({ attribute: false }) public hass!: HomeAssistant;
   @property({ attribute: false }) private config!: any;
    private active: boolean;
    private _show_inputs: boolean;
    private _show_inputs2: boolean;
    private _show_sound_output: boolean;
    private loadLocalFont(scriptDirectory: string, path: string) {
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: 'displayFont';
          src: url('${scriptDirectory}/DS-DIGII.TTF') format('truetype');
        }

        @font-face {
          font-family: 'ledFont';
          src: url('${scriptDirectory}/LEDCalculator.ttf') format('truetype');
        }
    
        
      `;
      document.head.appendChild(style);

    }
    
  


    static getConfigElement() {
      // Create and return an editor element
      return document.createElement(EDITOR_CARD_TAG_NAME);
  }
   static get properties() {
    return {
        hass: {},
        config: {},
        active: {},
        _show_inputs: {},
        _show_sound_output: {},
        _show_inputs2: {}
    };
}

constructor() {
    super();
    this._show_sound_output = false;
    this._show_inputs2 = false;
    this._show_inputs = false;
    const scriptPath = new URL(import.meta.url).pathname;
    const scriptDirectory = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
    this.loadLocalFont(scriptDirectory, scriptPath);
}

render() {
  
    const stateObj = this.hass.states[this.config.entity];
    const stateObj2 = this.hass.states[this.config.zone2];
    const coverWidth = this.config.coverWidth ? this.config.coverWidth : "70px";
    const coverHeight = this.config.coverHeight ? this.config.coverHeight : "465px";
    let brand;
    if (this.config.brand) {
      brand = this.config.brand;
    } else {
      brand = this.config.av_receiver_family ? AvReceiverdevicemap.get(this.config.av_receiver_family).name : "Receiver Name";
    }

    const info = this.config.info ? this.config.info : "Receiver description";
    let state1on;
    let state2on;
    if (this.config.av_receiver_family && this.config.av_receiver_family === 'yamaha') {
      state1on = this.config.entity && !["off"].includes(stateObj.state);
      state2on = this.config.zone2 && !["off"].includes(stateObj2.state);
    } else {
      state1on = this.config.entity && !["off", "idle"].includes(stateObj.state);
      state2on = this.config.zone2 && !["off", "idle"].includes(stateObj2.state);
    }

    return html`
    <div class="card">
      <div class="page">
        ${this.config.zone2 ? html`
          <div class="grid-container-power" style="${state1on && state2on ? 'width: 120px;' : 'width: 280px;'}">
          <label class="main-title">MAIN</label>
          <label class="zone2-title">ZONE 2</label>
            <button style="border-radius:50%;" class="power ${state1on ? 'btn btn_command-on ' : 'btn btn_command  ripple  '}" @click=${() => this._toggle_media_player()}><ha-icon icon="mdi:power" style="color: ${state1on ? '#00d2ff' : 'red'};"</button>
            <button style="border-radius:50%;" class="zone2-power ${state2on ? 'btn btn_command-on ' : 'btn btn_command ripple  '}" style="border-radius:50%; height: 60px; width: 60px; color: ${state2on ? 'white' : 'red'}" @click=${() => this._toggle_media_player_zone2()}><ha-icon icon="mdi:power" style="color: ${state2on ? '#00d2ff' : 'red'};"</button>
            <button style="border-radius:50%; height: 60px; width: 60px;" class="input btn btn_command  ripple  " @click=${() => this._show_hide_inputs()}>INPUT</button>
            <button style="border-radius:50%; height: 60px; width: 60px;" class="sound btn btn_command  ripple  " @click=${() => this._show_hide_sound_mode()}>SOUND</button>
            <svg class="text-zone" version="1.0" id="Livello_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              width="80px" height="20px" viewBox="0 0 80 20" style="enable-background:new 0 0 80 20;" xml:space="preserve">
              <style type="text/css">
              .st0{fill:rgba(203,203,203, 0.6);}
              .st1{font-family:'MyriadPro-Regular';}
              .st2{font-size:18px;}
              .st3{fill:rgba(203,203,203, 0.6);stroke:rgba(203,203,203, 0.6);stroke-miterlimit:10;}
              </style>
              <text transform="matrix(1 0 0 1 19.7401 13.87)" class="st0 st1 st2">zone</text>
              <line class="st3" x1="79.5" y1="9.5" x2="79.5" y2="20"/>
              <line class="st3" x1="64.5" y1="9" x2="80" y2="9"/>
              <line class="st3" x1="0.5" y1="9.5" x2="0.5" y2="20"/>
              <line class="st3" x1="0" y1="9" x2="15.5" y2="9"/>
            </svg>
            <div class="zone-btn">    
              <button class="btn btn_zone   ripple  " style="margin-right:20px;" @click=${() => this._show_inputs2 = false}>1</button>
              <button class="btn btn_zone   ripple  " style="margin-left:20px;" @click=${() => this._show_inputs2 = true}>2</button>
            </div>
        </div>
    ` : html`
      <div class="grid-container-power" style="width: 280px;">
        <button style="border-radius:50%;" class="power ${state1on ? 'btn btn_command-on' : 'btn btn_command ripple  '}" @click=${() => this._toggle_media_player()}><ha-icon icon="mdi:power" style="color: ${state1on ? '#00d2ff' : 'red'};"</button>
        <button style="border-radius:50%; height: 60px; width: 60px;" class="input btn btn_command  ripple  " @click=${() => this._show_hide_inputs()}>INPUT</button>
        <button style="border-radius:50%; height: 60px; width: 60px;" class="sound btn btn_command  ripple  " @click=${() => this._show_hide_sound_mode()}>SOUND</button>
      </div>
    `}

<!-- ################################################################ CENTRAL COLUMN ############################################################ -->
        <div class="central-column">
                                
        <div class="central-column-display"  style="height: 212px; background:${state1on ? 'black;' : 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(17,17,17,1) 50%, rgba(0,0,0,1) 65%, rgba(0,0,0,1) 100%);'}">
            <div class="grid-container-display">
            ${state1on ? html`
              <label class="upper-display-text">mode:</label>
              <label class="upper-display-text-light">${stateObj?.attributes.sound_mode}</label>
              <label class="upper-display-text">type:</label>
              <label class="upper-display-text-light" >${stateObj?.attributes.media_content_type}</label>
              ` : html`
              `}
                <label class="display-vol">${state1on ? (stateObj?.attributes.volume_level * 100).toFixed(1) : ' '}</label>
                ${this.config.zone2 ? html`
                <label class="upper-display-text" style="${!state1on && !state2on  ? 'opacity: 0.3;' : ' '}">zone 2:</label>
                <label class="upper-display-text-light" style="${!state1on && !state2on  ? 'opacity: 0.3;' : ' '}">${state2on ? (stateObj2.attributes.volume_level * 100).toFixed(1) : 'off'}</label>
                <label class="upper-display-text">${state2on ? 'input 2:' : ' '}</label>
                <label class="upper-display-text-light">${state2on ? stateObj2.attributes.media_title : ' '}</label>
                ` : html`
              `}
            </div>
            ${stateObj?.attributes.source === "Tuner" ? html`
            <div class="tuner-panel">
              <div class="tuner-display">
                <hr style="height:1px;width: 100%; border-width:0;color:rgba(0,210,255,0.25); background-color: rgba(0,210,255,0.25); margin: 0 0 3px 0; box-shadow: 0px 0px 5px rgba(0,210,255,0.25);">
                <hr style="height:1px;width: 100%; border-width:0;color:rgba(0,210,255,0.5); background-color: rgba(0,210,255,0.5); margin: 3px 0 3px 0; box-shadow: 0px 0px 5px rgba(0,210,255,0.5);">
                <hr style="height:1px;width: 100%; border-width:0;color:rgba(0,210,255,0.75); background-color: rgba(0,210,255,0.75); margin: 3px 0 0 0; box-shadow: 0px 0px 5px rgba(0,210,255,0.75);">
                <div class="tuner-number">
                <label style="grid-area: fm88;" class="fm-text-light">88.7</label>
                <label style="grid-area: fm97;" class="fm-text-light">93.3</label>
                <label style="grid-area: fm98;" class="fm-text-light">98</label>
                <label style="grid-area: fm102;" class="fm-text-light">102.6</label>
                <label style="grid-area: fm108;" class="fm-text-light">108</label>

                </div>
                <hr style="height:1px;width: 100%; border-width:0;color:rgba(0,210,255,0.75); background-color: rgba(0,210,255,0.75); margin: 3px 0 4px 0; box-shadow: 0px 0px 5px rgba(0,210,255,0.75);">
                <hr style="height:1px;width: 100%; border-width:0;color:rgba(0,210,255,0.5); background-color: rgba(0,210,255,0.5); margin: 3px 0 3px 0; box-shadow: 0px 0px 5px rgba(0,210,255,0.5);">
                <hr style="height:1px;width: 100%; border-width:0;color:rgba(0,210,255,0.25); background-color: rgba(0,210,255,0.25); margin: 3px 0 0 0; box-shadow: 0px 0px 5px rgba(0,210,255,0.25);">
              </div>
              <label style="margin: auto;" class="lower-display-text-light">${stateObj?.attributes.media_artist} ${stateObj?.attributes.media_title}</label>
              <div class="bar_value" style="width:${100 * ((stateObj?.attributes.media_title - 88) / (108 - 88))}%;">|</div>
            </div>
          ` : html`
            <label style="padding-bottom: 10px; ${state1on ? ' ' : 'opacity: 0.3;'}" class="display-text title">${state1on ? stateObj?.attributes.source : 'MAIN OFF'}</label>
            <label class="display-text title">${stateObj?.attributes.sound_mode_raw}</label>
            `}
        </div>

        ${this._show_inputs ? html`
<!-- ######################################################### INPUTS PANEL ################################ -->
        <div class="media-content-panel inset">
        
        ${this._show_inputs2 ? html`
        <div class="grid-container">
        <div class="zone-text">
        <svg version="1.1" baseProfile="basic" id="Livello_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="140px" height="70px"
         viewBox="0 0 140 70" xml:space="preserve">
         <metadata>
         <sfw  xmlns="&ns_sfw;">
         <slices></slices>
         <sliceSourceBounds  bottomLeftOrigin="true" height="80" width="140" x="0" y="-80"></sliceSourceBounds>
         </sfw>
         </metadata>
         <path style="opacity:0.12;fill:none;stroke:rgba(203,203,203, 0.6);stroke-width:3;stroke-miterlimit:10;" d="M126.5,68.5h-113c-6.6,0-12-5.4-12-12
         v-43c0-6.6,5.4-12,12-12h113c6.6,0,12,5.4,12,12v43C138.5,63.1,133.1,68.5,126.5,68.5z"/>
         <text transform="matrix(1 0 0 1 14.0908 40.0498)" style="opacity:0.12;fill:rgba(203,203,203, 0.6); font-family:'Krungthep'; font-size:30.4386px;">ZONE</text>
         <text transform="matrix(1.1144 0 0 1 88.8184 57.4141)" style="opacity:0.12;fill:rgba(203,203,203, 0.6); font-family:'Krungthep'; font-size:55.4912px;">2</text>
         </svg>
        </div>
          ${stateObj2.attributes.source_list.map(source => html`
          <button class="${stateObj2.attributes.source === source ? 'btn btn_hdmi-sound-on' : 'btn btn_hdmi-sound ripple'}" @click=${() => {
        this._select_source2(source);
        this._show_inputs = false;
        }}>${source}</button>
          `)}
        </div>
        ` : html`
        <div class="grid-container">
        <div class="zone-text">
        <svg version="1.1" baseProfile="basic" id="Livello_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="140px" height="70px"
         viewBox="0 0 140 70" xml:space="preserve">
         <metadata>
         <sfw  xmlns="&ns_sfw;">
         <slices></slices>
         <sliceSourceBounds  bottomLeftOrigin="true" height="80" width="140" x="0" y="-80"></sliceSourceBounds>
         </sfw>
         </metadata>
         <path style="opacity:0.12;fill:none;stroke:rgba(203,203,203, 0.6);stroke-width:3;stroke-miterlimit:10;" d="M126.5,68.5h-113c-6.6,0-12-5.4-12-12
         v-43c0-6.6,5.4-12,12-12h113c6.6,0,12,5.4,12,12v43C138.5,63.1,133.1,68.5,126.5,68.5z"/>
         <text transform="matrix(1 0 0 1 14.0908 40.0498)" style="opacity:0.12;fill:rgba(203,203,203, 0.6); font-family:'Krungthep'; font-size:30.4386px;">ZONE</text>
         <text transform="matrix(1.1144 0 0 1 88.8184 57.4141)" style="opacity:0.12;fill:rgba(203,203,203, 0.6); font-family:'Krungthep'; font-size:55.4912px;">1</text>
         </svg>
        </div>
          ${stateObj?.attributes.source_list.map(source => html`
          <button class="${stateObj?.attributes.source === source ? 'btn btn_hdmi-sound-on' : 'btn btn_hdmi-sound ripple'}" @click=${() => {
        this._select_source(source);
        this._show_inputs = false;
        }}>${source}</button>
          `)}
        </div> 
        `} 
        </div>
        ` : html`
        ${this._show_sound_output ? html`
<!-- ######################################################### SOUND PANEL ################################ -->
        <div class="media-content-panel inset">
       <div class="grid-container">
       <div class="zone-text">
       <svg version="1.1" id="Livello_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
width="140px" height="70px" viewBox="0 0 140 70" enable-background="new 0 0 140 70" xml:space="preserve">
<path opacity="0.12" fill="none" stroke="rgba(203,203,203, 0.6)" stroke-width="3" stroke-miterlimit="10" d="M126.5,68.5h-113
c-6.6,0-12-5.4-12-12v-43c0-6.6,5.4-12,12-12h113c6.6,0,12,5.4,12,12v43C138.5,63.1,133.1,68.5,126.5,68.5z"/>
<text transform="matrix(1 0 0 1 12.0908 35.0498)" opacity="0.12" fill="rgba(203,203,203, 0.6)" font-family="'Krungthep'" font-size="24px">SOUND</text>
<text transform="matrix(1 0 0 1 58.0908 57.0498)" opacity="0.12" fill="rgba(203,203,203, 0.6)" font-family="'Krungthep'" font-size="24px">MODE</text>
</svg>

       </div>
          ${stateObj?.attributes.sound_mode_list.map(sound => html`
          <button class="${stateObj?.attributes.sound_mode === sound ? 'btn btn_hdmi-sound-on' : 'btn btn_hdmi-sound  ripple'}" @click=${() => {
        this._select_sound_mode(sound);
        this._show_sound_output = false;
        }}>${sound}</button>
          `)}
        </div> 
        </div>
        ` : html`
<!-- ######################################################### MEDIA-CONTROL PANEL ################################ -->
${stateObj?.attributes.source === "Spotify" ? html`
        <div class="media-content-panel inset">
          <div class="central-column-display" style="height: 110px; margin: 15px; width: 620px;"> 
            <div class="grid-container-media-content">
              <label class="upper-display-text">title:</label>
              <label class="lower-display-text-light">${stateObj?.attributes.media_title}</label>
              <label class="upper-display-text">album:</label>
              <label class="lower-display-text-light">${stateObj?.attributes.media_album_name}</label>
              <label class="upper-display-text">artist:</label>
              <label class="lower-display-text-light">${stateObj?.attributes.media_artist}</label>
              <img class="display-image" src="${stateObj?.attributes.entity_picture}" width="90" height="90">
            </div>
            </div>
            <div class="grid-container-media-control" >
            <button class="btn btn-flat ripple"  @click=${() => this._media_player_service("media_previous_track")}><ha-icon icon="mdi:skip-backward"/></button>
            <button class="btn btn-flat ripple"  @click=${() => this._media_player_service("media_play")}><ha-icon icon="mdi:play"/></button>
            <button class="btn btn-flat ripple"  @click=${() => this._media_player_service("media_pause")}><ha-icon icon="mdi:pause"/></button>
            <button class="btn btn-flat ripple"  @click=${() => this._media_player_service("media_stop")}><ha-icon icon="mdi:stop"/></button>
            <button class="btn btn-flat ripple"  @click=${() => this._media_player_service("media_next_track")}><ha-icon icon="mdi:skip-forward"/></button>
            </div>
          ` : html`

<!-- ######################################################### DEFAULT PANEL ################################ -->
          <div class="media-content-panel double-border">
          <button class="btn" style="background-color: transparent; height: 50px; border-width: 0px;" @click=${() => this._show_hide_inputs()} ><ha-icon icon="mdi:drag-horizontal-variant" style="color: #121212; width: 50px; height: 50px;"/></button>
          <div class="seciotn-brand">
            <p class="brand-text">${brand}</p>
            <p class="brand-text-description">${info}</p>
            </div>
          </div>
            `}
          `}
        `}
        </div>
      
<!-- ######################################################### Rigth Column ################################ -->
        ${this.config.zone2 ? html`  
        ${state1on || state2on ? html`  
        <div class="section-slider" style="${state1on && state2on ? 'margin: 0px 10px 0px 25px;' : 'margin: 0px 30px 0px 30px;'}">  
                
            ${state1on ? html`
                <div class="grid-container-slider-1-command">
                  <p class="onoff zona-title">${this.config.name || stateObj?.attributes.friendly_name}</p>
                  <button class="vol-up btn btn_command  ripple" @click=${() => this._media_player_service("volume_up")}><ha-icon icon="mdi:menu-up"</button>
                  <button class="mute btn btn_command  ripple  " Style="color:${stateObj?.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._media_player_toggle_mute(stateObj)}><span class="${stateObj?.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
                  <button class="vol-down btn btn_command  ripple  " @click=${() => this._media_player_service("volume_down")}><ha-icon icon="mdi:menu-down" </button>
                </div>

                <div class="grid-item" style="width: calc(${coverWidth} + 20px);">
                    <div class="range-holder" style="--slider-height: ${coverHeight}; --slider-width: ${coverWidth}">
                    <input type="range" class="${stateObj?.state}" style="--slider-width: ${coverWidth};--slider-height: ${coverHeight};" .value="${state1on ? stateObj?.attributes.volume_level * 100 : 0}" @change=${e => this._volume_set(stateObj, e.target.value)}>
                  </div> 
                
                </div>
            ` : html``} 

            ${state2on ? html`
                <div class="grid-item" style="width: calc(${coverWidth} + 20px);">
                    <div class="range-holder" style="--slider-height: ${coverHeight}; --slider-width: ${coverWidth}">
                    <input type="range" class="${stateObj2.state}" style="--slider-width: ${coverWidth};--slider-height: ${coverHeight};" .value="${state2on ? stateObj2.attributes.volume_level * 100 : 0}" @change=${e => this._volume_set(stateObj2, e.target.value)}>
                </div>    
                </div> 
                <div class="grid-container-slider-1-command">
                  <p class="onoff zona-title">${this.config.name_zona2 || stateObj2.attributes.friendly_name}</p>
                  <button class="vol-up btn btn_command ripple  " @click=${() => this._media_player_service_zone2("volume_up")}><ha-icon icon="mdi:menu-up"</button>
                  <button class="mute btn btn_command ripple  " Style="color:${stateObj2.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._media_player_toggle_mute_zone2(stateObj2)}><span class="${stateObj2.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
                  <button class="vol-down btn btn_command ripple  " @click=${() => this._media_player_service_zone2("volume_down")}><ha-icon icon="mdi:menu-down" </button>
                </div>
            ` : html`
            `}
            </div>
            ` : html`
            <div class="section-btn-vol">
            <button class="btn btn-vol  "></button>
            </div>
          `}
          ` : html`
          ${state1on ? html`  
          <div class="section-slider" style="margin: 0px 30px 0px 30px">  
                  <div class="grid-container-slider-1-command">
                    <p class="onoff zona-title">${this.config.name || stateObj?.attributes.friendly_name}</p>
                    <button class="vol-up btn btn_command  ripple  " @click=${() => this._media_player_service("volume_up")}><ha-icon icon="mdi:menu-up"</button>
                    <button class="mute btn btn_command  ripple  " Style="color:${stateObj?.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._media_player_toggle_mute(stateObj)}><span class="${stateObj?.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
                    <button class="vol-down btn btn_command  ripple  " @click=${() => this._media_player_service("volume_down")}><ha-icon icon="mdi:menu-down" </button>
                  </div>
                  <div class="grid-item" style="width: calc(${coverWidth} + 20px);">
                      <div class="range-holder" style="--slider-height: ${coverHeight}; --slider-width: ${coverWidth}">
                      <input type="range" class="${stateObj?.state}" style="--slider-width: ${coverWidth};--slider-height: ${coverHeight};" .value="${state1on ? (stateObj?.attributes.volume_level * 100) : 0}" @change=${e => this._volume_set(stateObj, e.target.value)}>
                    </div> 
                  </div> 
              </div>
              ` : html`
              <div class="section-btn-vol">
              <button class="btn btn-vol  "></button>
              </div>
            `}

        `}




<!-- ######################################## -->
      </div>
    </div>
`;
}





_toggle_media_player() {
  this._media_player_service("toggle");
  this._show_inputs = false;
  this._show_inputs2 = false;
  this._show_sound_output = false;
}

_toggle_media_player_zone2() {
  this._media_player_service_zone2("toggle");
  this._show_inputs = false;
  this._show_inputs2 = false;
  this._show_sound_output = false;
}

_show_hide_inputs() {
  this._show_sound_output = false;
  this._show_inputs = !this._show_inputs;
}

_show_hide_sound_mode() {
  this._show_inputs = false;
  this._show_sound_output = !this._show_sound_output;
}

_select_source(source) {
  this.hass.callService("media_player", "select_source", {
      entity_id: this.config.entity,
      source: source
  });
}

_select_source2(source) {
this.hass.callService("media_player", "select_source", {
    entity_id: this.config.zone2,
    source: source
});
}

_select_sound_mode(sound) {
  this.hass.callService("media_player", "select_sound_mode", {
      entity_id: this.config.entity,
      sound_mode: sound
  });
}

_volume_set(state, value) {
  this.hass.callService("media_player", "volume_set", {
      entity_id: state.entity_id,
      volume_level: value / 100
  });
}

_media_player_service(service) {
  this.hass.callService("media_player", service, {
      entity_id: this.config.entity,
  });
}

_media_player_service_zone2(service) {
  this.hass.callService("media_player", service, {
      entity_id: this.config.zone2,
  });
}

_media_player_toggle_mute(stateObj) {
  this.hass.callService("media_player", "volume_mute", {
      entity_id: this.config.entity,
      is_volume_muted: !stateObj?.attributes.is_volume_muted
  });
}

_media_player_toggle_mute_zone2(stateObj2) {
this.hass.callService("media_player", "volume_mute", {
    entity_id: this.config.zone2,
    is_volume_muted: !stateObj2.attributes.is_volume_muted
});
}


setConfig(config) {
  if (!config.entity) {
      console.log("Invalid configuration");
  }
  this.config = config;
}


getCardSize() {
  return this.config.entities.length + 1;
}



static get styles (): CSSResultGroup {
  return styles
}





}