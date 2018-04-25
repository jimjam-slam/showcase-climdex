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
  }
});

L.Map.addInitHook(function() {
  if (this.options.timeDimensionControl) {
    this.timeDimensionControl = new L.Control.TimeDimensionCustom(this.options.timeDimensionControlOptions || {});
    // this.addControl(this.timeDimensionControl);
  }
});
