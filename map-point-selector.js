(function ($, H5PEditor) {
  'use strict';

  var DEFAULT_CENTER = {
    lat: -14.2350,
    lng: -51.9253,
    zoom: 4
  };

  /**
   * Custom editor widget constructor.
   * H5P calls this function when rendering the semantics field configured
   * to use this widget.
   *
   * @param {object} parent Parent form item from the H5P editor.
   * @param {object} field Field definition from semantics.
   * @param {object} params Current stored value for the field.
   * @param {function} setValue H5P callback used to persist widget data.
   */
  H5PEditor.MapPointSelector = function (parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params || {};
    this.setValue = setValue;

    this.$wrapper = null;
    this.$mapContainer = null;
    this.$coordinates = null;
    this.map = null;
    this.marker = null;

    this.defaultCenter = {
      lat: DEFAULT_CENTER.lat,
      lng: DEFAULT_CENTER.lng
    };

    this.zoom = DEFAULT_CENTER.zoom;

    var latitude = this.getNumericValue(this.params.latitude);
    var longitude = this.getNumericValue(this.params.longitude);

    this.hasInitialCoordinates = latitude !== null && longitude !== null;
    this.currentCenter = this.hasInitialCoordinates ?
      { lat: latitude, lng: longitude } :
      this.defaultCenter;
  };

  /**
   * Converts any stored value into a usable number.
   *
   * @param {*} value
   * @returns {number|null}
   */
  H5PEditor.MapPointSelector.prototype.getNumericValue = function (value) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  /**
   * Renders the widget inside the editor form.
   * appendTo is the main H5PEditor integration point for placing custom UI
   * into the field wrapper provided by the editor.
   *
   * @param {jQuery} $wrapper
   */
  H5PEditor.MapPointSelector.prototype.appendTo = function ($wrapper) {
    var self = this;

    self.$wrapper = $('<div class="h5p-editor-map-point-selector"></div>');
    self.$mapContainer = $('<div class="editor-map-container" aria-label="Mapa Interativo"></div>');
    self.$coordinates = $('<div class="editor-map-coordinates">Latitude: -, Longitude: -</div>');

    self.$wrapper
      .append(self.$mapContainer)
      // Aproveitei para traduzir a mensagem de ajuda para os seus usuários
      .append('<div class="editor-map-help">Clique no mapa para definir as coordenadas do ponto.</div>')
      .append(self.$coordinates);

    $wrapper.append(self.$wrapper);

    // Como o Leaflet agora é carregado nativamente via library.json (preloadedJs),
    // a variável global L já estará disponível no momento que o widget renderizar.
    if (window.L && typeof window.L.map === 'function') {
      self.initializeMap();
    } else {
      self.$wrapper.append('<div class="h5p-errors">Erro: A biblioteca Leaflet não foi carregada. Verifique as dependências no library.json.</div>');
    }
  };

  /**
   * Builds the Leaflet map.
   */
  H5PEditor.MapPointSelector.prototype.initializeMap = function () {
    var self = this;

    if (self.map) {
      return;
    }

    self.map = window.L.map(self.$mapContainer.get(0), {
      center: [self.currentCenter.lat, self.currentCenter.lng],
      zoom: self.zoom
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(self.map);

    if (self.hasInitialCoordinates) {
      self.setMarker(self.currentCenter.lat, self.currentCenter.lng);
      self.updateCoordinatesLabel(self.currentCenter.lat, self.currentCenter.lng);
    }

    self.map.on('click', function (event) {
      var lat = event.latlng.lat;
      var lng = event.latlng.lng;

      self.setMarker(lat, lng);
      self.updateValue(lat, lng);
      self.updateCoordinatesLabel(lat, lng);
    });

    // H5P editor forms can be hidden during initial render, so Leaflet needs
    // a delayed size recalculation after the container becomes visible.
    setTimeout(function () {
      if (self.map) {
        self.map.invalidateSize();
      }
    }, 0);

    setTimeout(function () {
      if (self.map) {
        self.map.invalidateSize();
      }
    }, 250);
  };

  /**
   * Creates or repositions the marker used to represent the selected point.
   *
   * @param {number} lat
   * @param {number} lng
   */
  H5PEditor.MapPointSelector.prototype.setMarker = function (lat, lng) {
    if (!this.marker) {
      this.marker = window.L.marker([lat, lng]).addTo(this.map);
      return;
    }

    this.marker.setLatLng([lat, lng]);
  };

  /**
   * Persists the group value back into the H5P editor state.
   * This is the key integration point with the H5PEditor data model.
   *
   * @param {number} lat
   * @param {number} lng
   */
  H5PEditor.MapPointSelector.prototype.updateValue = function (lat, lng) {
    this.params.latitude = lat;
    this.params.longitude = lng;

    this.setValue(this.field, this.params);
  };

  /**
   * Updates the helper label with the current coordinates.
   *
   * @param {number} lat
   * @param {number} lng
   */
  H5PEditor.MapPointSelector.prototype.updateCoordinatesLabel = function (lat, lng) {
    this.$coordinates.text(
      'Latitude: ' + lat.toFixed(6) + ', Longitude: ' + lng.toFixed(6)
    );
  };

  /**
   * Minimal validation hook required by H5PEditor widgets.
   *
   * @returns {boolean}
   */
  H5PEditor.MapPointSelector.prototype.validate = function () {
    return true;
  };

  // Registering the widget in H5PEditor.widgets is what allows a semantics
  // field to reference this implementation by widget name.
  H5PEditor.widgets.mapPointSelector = H5PEditor.MapPointSelector;
  H5PEditor.widgets.MapPointSelector = H5PEditor.MapPointSelector;
})(H5P.jQuery, H5PEditor);