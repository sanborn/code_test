// https://leafletjs.com/reference-1.7.1.html#map-example
// create a rails element called "map"
// specify a default lat, lng for map's initial render

// call buildMap(params = {}) after document ready

var map;
var defaultMapParams = {
  lat: 40,
  lng: -100,
  zoom: 5,
  minZoom: 1,
  maxZoom: 24,
  preferCanvas: true,
  zoomHomeControl: true,
  fullScreenControl: true
}

function buildMap(params = {}) {
  var mapParams = $.extend({}, defaultMapParams, params);

  // initialize map
  map = new L.map("map", {
    zoomControl: false,
    center: [mapParams["lat"], mapParams["lng"]],
    zoom: mapParams["zoom"],
    minZoom: mapParams["minZoom"],
    maxZoom: mapParams["maxZoom"],
    preferCanvas: mapParams["preferCanvas"]
  });

  if(mapParams["zoomHomeControl"])
    map.addControl(new L.Control.zoomHome());

  if(mapParams["fullScreenControl"])
    map.addControl(new L.Control.Fullscreen());
}


/*
 * Leaflet zoom control with a home button for resetting the view.
 *
 * Distributed under the CC-BY-SA-3.0 license. See the file "LICENSE"
 * for details.
 *
 * Based on code by toms (https://gis.stackexchange.com/a/127383/48264).
 */
(function () {
  "use strict";

  L.Control.ZoomHome = L.Control.Zoom.extend({
    options: {
      position: 'topleft',
      zoomInText: '+',
      zoomInTitle: 'Zoom in',
      zoomOutText: '-',
      zoomOutTitle: 'Zoom out',
      zoomHomeIcon: 'home',
      zoomHomeTitle: 'Home',
      homeCoordinates: null,
      homeZoom: null,
      homeBtnHide: false
    },

    onAdd: function (map) {
      var controlName = 'leaflet-control-zoomhome',
        container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
        options = this.options;

      if (options.homeCoordinates === null) {
        options.homeCoordinates = map.getCenter();
      }
      if (options.homeZoom === null) {
        options.homeZoom = map.getZoom();
      }

      this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
        controlName + '-in', container, this._zoomIn.bind(this));
      var zoomHomeText = '<i class="fa fa-' + options.zoomHomeIcon + '" style="line-height:1.65;"></i>';


      if(options.homeBtnHide === false ){
        this._zoomHomeButton = this._createButton(zoomHomeText, options.zoomHomeTitle,
          controlName + '-home', container, this._zoomHome.bind(this));
      }

     this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
        controlName + '-out', container, this._zoomOut.bind(this));

      this._updateDisabled();
      map.on('zoomend zoomlevelschange', this._updateDisabled, this);

      // add reference of this control to map
      map.sanbornZoomControl = this;
      return container;
    },

    _zoomHome: function (e) {
      //jshint unused:false
      this._map.setView(this.options.homeCoordinates, this.options.homeZoom);
    }
  });

  L.Control.zoomHome = function (options) {
    return new L.Control.ZoomHome(options);
  };

  // L.Control.ZoomDisplay shows the current map zoom level
  L.Control.ZoomDisplay = L.Control.Zoom.extend({
    options: {
      position: 'topleft'
    },

    onAdd: function (map) {
      this._map = map;
      this._container = L.DomUtil.create('div', 'leaflet-control-zoom-display leaflet-bar-part leaflet-bar');
      this.updateMapZoom(map.getZoom());
      map.on('zoomend', this.onMapZoomEnd, this);
      return this._container;
    },

    onRemove: function (map) {
      map.off('zoomend', this.onMapZoomEnd, this);
    },

    onMapZoomEnd: function (e) {
      this.updateMapZoom(this._map.getZoom());
    },

    updateMapZoom: function (zoom) {
      this._container.innerHTML = zoom;
    }
  });

  L.Map.mergeOptions({
    zoomDisplayControl: true
  });

  L.Map.addInitHook(function () {
    if (this.options.zoomDisplayControl) {
      this.zoomDisplayControl = new L.Control.ZoomDisplay();
      this.addControl(this.zoomDisplayControl);
    }
  });

  L.control.zoomDisplay = function (options) {
    return new L.Control.ZoomDisplay(options);
  };

}());

