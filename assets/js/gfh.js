class GunForHire {

    static init() {
        this.locations = [];
        this.context = $('.menu-hidden[data-type=gfh]');
  
        return Loader.promises['gfh'].consumeJson(data => {
          data.forEach(item => this.locations.push(new GunForHire(item)));
          console.info('%c[Freeroam Missions] Loaded!', 'color: #bada55; background: #242424');
          Menu.reorderMenu('.menu-hidden[data-type=gfh]');
        });
    }

    constructor(preliminary) {
      Object.assign(this, preliminary);
  
      this.layer = L.layerGroup();
  
      this.markers = [];
      this.locations.forEach(item => this.markers.push(new Marker(item.text, item.x, item.y, 'gfh', this.key, item.type)));
  
      this.element = $(`<div class="collectible-wrapper" data-help="item" data-type="${this.key}">`)
        .toggleClass('disabled', !this.onMap)
        .on('click', () => this.onMap = !this.onMap)
        .append($('<p class="collectible">').attr('data-text', `map.gfh.${this.key}.name`))
        .translate();
        
      this.element.appendTo(GunForHire.context);
        
      this.reinitMarker();
  
      if(this.onMap)
        this.layer.addTo(MapBase.map);
    }
  
    reinitMarker() {
      this.layer.clearLayers();
      this.markers.forEach(
        marker => {
          this.layer.addLayer(L.marker([marker.lat, marker.lng], {
            opacity: Settings.opacity  / 3,
            icon: new L.DivIcon.DataMarkup({
              iconSize: [35 * Settings.markerSize, 45 * Settings.markerSize],
              iconAnchor: [17 * Settings.markerSize, 42 * Settings.markerSize],
              popupAnchor: [1 * Settings.markerSize, -29 * Settings.markerSize],
              html: `<div>
                <img class="icon" src="assets/images/icons/gfh.png" alt="Icon">
                <img class="background" src="assets/images/icons/marker_${this.color}.png" alt="Background">
                <img class="shadow" width="${35 * Settings.markerSize}"
                  height="${16 * Settings.markerSize}" src="./assets/images/markers-shadow.png" alt="Shadow">
              </div>`,
              marker: this.key
            })
          })
          .bindPopup(marker.updateMarkerContent(), { minWidth: 300, maxWidth: 400 }));
        }
      );
    }
  
    set onMap(state) {
      this.reinitMarker();
      if (state) {
        this.layer.addTo(MapBase.map);
        this.element.removeClass('disabled');
        localStorage.setItem(`rdo:${this.key}`, 'true');
      } else {
        this.layer.remove();
        this.element.addClass('disabled');
        localStorage.removeItem(`rdo:${this.key}`);
      }
    }
    get onMap() {
      return !!localStorage.getItem(`rdo:${this.key}`);
    }
}