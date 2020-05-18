var LitElement = LitElement || Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
var html = LitElement.prototype.html;
var css = LitElement.prototype.css;

class AmpliPanelCard extends LitElement {

    static get properties() {
        return {
            hass: {},
            config: {},
            active: {},
            _show_inputs: {},
            _show_sound_output: {}
        };
    }

    constructor() {
        super();
        this._show_sound_output = false;
        this._show_inputs = false;
    }

    render() {
        const stateObj = this.hass.states[this.config.entity];
        const stateObj2 = this.hass.states[this.config.zone2];
        const coverWidth = this.config.coverWidth ? this.config.coverWidth : "70px";
        const coverHeight = this.config.coverHeight ? this.config.coverHeight : "465px";


        const state1on = this.config.entity && !["off", "idle"].includes(stateObj.state);
        const state2on = this.config.zone2 && !["off", "idle"].includes(stateObj2.state);
        return html`
        <div class="card">
          <div class="page">
            ${this.config.zone2 ? html`
              <div class="grid-container-power" style="${state2on ? 'width: 120px;' : 'width: 280px;'}">
                <button style="border-radius:50%;" class="power ${state1on ? 'btn btn_command-on ' : 'btn btn_command  ripple  '}" @click=${() => this._media_player_service("toggle")}><ha-icon icon="mdi:power" style="color: ${state1on ? '#00d2ff' : 'red'};"</button>
                <button style="border-radius:50%;" class="zone2-power ${state2on ? 'btn btn_command-on ' : 'btn btn_command ripple  '}" style="border-radius:50%; height: 60px; width: 60px; color: ${state2on ? 'white' : 'red'}" @click=${() => this._media_player_service_zone2("toggle")}>zone2</button>
                <button style="border-radius:50%; height: 60px; width: 60px;" class="input btn btn_command  ripple  " @click=${() => this._show_hide_inputs()}>INPUT</button>
                <button style="border-radius:50%; height: 60px; width: 60px;" class="sound btn btn_command  ripple  " @click=${() => this._show_hide_sound_mode()}>SOUND</button>
                <svg style="transform: scale(0.55);" class="text-zone" version="1.1" id="Livello_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 150 20" style="enable-background:new 0 0 150 20;" xml:space="preserve">
                  <style type="text/css">
                  .st0{fill:rgba(189, 193, 198, 0.3);stroke:rgba(189, 193, 198, 0.3);stroke-miterlimit:10;}
                  .st1{fill:rgba(189, 193, 198, 0.3);}
                  .st2{font-family:'MyriadPro-Regular';}
                  .st3{font-size:20px;}
                  </style>
                  <line class="st0" x1="35.5" y1="8.6" x2="50.5" y2="8.6"/>
                  <text transform="matrix(1 0 0 1 54.7401 13.87)" class="st1 st2 st3">zone</text>
                  <line class="st0" x1="36" y1="8.1" x2="36" y2="18.8"/>
                  <line class="st0" x1="114.2" y1="8.1" x2="114.2" y2="18.8"/>
                  <line class="st0" x1="99.5" y1="8.6" x2="114.5" y2="8.6"/>
                </svg>
                <div class="zone-btn">    
                  <button class="btn btn_zone   ripple  " style="margin-right:20px;" @click=${() => this._media_player_service("volume_down")}>1</button>
                  <button class="btn btn_zone   ripple  " style="margin-left:20px;" @click=${() => this._media_player_service("volume_down")}>2</button>
                </div>
            </div>
        ` : html`
          <div class="grid-container-power" style="width: 280px;">
            <button style="border-radius:50%;" class="power ${state1on ? 'btn btn_command-on' : 'btn btn_command ripple  '}" @click=${() => this._media_player_service("toggle")}><ha-icon icon="mdi:power" style="color: ${state1on ? '#00d2ff' : 'red'};"</button>
            <button style="border-radius:50%; height: 60px; width: 60px;" class="input btn btn_command  ripple  " @click=${() => this._show_hide_inputs()}>INPUT</button>
            <button style="border-radius:50%; height: 60px; width: 60px;" class="sound btn btn_command  ripple  " @click=${() => this._show_hide_sound_mode()}>SOUND</button>
          </div>
        `}

<!-- ################################################################ CENTRAL COLUMN ############################################################ -->
            <div class="central-column">
                                    
            <div class="central-column-display"  style="height: 210px;">
                <div class="grid-container-display">
                ${state1on ? html`
                  <label class="upper-display-text">mode:</label>
                  <label class="upper-display-text-light">${stateObj.attributes.sound_mode}</label>
                  <label class="upper-display-text">type:</label>
                  <label class="upper-display-text-light" >${stateObj.attributes.media_content_type}</label>
                ` : html`
                `}
                  <label class="display-vol">${state1on ? (stateObj.attributes.volume_level * 100) : ' '}</label>
                  ${this.config.zone2 ? html`
                  <label class="upper-display-text">zone 2:</label>
                  <label class="upper-display-text-light">${state2on ? Math.round(stateObj2.attributes.volume_level * 100) : 'off'}</label>
                  ` : html`
                  `}
                </div>
                ${stateObj.attributes.source === "Tuner" ? html`
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
                  <label style="margin: auto;" class="lower-display-text-light">${stateObj.attributes.media_artist} ${stateObj.attributes.media_title}</label>
                  <div class="bar_value" style="width:${100 * ((stateObj.attributes.media_title - 88) / (108 - 88))}%;">|</div>
                </div>
              ` : html`
                <label class="display-text title">${state1on ? stateObj.attributes.source : 'MAIN OFF'}</label>
                <label class="display-text title">${stateObj.attributes.sound_mode_raw}</label>
                `}
            </div>

            ${this._show_inputs ? html`
<!-- ######################################################### INPUTS PANEL ################################ -->
            <div class="media-content-panel inset">
            <div class="grid-container">
              ${stateObj.attributes.source_list.map(source => html`
              <button class="${stateObj.attributes.source === source ? 'btn btn_hdmi-sound-on' : 'btn btn_hdmi-sound ripple'}" @click=${() => {
            this._select_source(source);
            this._show_inputs = false;
            }}}>${source}</button>
              `)}
            </div> 
            </div>
            ` : html`
            ${this._show_sound_output ? html`
<!-- ######################################################### SOUND PANEL ################################ -->
            <div class="media-content-panel inset">
            <div class="grid-container">
              ${stateObj.attributes.sound_mode_list.map(sound => html`
              <button class="${stateObj.attributes.sound_mode === sound ? 'btn btn_hdmi-sound-on' : 'btn btn_hdmi-sound  ripple'}" @click=${() => {
            this._select_sound_mode(sound);
            this._show_sound_output = false;
            }}}>${sound}</button>
              `)}
            </div> 
            </div>
            ` : html`
<!-- ######################################################### MEDIA-CONTROL PANEL ################################ -->
${stateObj.attributes.source === "Spotify" ? html`
            <div class="media-content-panel inset">
              <div class="central-column-display" style="height: 110px; margin: 15px; width: 620px;"> 
                <div class="grid-container-media-content">
                  <label class="upper-display-text">title:</label>
                  <label class="lower-display-text-light">${stateObj.attributes.media_title}</label>
                  <label class="upper-display-text">album:</label>
                  <label class="lower-display-text-light">${stateObj.attributes.media_album_name}</label>
                  <label class="upper-display-text">artist:</label>
                  <label class="lower-display-text-light">${stateObj.attributes.media_artist}</label>
                  <img class="display-image" src="${stateObj.attributes.entity_picture}" width="90" height="90">
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
              <p class="brand-text">Marantz SR6010</p>
              </div>
                `}
              `}
            `}
            </div>
          
<!-- ######################################################### Rigth Column ################################ -->
            ${this.config.zone2 ? html`  
            ${state1on ? html`  
            <div class="section-slider" style="${state2on ? 'margin: 0px 10px 0px 25px;' : 'margin: 0px 30px 0px 30px;'}">  
                    
                    <div class="grid-container-slider-1-command">
                      <p class="onoff zona-title">${this.config.name || stateObj.attributes.friendly_name}</p>
                      <button class="vol-up btn btn_command  ripple" @click=${() => this._media_player_service("volume_up")}><ha-icon icon="mdi:menu-up"</button>
                      <button class="mute btn btn_command  ripple  " Style="color:${stateObj.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._media_player_toggle_mute(stateObj)}><span class="${stateObj.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
                      <button class="vol-down btn btn_command  ripple  " @click=${() => this._media_player_service("volume_down")}><ha-icon icon="mdi:menu-down" </button>
                    </div>

                    <div class="grid-item" style="width: calc(${coverWidth} + 20px);">
                        <div class="range-holder" style="--slider-height: ${coverHeight}; --slider-width: ${coverWidth}">
                        <input type="range" class="${stateObj.state}" style="--slider-width: ${coverWidth};--slider-height: ${coverHeight};" .value="${state1on ? Math.round(stateObj.attributes.volume_level * 100) : 0}" @change=${e => this._volume_set(stateObj, e.target.value)}>
                      </div> 
                    </div> 

                ${state2on ? html`
                    <div class="grid-item" style="width: calc(${coverWidth} + 20px);">
                        <div class="range-holder" style="--slider-height: ${coverHeight}; --slider-width: ${coverWidth}">
                        <input type="range" class="${stateObj2.state}" style="--slider-width: ${coverWidth};--slider-height: ${coverHeight};" .value="${state2on ? Math.round(stateObj2.attributes.volume_level * 100) : 0}" @change=${e => this._volume_set(stateObj2, e.target.value)}>
                    </div>    
                    </div> 
                    <div class="grid-container-slider-1-command">
                      <p class="onoff zona-title">${this.config.name_zona2 || stateObj2.attributes.friendly_name}</p>
                      <button class="vol-up btn btn_command ripple  " @click=${() => this._media_player_service("volume_up")}><ha-icon icon="mdi:menu-up"</button>
                      <button class="mute btn btn_command ripple  " Style="color:${stateObj.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._media_player_toggle_mute(stateObj2)}><span class="${stateObj2.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
                      <button class="vol-down btn btn_command ripple  " @click=${() => this._media_player_service("volume_down")}><ha-icon icon="mdi:menu-down" </button>
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
                        <p class="onoff zona-title">${this.config.name || stateObj.attributes.friendly_name}</p>
                        <button class="vol-up btn btn_command  ripple  " @click=${() => this._media_player_service("volume_up")}><ha-icon icon="mdi:menu-up"</button>
                        <button class="mute btn btn_command  ripple  " Style="color:${stateObj.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._media_player_toggle_mute(stateObj)}><span class="${stateObj.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
                        <button class="vol-down btn btn_command  ripple  " @click=${() => this._media_player_service("volume_down")}><ha-icon icon="mdi:menu-down" </button>
                      </div>
                      <div class="grid-item" style="width: calc(${coverWidth} + 20px);">
                          <div class="range-holder" style="--slider-height: ${coverHeight}; --slider-width: ${coverWidth}">
                          <input type="range" class="${stateObj.state}" style="--slider-width: ${coverWidth};--slider-height: ${coverHeight};" .value="${state1on ? Math.round(stateObj.attributes.volume_level * 100) : 0}" @change=${e => this._volume_set(stateObj, e.target.value)}>
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

    updated() {
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
            is_volume_muted: !stateObj.attributes.is_volume_muted
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
          width: 100%;
          height: 100%;
      
        }
        .page {
          display: inline-block
          flex-direction: row;
          display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
          display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
          display: -ms-flexbox;      /* TWEENER - IE 10 */
          display: -webkit-flex;     /* NEW - Chrome */  */
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: black;
          background-image: url("/hacsfiles/ampli-panel-card/alu6.jpg");
          margin:30px auto 50px auto;
          height: 500px;
          padding-right: 20px;
          padding: 30px;
          border: solid 2px black;
        }
      
      
        .grid-container-power {
          display: grid;
          grid-template-columns: 120px;
          grid-template-rows: 80px auto 60px 80px 80px 80px 32px 48px;
          height: 478px;
          align-items: center;
          justify-content: center;
          place-items: center;
          grid-template-areas:
            "power"
            "."
            "zone2-title"
            "zone2-power"
            "input"
            "sound"
            "label"
            "zone-btn";
        }
      
      
        .grid-container-input-mode {
          display: grid;
          grid-template-columns: auto auto;
          grid-template-rows: 48px auto;
          background-color: transparent;
          width: 100%;
          overflow: hidden;
          height: 528px;
        }
      
        .grid-container-media-content {
          display: grid;
          grid-template-columns: 65px 425px 90px;
          grid-template-rows: 30px 30px 30px;
          background-color: transparent;
          margin:auto;
          margin-top: 20px;
        }
      
        .grid-container-display {
          display: grid;
          grid-template-columns: 65px 200px 50px 200px 100px;
          grid-template-rows: 30px 30px;
          background-color: transparent;
          margin:auto;
          margin-top: 20px;
          grid-template-areas:
            "mode dmode type dtype vol"
            "zone2 zone2vol . . vol";
        }
      
        .section-slider {
          display: inline-block
          flex-direction: row;
          display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
          display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
          display: -ms-flexbox;      /* TWEENER - IE 10 */
          display: -webkit-flex;     /* NEW - Chrome */  */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0px 10px 0px 10px;
          background-color: transparent;
          border-radius: 15px;
          box-shadow: inset 4px 4px 4px #020202,
          inset -4px -4px 2px #212121;
          height: 498px;
        }
      
        .section-btn-vol {
          width:186px;
                display: inline-block
                flex-direction: row;
                display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
                display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
                display: -ms-flexbox;      /* TWEENER - IE 10 */
                display: -webkit-flex;     /* NEW - Chrome */  */
                display: flex;
                align-items: center;
                justify-content: center;
      
                padding: 0px 10px 0px 10px;
                background-color: transparent;
                border-radius: 15px;
                height: 498px;
                margin: 0px 30px 0px 30px;
      
              }
      
        .grid-container-slider-1-command {
          display: grid;
          grid-template-columns: auto;
          grid-template-rows: 80px auto 80px 80px 80px;
          height: 478px;
          align-items: center;
          justify-content: center;
          width: 85px;
          overflow: hidden;
          place-items: center;
        }
      
      
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          background-color: transparent;
          overflow: scroll;
          width: 95%;
          margin: auto;
          height: 210px;
        }
      
        .grid-container-media-control {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          grid-template-rows: 1fr ;
          background-color: transparent;
          width: 500px;
          height: 50px;
          margin: auto;
          overflow: hidden;
          }
      
        .grid-container::-webkit-scrollbar {
          display: none;
        }
        .grid-container::-webkit-scrollbar {
          -ms-overflow-style: none;
        }
      
        .grid-item {
          overflow: hidden;
          display:flex;
          align-items:center;
          justify-content:center;
          place-items: center;
          padding: 5px;
          width: 150px;
        }
      
      
        .tuner-panel {
         display: grid;
         background-color: black;
         grid-template-rows: 75px 40px;
         grid-template-areas:
          "tuner-disp"
          "tuner-info";
        }
        .tuner-number {
          grid-template-columns: 50px auto 50px auto 50px auto 50px auto 50px;
          display: grid;
          grid-template-rows: auto;
          background-color: transparent;
          margin:auto;
          width: 610px;
          grid-template-areas:
          "fm88 . fm97 . fm98 . fm102 . fm108";
          font-family: displayFont;
      
        }
        .tuner-display {
          display: flex;
          flex-direction: column;
          grid-area: tuner-disp;
          padding: 0 20px 0 20px;
          width: 610px;
        }
        .bar_value {
        background-color: transparent;
        height: 100%;
        font-size: 60px;
        text-align: right;
        grid-area: tuner-disp;
        color: #00d2ff;
        text-shadow: 0 0 10px rgba(0,210,255, 0.5), 0 0 25px #00d2ff;
        opacity: 0.8;
            }
      
        .fm-text-light {
          font-size: 12px;
          text-align: center;
          color: #00d2ff;
          text-shadow: 0 0 10px rgba(0,210,255, 0.5), 0 0 25px #00d2ff;
        }
      
        .central-column {
          display: flex;
          flex-direction: column;
          padding: 0px 20px 0px 20px;
        }
      
        .media-content-panel {
          margin-top:20px;
          display: flex;
          flex-direction: column;
          background-color: transparent;
        }
      
        .inset {
          height: 240px;
          box-shadow: inset 4px 4px 4px #020202,
          inset -4px -4px 2px #212121;
        }
      
        .double-border {
          border: double 5px #020202;
          height: 230px;
        }
      
        .central-column-display {
          display: flex;
          flex-direction: column;
          border: 2px solid #361a1a;
          padding-bottom: 20px;
          background: rgb(0,0,0);
          background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(17,17,17,1) 48%, rgba(0,0,0,1) 61%, rgba(0,0,0,1) 100%);
          width: 650px;
        }
      
        .upper-display-text-light {
          font-size: 18px;
          text-align: left;
          color: #00d2ff;
          text-shadow: 0 0 10px rgba(0,210,255, 0.5), 0 0 25px #00d2ff;
          font-family: 'displayFont';
        }
        .lower-display-text-light {
          font-size: 18px;
          text-align: center;
          color: #00d2ff;
          text-shadow: 0 0 20px #00d2ff, 0 0 20px #00d2ff;
          font-family: ledFont;
        }
      
        .upper-display-text {
          font-size: 18px;
          text-align: left;
          color: grey;
          font-family: 'displayFont';
        }
      
        .brand-text {
        margin-top: 160px;
          padding: 20px;
          font-size: 22px;
          text-align: left;
          background-image:
          -webkit-repeating-linear-gradient(top,
            hsla(0,0%,100%,0) 0%,
            hsla(0,0%,100%,0) 3%,
            hsla(0,0%,100%,.1) 4.5%),
          -webkit-repeating-linear-gradient(top, 
            hsla(0,0%,0%,0) 0%,
            hsla(0,0%,0%,0) 2%,
            hsla(0,0%,0%,.03) 2.5%),
          -webkit-repeating-linear-gradient(top,
            hsla(0,0%,100%,0) 0%,
            hsla(0,0%,100%,0) 0.6%,
            hsla(0,0%,100%,.15) 1.2%),
          linear-gradient(80deg,
            #a6a6a6 0%,
            #d9d9d9 45%,
            #e0e0e0 55%,
            #e0e0e0 65%,
            #d9d9d9 75%,
            #a6a6a6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'futura';
          color: #fff;
        }
      
        .title {
          font-size: 36px;
          width: 610px;
        }
        .display-text{
          font-family: 'ledFont';
          text-align: center;
          color: #00d2ff;
          text-shadow: 0 0 10px rgba(0,210,255, 0.5), 0 0 25px #00d2ff;
        }
      
        .power {
          grid-area: power;
        }
        .zone2-title {
          grid-area: zone2-title;
        }
        .zone2-power {
          grid-area: zone2-power;
        }
        .input {
          grid-area: input;
        }
        .sound {
          grid-area: sound;
        }
        .text-zone {
          grid-area: label;
        }
        .zone-btn {
          grid-area: zone-btn;
          display: flex;
          width: 100%;
        }
        .display-mode {
          grid-area: mode;
          }
        .display-$mode {
          grid-area: $mode;
          }
        .display-$type {
          grid-area: $type;
          }
        .display-image {
          grid-column-start: 3;
          grid-column-end: 4;
          grid-row-start: 1;
          grid-row-end: 4;
          border: 1px solid #00d2ff;
        }
        .display-vol {
          grid-column-start: 5;
          grid-column-end: 6;
          grid-row-start: 1;
          grid-row-end: 3;
          font-family: 'displayFont';
          text-shadow: 0 0 10px rgba(0,210,255, 0.5), 0 0 15px #00d2ff;
          font-size: 60px;
          color: #00d2ff;
      
          }
      
        .onoff {
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 1;
          grid-row-end: 2;
        }
        .vol-up{
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 3;
          grid-row-end: 4;
        }
      
        .mute{
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 4;
          grid-row-end: 5;
        }
      
        .vol-down{
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 5;
          grid-row-end: 6;
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
        }
      
        .btn_hdmi-sound {
          color: #BDC1C6;
          font-size: 12px;
          width: 140px;
          height: 30px;
          margin: auto;
          border-radius: 15px;
          border-width: 1px;
          background-color: rgba( 0,0,0,0.3);
          border-width: 1px;
        }
      
          .btn_hdmi-sound-on {
            background-color: rgba( 0,0,0,0.3);
            color: #00d2ff;
            text-shadow: 0 0 10px rgba(0,210,255, 0.5), 0 0 15px #00d2ff;
          font-size: 12px;
          width: 140px;
          height: 30px;
          margin: auto;
          border-radius: 15px;
          border-width: 1px;
      
      
        }
      
        .btn_zone {
          background-color: #262628;
          color: #BDC1C6;
          font-size: 14px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: auto;
          border-width: 1px;
          background-image: url("/hacsfiles/ampli-panel-card/btn1.jpg");
          background-position: center;
        }
        .btn_command {
          color: #BDC1C6;
          font-size: 12px;
          width: 70px;
          height: 70px;
          border-width: 2px;
          background-image: url("/hacsfiles/ampli-panel-card/btn1.jpg");
          background-position: center; 
          border-radius: 15px;
      
          margin: 5px;
      //      border: solid 2px var(--remote-color);
        }
      
          .btn_command-on {
          background-image: url("/hacsfiles/ampli-panel-card/btn1.jpg");
          background-position: center; 
          color: #ffffff;
          font-size: 12px;
          width: 70px;
          height: 70px;
          border-radius: 15px;
          margin: 5px;
          border-width: 1px;
        }
      
        .btn-vol {
          background-color: black;
          background-image: url("/hacsfiles/ampli-panel-card/vol1.jpg");
      /*    background-repeat: no-repeat;
          background-attachment: fixed; */
          background-position: center; 
          border-width: 4px;
          width: 165px;
          height: 165px;
          border-radius: 50%;
          margin: auto;
          margin-top: 40px;
      
        }
      
        .btn {
      //      background-color: #333336;
          place-items: center;
          display: block;
          cursor: pointer;
          
      //     border: 1px solid red;
          border-color: black;
        }
      
        .btn-flat {
          background-color: #262628;
          color: #BDC1C6;
          font-size: 18px;
          border-radius: 15px;
          margin: auto;
          cursor: pointer;
          width: 70%;
          height: 65%;
          border-width: 1px;
        }
      
        .zona-title {
          font-size: 16px;
          text-align: center;
          margin-top: 0px;
          margin: auto;
          color: rgba(189, 193, 198, 0.3);
      
        }
        .range-holder {
          height: var(--slider-height);
          position:relative;
          display: block;
      
        }
        .range-holder input[type="range"] {
          outline: 0;
          box-shadow:  -2px 2px 4px #0d0d0d,
                 2px -2px 2px #212121;
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
          background: #121212;
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
          border-right:10px solid #262628;
          border-left:10px solid #262628;
          border-top:20px solid #262628;
          border-bottom:20px solid #262628;
          -webkit-appearance: none;
          height: 80px;
          cursor: ns-resize;
          background: #262628;
          box-shadow: -350px 0 0 350px #262628, inset 0 0 0 80px #e3edf7;
          border-radius: 0;
          transition: box-shadow 0.2s ease-in-out;
          position: relative;
          top: calc((var(--slider-width) - 80px) / 2);
        }
        .range-holder input[type="range"].on::-webkit-slider-thumb {
            border-color: #262628;
            box-shadow: -350px 0 0 350px #262628, inset 0 0 0 80px #BDC1C6;
        }
      
      
      
        `;
        }
      
      }

customElements.define('ampli-panel-card', AmpliPanelCard);
