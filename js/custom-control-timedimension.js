/* custom timedimension control */

L.Control.TimeDimensionCustom = L.Control.TimeDimension.include({
  /* override getDisplayDateFormat to only output UTC year */
  _getDisplayDateFormat: function(date) {
    return date.getUTCFullYear().toString();
  },

  /* overriding update basically only so i can update my story bit bar with
     animations */
  _update: function() {
    if (!this._timeDimension) {
      return;
    }
    if (this._timeDimension.getCurrentTimeIndex() >= 0) {
      var date = new Date(this._timeDimension.getCurrentTime());
      if (this._displayDate) {
        L.DomUtil.removeClass(this._displayDate, 'loading');
        this._displayDate.innerHTML = this._getDisplayDateFormat(date);
        // also (sneakily) update my story element!
        document.getElementById('story-bitbar-td').innerHTML =
          this._getDisplayDateFormat(date);
      }
      if (this._sliderTime && !this._slidingTimeSlider) {
        this._sliderTime.setValue(this._timeDimension.getCurrentTimeIndex());
      }
    } else {
      if (this._displayDate) {
        this._displayDate.innerHTML = this._getDisplayNoTimeError();
      }
    }
  },

  /* override _createLimitKnobs to fix fluid range width? it adds event
    listeners to lknob and uknob's .on('drag positionchanged')...
    i need to update range width and knob translate3d on window resize 
    
    actually, the knobs and slider see to adapt properly when i drag one of
    them, which suggests that their dragend hooks already work. maybe i
    just fire those events on window resize :) 
    
    _createSliderTime
    _createLimitKnobs
    */
  _createSliderTime: function(className, container) {
    var sliderContainer,
      sliderbar,
      max,
     knob, limits;
    sliderContainer = L.DomUtil.create('div', className, container);
    /*L.DomEvent
        .addListener(sliderContainer, 'click', L.DomEvent.stopPropagation)
        .addListener(sliderContainer, 'click', L.DomEvent.preventDefault);*/

    sliderbar = L.DomUtil.create('div', 'slider', sliderContainer);
    max = this._timeDimension.getAvailableTimes().length - 1;

    if (this.options.limitSliders) {
      limits = this._limitKnobs = this._createLimitKnobs(sliderbar);
    }
    knob = new L.UI.Knob(sliderbar, {
      className: 'knob main',
      rangeMin: 0,
      rangeMax: max
    });
    knob.on('dragend', function(e) {
      var value = e.target.getValue();
      this._sliderTimeValueChanged(value);
      this._slidingTimeSlider = false;
    }, this);
    knob.on('drag', function(e) {
      this._slidingTimeSlider = true;
      var time = this._timeDimension.getAvailableTimes()[e.target.getValue()];
      if (time) {
          var date = new Date(time);
          if (this._displayDate) {
          this._displayDate.innerHTML = this._getDisplayDateFormat(date);
          }
          if (this.options.timeSliderDragUpdate){
          this._sliderTimeValueChanged(e.target.getValue());
          }
      }
    }, this);

    knob.on('predrag', function() {
      var minPosition, maxPosition;
      if (limits) {
        //limits the position between lower and upper knobs
        minPosition = limits[0].getPosition();
        maxPosition = limits[1].getPosition();
        if (this._newPos.x < minPosition) {
          this._newPos.x = minPosition;
        }
        if (this._newPos.x > maxPosition) {
          this._newPos.x = maxPosition;
        }
      }
    }, knob);
    L.DomEvent.on(sliderbar, 'click', function(e) {
      if (L.DomUtil.hasClass(e.target, 'knob')) {
        return; //prevent value changes on drag release
      }
      var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
        x = L.DomEvent.getMousePosition(first, sliderbar).x;
      if (limits) { // limits exits
        if (limits[0].getPosition() <= x && x <= limits[1].getPosition()) {
          knob.setPosition(x);
          this._sliderTimeValueChanged(knob.getValue());
        }
      } else {
        knob.setPosition(x);
        this._sliderTimeValueChanged(knob.getValue());
      }

    }, this);

    /* my addition: on map resize, recalculate slider and knob. can assume a
        map b/c this fn gets called by onAdd */
    L.DomEvent.on(this._map, 'resize', function() {
      if (limits) {
          var lknob = limits[0],
            uknob = limits[1],
            lknob_value = lknob.getValue(),
            uknob_value = uknob.getValue(),
            knob_value = knob.getValue();
          // order of knob/bar movement should be fine regardless of direction
          sliderbar.style.width =
            L.DomUtil.getStyle(sliderContainer, 'width');
          knob.setValue(knob_value);
          lknob.setValue(lknob_value);
          uknob.setValue(uknob_value);
          // range bar?
          var rangebar;
          for (i = 0; i < sliderbar.children.length; i++) {
            console.log(sliderbar.children[i].classList);
            if (sliderbar.children[i].classList.contains('range'))
              rangebar = sliderbar.children[i];
          }
          L.DomUtil.setPosition(rangebar, L.point(lknob.getPosition(), 0));
          rangebar.style.width =
            uknob.getPosition() - lknob.getPosition() + 'px';
      } else {
        var knob_value = knob.getValue();
        sliderbar.style.width =
          L.DomUtil.getStyle(sliderContainer, 'width');
        knob.setValue(knob_value);
      }
    }, this);
    
    knob.setPosition(0);
    return knob;
  },

  /* also override addTo so that i can resize the fixed timebar on page load */
  addTo: function() {
    //To be notified AFTER the component was added to the DOM
    L.Control.prototype.addTo.apply(this, arguments);

    // get handles to the slider container and rangebar
    // via the entire control's container
    var sliderContainer, sliderbar;
    for (i = 0; i < this._container.children.length; i++) {
      if (this._container.children[i].classList.contains('timecontrol-slider'))
      {
        sliderContainer = this._container.children[i];
        sliderbar = sliderContainer.firstChild;
      }
    }

    if (this._limitKnobs) {
      var lknob = this._limitKnobs[0],
        uknob = this._limitKnobs[1],
        knob = this._sliderTime,
        lknob_value = lknob.getValue(),
        uknob_value = uknob.getValue(), 
        knob_value = knob.getValue();
        
      // order of knob/bar movement should be fine regardless of direction
      sliderbar.style.width =
        L.DomUtil.getStyle(sliderContainer, 'width');
      knob.setValue(knob_value);
      lknob.setValue(lknob_value);
      uknob.setValue(uknob_value);
      
      // get handle to range bar, then update that too
      var rangebar;
      for (i = 0; i < sliderbar.children.length; i++) {
        console.log(sliderbar.children[i].classList);
        if (sliderbar.children[i].classList.contains('range'))
          rangebar = sliderbar.children[i];
      }
      L.DomUtil.setPosition(rangebar, L.point(lknob.getPosition(), 0));
      rangebar.style.width =
        uknob.getPosition() - lknob.getPosition() + 'px';

    } else {
      var knob_value = knob.getValue();
      sliderbar.style.width =
        L.DomUtil.getStyle(sliderContainer, 'width');
      knob.setValue(knob_value);
    }

    this._onPlayerStateChange();
    this._onTimeLimitsChanged();
    this._update();
    return this;
  }
});

L.Map.addInitHook(function() {
  if (this.options.timeDimensionControl) {
    this.timeDimensionControl = new L.Control.TimeDimensionCustom(this.options.timeDimensionControlOptions || {});
    // this.addControl(this.timeDimensionControl);
  }
});