// Full screen
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['leaflet'], factory);
  } else if (typeof module !== 'undefined') {
    // Node/CommonJS
    module.exports = factory(require('leaflet'));
  } else {
    // Browser globals
    if (typeof window.L === 'undefined') {
      throw new Error('Leaflet must be loaded first');
    }
    factory(window.L);
  }
}(function (L) {
  L.Control.Fullscreen = L.Control.extend({
    options: {
      position: 'topleft',
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      }
    },

    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

      this.link = L.DomUtil.create('a', 'fa fa-arrows-alt fa-lg leaflet-control-fullscreen-button leaflet-bar-part', container);
      this.link.href = '#';

      this._map = map;
      this._map.on('fullscreenchange', this._toggleTitle, this);
      this._toggleTitle();

      L.DomEvent.on(this.link, 'click', this._click, this);

      return container;
    },

    _click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      this._map.toggleFullscreen(this.options);
    },

    _toggleTitle: function() {
      this.link.title = this.options.title[this._map.isFullscreen()];
    }
  });

  L.Map.include({
    isFullscreen: function () {
      return this._isFullscreen || false;
    },

    toggleFullscreen: function (options) {
      var container = this.getContainer();
      if (this.isFullscreen()) {
        if (options && options.pseudoFullscreen) {
          this._disablePseudoFullscreen(container);
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else {
          this._disablePseudoFullscreen(container);
        }
      } else {
        if (options && options.pseudoFullscreen) {
          this._enablePseudoFullscreen(container);
        } else if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        } else {
          this._enablePseudoFullscreen(container);
        }
      }
    },

    _enablePseudoFullscreen: function (container) {
      L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
      this._setFullscreen(true);
      this.fire('fullscreenchange');
    },

    _disablePseudoFullscreen: function (container) {
      L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
      this._setFullscreen(false);
      this.fire('fullscreenchange');
    },

    _setFullscreen: function(fullscreen) {
      this._isFullscreen = fullscreen;
      var container = this.getContainer();
      if (fullscreen) {
        $('.leaflet-control-fullscreen-button').removeClass('fa-arrows-alt');
        $('.leaflet-control-fullscreen-button').addClass('fa-compress');
        L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
      } else {
        $('.leaflet-control-fullscreen-button').addClass('fa-arrows-alt');
        $('.leaflet-control-fullscreen-button').removeClass('fa-compress');
        L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
      }
      this.invalidateSize();
    },

    _onFullscreenChange: function (e) {
      var fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
        this._setFullscreen(true);
        this.fire('fullscreenchange');
      } else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
        this._setFullscreen(false);
        this.fire('fullscreenchange');
      }
    }
  });

  L.Map.mergeOptions({
    fullscreenControl: false
  });

  L.Map.addInitHook(function () {
    if (this.options.fullscreenControl) {
      this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
      this.addControl(this.fullscreenControl);
    }

    var fullscreenchange;

    if ('onfullscreenchange' in document) {
      fullscreenchange = 'fullscreenchange';
    } else if ('onmozfullscreenchange' in document) {
      fullscreenchange = 'mozfullscreenchange';
    } else if ('onwebkitfullscreenchange' in document) {
      fullscreenchange = 'webkitfullscreenchange';
    } else if ('onmsfullscreenchange' in document) {
      fullscreenchange = 'MSFullscreenChange';
    }

    if (fullscreenchange) {
      var onFullscreenChange = L.bind(this._onFullscreenChange, this);

      this.whenReady(function () {
        L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
      });

      this.on('unload', function () {
        L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
      });
    }
  });

  L.control.fullscreen = function (options) {
    return new L.Control.Fullscreen(options);
  };
}));
