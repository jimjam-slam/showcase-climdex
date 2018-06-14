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

      /* my bit: on window resize, recalculate slider width and reposition
        the kob according to that width */ 

      knob.setPosition(0);

      return knob;
  },


  _createLimitKnobs: function(sliderbar) {
      L.DomUtil.addClass(sliderbar, 'has-limits');
      var max = this._timeDimension.getAvailableTimes().length - 1;
      var rangeBar = L.DomUtil.create('div', 'range', sliderbar);
      var lknob = new L.UI.Knob(sliderbar, {
          className: 'knob lower',
          rangeMin: 0,
          rangeMax: max
      });
      var uknob = new L.UI.Knob(sliderbar, {
          className: 'knob upper',
          rangeMin: 0,
          rangeMax: max
      });


      L.DomUtil.setPosition(rangeBar, 0);
      lknob.setPosition(0);
      uknob.setPosition(max);

      //Add listeners for value changes
      lknob.on('dragend', function(e) {
          var value = e.target.getValue();
          this._sliderLimitsValueChanged(value, uknob.getValue());
      }, this);
      uknob.on('dragend', function(e) {
          var value = e.target.getValue();
          this._sliderLimitsValueChanged(lknob.getValue(), value);
      }, this);

      //Add listeners to position the range bar
      lknob.on('drag positionchanged', function() {
          L.DomUtil.setPosition(rangeBar, L.point(lknob.getPosition(), 0));
          rangeBar.style.width = uknob.getPosition() - lknob.getPosition() + 'px';
      }, this);

      uknob.on('drag positionchanged', function() {
          rangeBar.style.width = uknob.getPosition() - lknob.getPosition() + 'px';
      }, this);

      //Add listeners to prevent overlaps
      uknob.on('predrag', function() {
          //bond upper to lower
          var lowerPosition = lknob._toX(lknob.getValue() + this.options.limitMinimumRange);
          if (uknob._newPos.x <= lowerPosition) {
              uknob._newPos.x = lowerPosition;
          }
      }, this);

      lknob.on('predrag', function() {
          //bond lower to upper
          var upperPosition = uknob._toX(uknob.getValue() - this.options.limitMinimumRange);
          if (lknob._newPos.x >= upperPosition) {
              lknob._newPos.x = upperPosition;
          }
      }, this);

      lknob.on('dblclick', function() {
          this._timeDimension.setLowerLimitIndex(0);
      }, this);
      uknob.on('dblclick', function() {
          this._timeDimension.setUpperLimitIndex(this._timeDimension.getAvailableTimes().length - 1);
      }, this);

      return [lknob, uknob];
  }
});

L.Map.addInitHook(function() {
  if (this.options.timeDimensionControl) {
    this.timeDimensionControl = new L.Control.TimeDimensionCustom(this.options.timeDimensionControlOptions || {});
    // this.addControl(this.timeDimensionControl);
  }
});
