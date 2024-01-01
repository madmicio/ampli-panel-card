export const CARD_VERSION = "v@AV Receiver Panel CArd@";
export const CARD_TAG_NAME = "ampli-panel-card";
export const EDITOR_CARD_TAG_NAME = "ampli-panel-editor";
const avreceivers = {
    "anthemav": {
      "friendlyName": "Anthem A/V Receivers",
      "name": "Anthem",
    },
    "arcam_fmj": {
      "friendlyName": "Arcam FMJ Receivers",
      "name": "Arcam",
    },
    "denonavr": {
      "friendlyName": "Denon, Marantz A/V Receivers",
      "name": "Marantz",
    },
    "heos": {
      "friendlyName": "Denon heos A/V Receivers",
      "name": "Denon",
    },
    "harman_kardon_avr": {
      "friendlyName": "Harman Kardon AVR",
      "name": "Harman Kardon",
    },
    "monoprice": {
      "friendlyName": "Monoprice 6-Zone Amplifier",
      "name": "Monoprice",
    },
    "onkyo": {
      "friendlyName": "Onkyo A/V Receivers",
      "name": "Onkyo",
    },
    "sonos": {
      "friendlyName": "Sonos",
      "name": "Sonos",
    },
    "pws66i": {
      "friendlyName": "Soundavo WS66i 6-Zone Amplifier",
      "name": "Soundavo",
    },
    "yamaha_ynca": {
      "friendlyName": "Yamaha Network Receivers",
      "name": "Yamaha",
    },
  }
  
  export const AvReceiverdevicemap = new Map(Object.entries(avreceivers));