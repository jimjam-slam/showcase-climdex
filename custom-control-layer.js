/* custom layer control: create a set of (css) dropdowns instead. extends
   https://github.com/Leaflet/Leaflet/blob/master/src/control/Control.Layers.js
   james goldie, feb 2018 */

L.Control.Layers.DropdownSet = L.Control.Layers.include({
  
  options: {
    form_count: 3,
    id_sep: '_'
  },

  /* basically just the L.Control.Layers initialize fn, but it adds my options
     and adds baseLayers from a different location (because my supplied
     baselayers are more complicated) */
  initialize: function(baseLayers, overlays, options) {
    L.setOptions(this, options);

		this._layerControlInputs = [];
		this._layers = [];
		this._lastZIndex = 0;
		this._handlingClick = false;

    // tweaked: add layers from .layers sub-object
		for (var i in baseLayers.layers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
  },
  
  // when this control is added:
  // - initialise the layout,
  // - run the first view update
  // - add _checkDisabledLayers as an event handler for the end of a map zoom
  // - add _onLayerChange as an event handler for each attached layer
  // onAdd: function(map) {
  //   // might only need to actually override these two!
  //   this._initLayout();
	// 	this._update();

	// 	this._map = map;
	// 	map.on('zoomend', this._checkDisabledLayers, this);
    
	// 	for (var i = 0; i < this._layers.length; i++) {
	// 		this._layers[i].layer.on('add remove', this._onLayerChange, this);
	// 	}

	// 	return this._container;
	// },

  _initLayout: function() {
    var className = 'leaflet-control-layers',
		    container = this._container = DomUtil.create('div', className),
        collapsed = this.options.collapsed;
        
    // makes this work on IE touch devices by stopping it from firing a
    // mouseout event when the touch is released
    container.setAttribute('aria-haspopup', true);
    
    // catch events
    DomEvent.disableClickPropagation(container);
    DomEvent.disableScrollPropagation(container);

    // primary form
    var form = this._form = DomUtil.create('form', className + '-list');

    // add event handlers for expanding and collapsing
    // TODO - i don't want the _whole_ set to collapse! just the one form
    if (collapsed)
    {
      // collapse if we click anywhere else
      this._map.on('click', this.collapse, this);

			if (!Browser.android) {
				DomEvent.on(container, {
					mouseenter: this.expand,
					mouseleave: this.collapse
				}, this);
			}
		}

    // the 'button' that expands the control
    var link = this._layersLink =
      DomUtil.create('a', className + '-toggle', container);
		link.href = '#';
    link.title = 'Primary Form';
    // TODO - link contents should have the name of the selection!

    if (Browser.touch)
    {
      // if touching, stop default event on link touch and expand
			DomEvent.on(link, 'click', DomEvent.stop);
			DomEvent.on(link, 'click', this.expand, this);
    } else
    {
      // if no touch, expand when it gains focus (mouse hover already sorted!)
			DomEvent.on(link, 'focus', this.expand, this);
    }
    
    if (!collapsed) {
			this.expand();
    }
    
    // okay, here's the meat of it. creates sections for the base layers, the
    // separator and the overlays (they're not populated with layers here)

    // TODO - i need multiple forms!
    this._baseLayersList = DomUtil.create('div', className + '-base', form);
		this._separator = DomUtil.create('div', className + '-separator', form);
		this._overlaysList = DomUtil.create('div', className + '-overlays', form);
    // append the form to the container
		container.appendChild(form);

  },

  _update: function() {

    // return if this is missing a container
    if (!this._container) { return this; }

    // clear out the present list of baselayers and overlay layers
    DomUtil.empty(this._baseLayersList);
    DomUtil.empty(this._overlaysList);
    
    this._layerControlInputs = [];
    var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;
    
    // iterate through layers:
    // - call addItem on the layer
    // - update trackers of baselayers and overlays
    // - update counter
    for (i = 0; i < this._layers.length; i++)
    {
			obj = this._layers[i];  // populated by _addLayer
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
			baseLayersCount += !obj.overlay ? 1 : 0;
    }
    
    // hide base layers section or overlay section if there's only one layer
		if (this.options.hideSingleBase) {
			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
    }
    this._separator.style.display =
      overlaysPresent && baseLayersPresent ? '' : 'none';

    return this;
  },

  // called by _update! looks like this actually manipulates the dom
  // TODO - lots of work needs to go on here. i need to:
  // (a) have multiple forms ready (see above),
  // (b) decide whether this elements requires new options in the form, and
  // (c) still register the layer, if that's happening
  _addItem: function() {
    
    // dom option components
    var label = document.createElement('label'),
		    checked = this._map.hasLayer(obj.layer),
		    input;

    // create either a checkbox or a radio button for the item
		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

    // 
		this._layerControlInputs.push(input);
		input.layerId = Util.stamp(obj.layer);

    // event handler for selecting the option
		DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		// Helps from preventing layer control flicker when checkboxes are disabled
		// https://github.com/Leaflet/Leaflet/issues/2771
		var holder = document.createElement('div');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);

		this._checkDisabledLayers();
		return label;

  },

  /* also need to override this, since we need to react differently to options
     being selected */
  _onInputClick: function() {

    var inputs = this._layerControlInputs,
		    input, layer;
		var addedLayers = [],
		    removedLayers = [];

		this._handlingClick = true;

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;

			if (input.checked) {
				addedLayers.push(layer);
			} else if (!input.checked) {
				removedLayers.push(layer);
			}
		}

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedLayers.length; i++) {
			if (this._map.hasLayer(removedLayers[i])) {
				this._map.removeLayer(removedLayers[i]);
			}
		}
		for (i = 0; i < addedLayers.length; i++) {
			if (!this._map.hasLayer(addedLayers[i])) {
				this._map.addLayer(addedLayers[i]);
			}
		}

		this._handlingClick = false;

    this._refocusOnMap();
    
  }

});

L.control.layers.dropdownSet = function() {
  return new L.Control.Layers.DropdownSet();
}