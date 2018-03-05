/* custom layer control: create a set of (css) dropdowns instead. extends
   https://github.com/Leaflet/Leaflet/blob/master/src/control/Control.Layers.js
   james goldie, feb 2018 */

/* utils: TODO - move fn to external file */



L.Control.Layers.ComboBaseLayer = L.Control.Layers.include({

  /* okay, here's the existing flow i need to get into:
    - when the control is *initialised*, it takes in a list of base layers and
      a list of overlays. it internally records them all in _layers with bools
      indicating overlay (T) or not (F). public add/remove layer methods also do
      this. i can basically ignore this stuff.
    - however, _initLayout (called when the control is added to a map) does
      create the form DOM elements to be populated. i *do* need to alter this
      (hopefully to just tack other elements on the end)
    - now, _update empties any existing dom elements and then iterates through
      _layers, sorting them into a list of base layers and overlays again. it then it uses _addItem to actually do the dom work for each one. i need to
      hit both of these, as i probably want to call _addItem on the options i
      extract, not actual layers. */
  
  /* utility functions for manipulating arrays */

  // https://stackoverflow.com/a/14438954/3246758
  _onlyUnique: function(value, index, self) { 
    return self.indexOf(value) === index;
  },

  // https://stackoverflow.com/a/29447130/3246758
  _matchCount: function(source, target)
  {
      var result = source.filter(function(item) {
        return target.indexOf(item) > -1});   
      return result.length;
  },
  
  // TODO - add options and initialize if i want the label delimiter or number
  // of menus to be an option
  
  /* overridden class functions */

  _initLayout: function() {

    // get the usual stuff done first
    L.Control.Layers.prototype._initLayout.call(this);

    // convert the baselayer list into an array of three
    this._baseLayersList = [
      this._baseLayersList,
      DomUtil.create('div', className + '-base', form),
      DomUtil.create('div', className + '-base', form)
    ]

    // add classes to distinguish the three
    for (i = 0; i < this._baseLayersList.length; i++)
    {
      L.Domutil.addClass(this._baseLayersList[i], 'baselayerlist-' + i);  
    }
  },

  _update: function() {

    // return if this is missing a container
    if (!this._container) { return this; }

    // clear out the present lists of baselayers, overlays and controls
    for (i = 0; i < this._baseLayersList.length; i++) {
      DomUtil.empty(this._baseLayersList[i]);
    }
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
      for (i = 0; i < this._baseLayersList.length; i++) {
        this._baseLayersList[i].style.display = baseLayersPresent ? '' : 'none';
      }
    }
    this._separator.style.display =
      overlaysPresent && baseLayersPresent ? '' : 'none';

    return this;
  },

  _addItem: function(obj) {
    
    // dom option components
    var checked = this._map.hasLayer(obj.layer),
		    input;

    // create either a checkbox or a radio button for the item
		if (obj.overlay) {
      var label = document.createElement('label');

			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
      input.defaultChecked = checked;

      // add this input to the list, and id its layer
      this._layerControlInputs.push(input);
      input.layerId = Util.stamp(obj.layer);

      // event handler for selecting the option
      DomEvent.on(input, 'click', this._onInputClick, this);

      var name = document.createElement('span');
      name.innerHTML = ' ' + obj.name;

      // Helps prevent layer control flicker when checkboxes are disabled
      // https://github.com/Leaflet/Leaflet/issues/2771
      var holder = document.createElement('div');

      label.appendChild(holder);
      holder.appendChild(input);
      holder.appendChild(name);
      this._overlaysList.appendChild(label);

    } else
    {  
      /* here's where ComboBaseLayer gets really different: we don't necessarily
         need to create a dom element for each layer. there are 3 potential
         new elements. we need to check whether each is needed (ie. no previous*/

      var name_fragments = obj.name.split("_", 3);
      var inputs_toadd = [];

      nextFragment:
      for (var i = 0; i < name_fragments.length; i++)
      {
        /* if any previously added inputs share this layer name fragment, add
           this layer to that input. if not, create a new
           layerIds array for this input. */
        for (prevInput of this._layerControlInputs)
        {
          if (
            prevInput.layerId === undefined &&
            $.grep(prevInput.layerIds, function(lid) 
            {
              return lid.match(name_fragments[i]) == null;
            }))
          {
            prevInput.layerIds.push(Util.stamp(obj.layer));
            inputs_toadd.push(false);
            this._checkDisabledLayers();
		        continue nextFragment;
          }
        }

        /* no previous input found: create a new one as usual */
        var input = this._createRadioElement('leaflet-base-layers', checked);
        input.layerIds = [ Util.stamp(obj.layer) ];
        this._layerControlInputs.push(input);

        // event handler for selecting the option
        DomEvent.on(input, 'click', this._onInputClick, this);

        var name = document.createElement('span');
        name.innerHTML = ' ' + name_fragments[i]; // TODO - add a 'long name'?

        // Helps prevent layer control flicker when checkboxes are disabled
        // https://github.com/Leaflet/Leaflet/issues/2771
        var holder = document.createElement('div');

        var label = document.createElement('label');
        label.appendChild(holder);
        holder.appendChild(input);
        holder.appendChild(name);
        this._baseLayersList[i].appendChild(label);
        inputs_toadd.push(input);

      }
      
      /* finally, add those inputs that actually need to be appended
         (we have to add this at the end for baselayers to avoid the same layer
          being counted as a previous one after the first fragment) */
      this._layerControlInputs = this._layerControlInputs.concat(inputs_toadd);
      this._checkDisabledLayers();
    }
    return;
  },

  _onInputClick: function() {

    var inputs = this._layerControlInputs,
		    input, layer;
		var addedOverlays = [],
        removedOverlays = [],
        addedBaseLayers = [],
        removedBaseLayers = [],
        selectedBaseLayers = [],
        notSelectedBaseLayers = [];

		this._handlingClick = true;

		for (var i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];

      // okay, so _layerControlInputs is a list of all the
      // layer options. presently that's 1:1 to layer ids, so it can just add
      // layers for each checked one (as below).

			if (input.checked) {
        if (input.type == 'checkbox') {
          layer = this._getLayer(input.layerId).layer;
          addedOverlays.push(layer);
        } else if (input.type == 'radio') {
          // TODO - checked base option: need to check other base options!
          selectedBaseLayers = selectedBaseLayers.concat(input.layerIds);
        }
			} else if (!input.checked) {
        if (input.type == 'checkbox') {
          layer = this._getLayer(input.layerId).layer;
          removedOverlays.push(layer);
        } else if (input.type == 'radio') {
          // TODO - unchecked base option: what to do here? id the _one_
          // previous base layer! can use map.hasLayer or eachLayer to check...
          // inactiveFragments.push(input.layerId);
          removedBaseLayers = removedBaseLayers.concat(input.layerIds);
        }
			}
		}
    
		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedOverlays.length; i++) {
			if (this._map.hasLayer(removedOverlays[i])) {
				this._map.removeLayer(removedOverlays[i]);
			}
		}
		for (i = 0; i < addedOverlays.length; i++) {
			if (!this._map.hasLayer(addedOverlays[i])) {
				this._map.addLayer(addedOverlays[i]);
			}
    }
    
    // elements in selectedBaseLayers should only actually be added if they
    // appear n times where there are n controls.
    // elements in removedBaseLayers only need to be present once, but they may
    // not already be on the map (TODO - how can i narrow this down?)
    
    // 1) filter layer names down to those that occur at least 1 time for
    // removing and n times for adding (for n controls)
    var baseFreqs = {};
    selectedBaseLayers.forEach(function(x) {
      if (baseFreqs.indexOf(x) < 0) {
        baseFreqs[x] = 0;
      }
      baseFreqs[x] += 1;
    });
    for (layer_i in baseFreqs) {
      if (baseFreqs[layer_i] < 3) {
        delete baseFreqs[layer_i];
      }
    }
    notSelectedBaseLayers = notSelectedBaseLayers.filter(this._onlyUnique);
    
    // now compile the lists of layers and iterate through map
    baseFreqs = Object.keys(baseFreqs);
    for (i = 0; i < baseFreqs.length; i++) {
      addedBaseLayers.push(this._getLayer(baseFreqs[i]).layer);
    }
    for (i = 0; i < notSelectedBaseLayers.length; i++) {
      removedBaseLayers.push(this._getLayer(notSelectedBaseLayers[i]).layer);
    }

    // 3) finally, iterate through the layers and add or remove from map
    // Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedBaseLayers.length; i++) {
			if (this._map.hasLayer(removedBaseLayers[i])) {
				this._map.removeLayer(removedBaseLayers[i]);
			}
		}
		for (i = 0; i < addedBaseLayers.length; i++) {
			if (!this._map.hasLayer(addedBaseLayers[i])) {
				this._map.addLayer(addedBaseLayers[i]);
			}
    }

    this._handlingClick = false;
    
    // NEW - recheck disabled layers, since they depend on what's selected
    this._checkDisabledLayers();
    this._refocusOnMap();
  },

  _checkDisabledLayers: function () {
		var inputs = this._layerControlInputs,
		    input,
		    layer,
        zoom = this._map.getZoom(),
        selectableBaseLayers = [];

		for (var i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      if (input.type == 'checkbox') {
        layer = this._getLayer(input.layerId).layer;
        input.disabled =
          (layer.options.minZoom !== undefined &&
            zoom < layer.options.minZoom) ||
          (layer.options.maxZoom !== undefined &&
            zoom > layer.options.maxZoom);  
      } else if (input.type == 'radio') {
        // sort base layer controls into selected or not selected
        if (input.checked == true) {
          selectableBaseLayers = selectableBaseLayers.concat(input.layerIds);
        }
      }
    }

    // for base layers, disable either if its zoom is outside our range of if
    // none of its layerids appear on the selectable list
    selectableBaseLayers.filter(onlyUnique);
    for (var i = inputs.length - 1; i >= 0; i--) {
      if (input.type == 'radio')
        input.disabled =
          (layer.options.minZoom !== undefined &&
            zoom < layer.options.minZoom) ||
          (layer.options.maxZoom !== undefined &&
            zoom > layer.options.maxZoom) ||
          this._matchCount(input.layerIds, selectableBaseLayers) < 1;
    }
  }
  
});

L.control.layers.comboBaseLayer = function() {
  return new L.Control.Layers.ComboBaseLayer();
}