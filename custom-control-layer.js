/* custom layer control: create a set of (css) dropdowns instead. extends
   https://github.com/Leaflet/Leaflet/blob/master/src/control/Control.Layers.js
   james goldie, feb 2018 */

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
  
  // TODO - add options and initialize if i want the label delimiter or number
  // of menus to be an option
  
	// 	return this._container;
	// },

  // DONE
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

  // DONE
  _update: function() {

    // return if this is missing a container
    if (!this._container) { return this; }

    // clear out the present lists of baselayers and overlays
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

  // called by _update! looks like this actually manipulates the dom
  // TODO - lots of work needs to go on here. i need to:
  // (a) have multiple forms ready (see above), DONE
  // (b) decide whether this elements requires new options in the form, and
  // (c) still register the layer, if that's happening
  // DONE
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

  /* also need to override this, since we need to react differently to options
     being selected */
  _onInputClick: function() {

    var inputs = this._layerControlInputs,
		    input, layer;
		var addedLayers = [],
        removedLayers = [];
    var activeFragments = [],
        inactiveFragments = [];

		this._handlingClick = true;

		for (var i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
			// layer = this._getLayer(input.layerId).layer;

      // okay, so _layerControlInputs is a list of all the
      // layer options. presently that's 1:1 to layer ids, so it can just add
      // layers for each checked one (as below).

      // since basemaps are radio buttons, i ought to be able to construct a
      // full layer id here. but i need to weed out the overlays and handle them
      // separately. can i see whether they're overlays from here? not directly,
      // but i can maybe see whether they're radio elements!

      // TODO - I need to also get

			if (input.checked) {
        if (input.type == 'checkbox') {
          addedLayers.push(layer);
        } else if (input.type == 'radio') {
          // TODO - checked base option: need to check other base options!
          activeFragments.push(input.layerId);
        }
			} else if (!input.checked) {
        if (input.type == 'checkbox') {
          removedLayers.push(layer);
        } else if (input.type == 'radio') {
          // TODO - unchecked base option: what to do here? id the _one_
          // previous base layer! can use map.hasLayer or eachLayer to check...
          inactiveFragments.push(input.layerId);
        }
			}
		}

    // okay, now to arrange the fragments the right way...
    // could brute-force this, trying every combo until _getLayer returns sth
    // (it returns undefined if it doesn't find the id in _layers)
    // THIS IS DUMB. i should be storing order data using list classes...



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
    
    // NEW - recheck disabled layers, since they depend on what's selected
    this._checkDisabledLayers();

    this._refocusOnMap();
    
  },

  /* crap, this gets called a lot. will have to totall reimplement, because
     there's no longer a 1:1 link between inputs and layers. can still handle
     the old way if it's an overlay, though! */
  _checkDisabledLayers: function () {
		var inputs = this._layerControlInputs,
		    input,
		    layer,
		    zoom = this._map.getZoom();

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;
			input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
			                 (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

		}
	}

});

L.control.layers.dropdownSet = function() {
  return new L.Control.Layers.ComboBaseLayer();
}