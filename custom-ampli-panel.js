import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
class CustomAmpliPanel extends LitElement {
  
  static get properties() {
    return {
      hass: {},
      config: {},
      active: {}
    };
  }
  
  constructor() {
    super();
  }
  
  render() {
    const stateObj = this.hass.states[this.config.entity];
    const buttonColor = this.config.colors && this.config.colors.buttons ? this.config.colors.buttons : "#f2f0fa";
    const textColor = this.config.colors && this.config.colors.texts ? this.config.colors.texts : "var(--primary-text-color)";
    const backgroundColor = this.config.colors && this.config.colors.background ? this.config.colors.background : "var(--primary-background-color)";
    var coverWidth = this.config.coverWidth ? this.config.coverWidth : "70px";
    var coverHeight = this.config.coverHeight ? this.config.coverHeight : "465px";
    const colorButtons = this.config.color_buttons === "enable";
    
    
    return html`
        <div class="card">
          <div class="page" style="--remote-button-color: ${buttonColor}; --remote-text-color: ${textColor}; --remote-color: ${backgroundColor};">
            
              <div class="grid-container-input-mode">
               
                <label>INPUT</label>
                <label>SOUND MODE</label>
                
                <div class="grid-container">
                  ${stateObj.attributes.source_list.map(source => html`
                  <button class="${stateObj.attributes.source === source ? 'btn_hdmi-sound-on' : 'btn_hdmi-sound  ripple overlay'}" @click=${() => {
                      this._select_source(source);
                      this._show_inputs = false;
                  }}}>${source}</button>
                  `)}
                </div> 
                  
                <div class="grid-container">
                  ${stateObj.attributes.sound_mode_list.map(sound => html`
                  <button class="${stateObj.attributes.sound_mode === sound ? 'btn_hdmi-sound-on' : 'btn_hdmi-sound  ripple overlay'}" @click=${() => {
                      this._select_sound_mode(sound);
                      this._show_inputs = false;
                  }}}>${sound}</button>
                  `)}
                </div> 


              </div>

              <div class="grid-container-slider-1-command"  style="margin-left:50px;">
                <button class="onoff  ${stateObj.state === "on" ? 'btn_command-on' : 'btn_command ripple overlay'}" @click=${() => this._media_player_service("toggle")}><ha-icon icon="mdi:power" style="color: ${stateObj.state === "on" ? 'white' : 'red'};"</button>
                <button class="vol-up btn_command  ripple overlay" @click=${() => this._media_player_service("volume_up")}><ha-icon icon="mdi:menu-up"</button>
                <button class="mute btn_command  ripple overlay" Style="color:${stateObj.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._button("MUTE")}><span class="${stateObj.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
                <button class="vol-down btn_command  ripple overlay" @click=${() => this._media_player_service("volume_down")}><ha-icon icon="mdi:menu-down" </button>
              </div>


              <div class="grid-container-slider">
              
                <p class="zona1_title">${this.config.name || stateObj.attributes.friendly_name}</p>
                <p class="zona1_title">${stateObj.state === "off" ? 'off' : (stateObj.attributes.volume_level*100)}</p>  
                <div class="grid-item" style="width: calc(${coverWidth} + 20px);">
                  <div class="range-holder" style="--slider-height: ${coverHeight}; --slider-width: ${coverWidth}">
                    <input type="range" class="${stateObj.state}" style="--slider-width: ${coverWidth};--slider-height: ${coverHeight};" .value="${stateObj.state === "close" ? 0 : Math.round(stateObj.attributes.volume_level*100)}" @change=${e => this._volume_set(stateObj, e.target.value)}>
                  </div>
                </div>
              </div> 

              ${this.config.zone2 ? html`
              <div class="grid-container-slider">
              
                <p class="zona1_title">${this.config.name || stateObj.attributes.friendly_name}</p>
                <p class="zona1_title">${stateObj.state === "off" ? 'off' : (stateObj.attributes.volume_level*100)}</p>  
                <div class="grid-item" style="width: calc(${coverWidth} + 20px);">
                  <div class="range-holder" style="--slider-height: ${coverHeight}; --slider-width: ${coverWidth}">
                    <input type="range" class="${stateObj.state}" style="--slider-width: ${coverWidth};--slider-height: ${coverHeight};" .value="${stateObj.state === "close" ? 0 : Math.round(stateObj.attributes.volume_level*100)}" @change=${e => this._volume_set(stateObj, e.target.value)}>
                  </div>
                </div>
              </div> 


            <div class="grid-container-slider-1-command">
              <button class="onoff  ${stateObj.state === "on" ? 'btn_command-on' : 'btn_command ripple overlay'}" @click=${() => this._media_player_service("toggle")}><ha-icon icon="mdi:power" style="color: red;"</button>
              <button class="vol-up btn_command  ripple overlay" @click=${() => this._media_player_service("volume_up")}><ha-icon icon="mdi:menu-up"</button>
            <!--  <button class="mute btn_command  ripple overlay" @click=${() => this._media_player_service("MUTE")}><ha-icon icon="mdi:stop"</button> -->
              <button class="mute btn_command  ripple overlay" Style="color:${stateObj.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._media_player_service("MUTE")}><span class="${stateObj.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
              <button class="vol-down btn_command  ripple overlay" @click=${() => this._media_player_service("volume_down")}><ha-icon icon="mdi:menu-down" </button>
            </div>
            ` : html`
            `}

          </div>
        </div>
    `;
  }
    
  updated() {}

  _select_source(source) {
    this.hass.callService("media_player", "select_source", {
        entity_id: this.config.entity,
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


  setConfig(config) {
    if (!config.entity) {
        console.log("Invalid configuration");
    }
    this.config = config;
  }
  


  getCardSize() {
    return this.config.entities.length + 1;
  }
  
  static get styles() {
    return css`
    button:focus {outline:0;}

    /*Create ripple effec*/
    
    .ripple {
      position: relative;
      overflow: hidden;
      transform: translate3d(0, 0, 0);
    }
    
    .ripple:after {
      content: "";
      display: block;
      position: absolute;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      background-image: radial-gradient(circle, #7a7f87 2%, transparent 10.01%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10, 10);
      opacity: 0;
      transition: transform .5s, opacity 1s;
    }
    
    .ripple:active:after {
      transform: scale(0, 0);
      opacity: .3;
      transition: 0s;
    }
    .card {
      display: flex;
  //    justify-content: center;
      width: 100%;
      height: 100%;
    }
    .page {
      width:90%;
/*      grid-template-columns:  auto auto auto auto auto;
      grid-template-rows: 528px;
      display: inline-block
      flex-direction: row; 
      display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
      display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
      display: -ms-flexbox;      /* TWEENER - IE 10 */
      display: -webkit-flex;     /* NEW - Chrome */  */
      display: flex;
      align-items: center;
      justify-content: center;
   //   background-color: red;
      margin: auto;
    }
    .grid-container-input-mode {
      display: grid;
      grid-template-columns: auto auto;
      grid-template-rows: 48px auto;
      background-color: transparent;
      width: 100%;
 //     padding: 0px 20px 0px 20px;
 //     margin-bottom: 7px;
      overflow: hidden;
      height: 528px;
    }



    .grid-container-slider-1-command {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: 50px 80px auto 80px 80px 80px;
      height: 528px;
      align-items: center;
      justify-content: center;
      width: 100px;
 //     margin: auto;
 //     padding: 0px 20px 0px 20px;
 //     margin-bottom: 7px;
      overflow: hidden;
      place-items: center;


    }
    .grid-container-slider{
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: 28px 28px 470px;
      height: 548px;
      margin: 10px 5px auto 5px;
      align-items: center;
      justify-content: center;
 //     padding: 0px 20px 0px 20px;
 //     margin-bottom: 7px;
      overflow: hidden;
      place-items: center;

    }


    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      background-color: transparent;
//      margin: 10px;
      overflow: scroll;
      width: 95%;
      margin: auto;
      height: 482px;
    }

    .grid-container::-webkit-scrollbar {
      display: none;
    }
    .grid-container::-webkit-scrollbar {
      -ms-overflow-style: none;
    }
 
    .grid-item {
      // border: 1px solid rgba(0, 0, 0, 0.8);
      overflow: hidden;
      display:flex;
      align-items:center;
      justify-content:center;
      place-items: center;
      padding: 5px;
      
    }

    .onoff { 
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 2;
      grid-row-end: 3;  
    }
    .vol-up{ 
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 4;
      grid-row-end: 5;  
    }

    .mute{ 
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 5;
      grid-row-end: 6;  
    }

    .vol-down{ 
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 6;
      grid-row-end: 7;  
    }

    .item-2 {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 5;
      grid-row-end: 6;  
    }
    
    label {
    font-size: 24px;
    margin: 10px 0px 0px 4%;
    width: 200px;
    }

    .btn_hdmi-sound {
      background-color: var(--remote-button-color);
      color: var(--remote-text-color);
      font-size: 14px;

      width: 120px;
      height: 70px;
      margin: 5px;
      border-width: 0px;
      border-radius: 15px;
      place-items: center;
      display: block;
      cursor: pointer;
      border: solid 2px var(--remote-color);
    }

      .btn_hdmi-sound-on {
      background-color: var(--primary-color);
      color: #ffffff;
      font-size: 14px;
      width: 120px;
      height: 70px;
      border-width: 0px;
      border-radius: 15px;
      place-items: center;
      display: block;
      cursor: pointer;
      
    }

    .btn_command {
      background-color: var(--remote-button-color);
      color: var(--remote-text-color);
      font-size: 14px;
      width: 70px;
      height: 70px;
      border-width: 0px;
      border-radius: 15px;
      place-items: center;
      display: block;
      cursor: pointer;
      margin: 5px;
//      border: solid 2px var(--remote-color);
    }

      .btn_command-on {
      background-color: var(--primary-color);
      color: #ffffff;
      font-size: 14px;
      width: 70px;
      height: 70px;
      border-width: 0px;
      border-radius: 15px;
      place-items: center;
      display: block;
      cursor: pointer;
      margin: 5px;
    }

    .zona1_title {
      font-size: 20px;
      text-align: center;
      margin: 0px;
 
    }
    .range-holder {
      height: var(--slider-height);
      position:relative;
      display: block;
    }
    .range-holder input[type="range"] {
      outline: 0;
      border: solid 2px var(--soft-ui-button-background-color);
      border-radius: var(--ha-card-border-radius);
      width: var(--slider-height);
      margin: 0;
      transition: box-shadow 0.2s ease-in-out;
      -webkit-transform:rotate(270deg);
      -moz-transform:rotate(270deg);
      -o-transform:rotate(270deg);
      -ms-transform:rotate(270deg);
      transform:rotate(270deg);
      overflow: hidden;
      height: var(--slider-width);
      -webkit-appearance: none;
      background: var(--deactive-background-button-color);
      //background: linear-gradient(235deg, rgba(28,122,226,1) 0%, rgba(66,230,222,1) 90%);;
      //background-image: url("/local/lg_remote/provaslider.jpg");
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: relative;
      position: absolute;
      top: calc(50% - (var(--slider-width) / 2));
      right: calc(50% - (var(--slider-height) / 2));
    }
    .range-holder input[type="range"]::-webkit-slider-runnable-track {
      height: var(--slider-width);
      -webkit-appearance: none;
      color: #636363;
      margin-top: -1px;
      transition: box-shadow 0.2s ease-in-out;
    }
    .range-holder input[type="range"]::-webkit-slider-thumb {
      width: 25px;
      border-right:10px solid var(--active-background-button-color);
      border-left:10px solid var(--active-background-button-color);
      border-top:20px solid var(--active-background-button-color);
      border-bottom:20px solid var(--active-background-button-color);
      -webkit-appearance: none;
      height: 80px;
      cursor: ns-resize;
      background: var(--active-background-button-color);
      box-shadow: -350px 0 0 350px var(--active-background-button-color), inset 0 0 0 80px #e3edf7;
      border-radius: 0;
      transition: box-shadow 0.2s ease-in-out;
      position: relative;
      top: calc((var(--slider-width) - 80px) / 2);
    }
    .range-holder input[type="range"].on::-webkit-slider-thumb {
        border-color: #1c7ae2;
        box-shadow: -350px 0 0 350px #1c7ae2, inset 0 0 0 80px #FFF;
    }
    

      
    `;
  }  
  
}

customElements.define('custom-ampli-panel', CustomAmpliPanel);
