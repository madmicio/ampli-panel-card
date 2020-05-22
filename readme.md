### AV Receiver Panel Card


  ```yaml 
  - type: css
    url: /hacsfiles/ampli-panel-card-old/font.css

  - type: module
    url: /hacsfiles/ampli-panel-card-old/ampli-panel-card.js  

  ```
  
  ```yaml
  - badges: []
    cards:
      - entity: media_player.marantz_sr6010
        type: 'custom:ampli-panel-card'
        name: zona 1
        brand: Marantz
        info: AV Surround Receiver SR6010
        zone2: media_player.proiettore
    panel: true
    path: amli
    title: ampli
```
