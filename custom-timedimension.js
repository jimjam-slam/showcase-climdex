/* custom timedimension control */

var CustomTimeDimensionControl = L.Control.TimeDimension.include({

  /* override getDisplayDateFormat to only output UTC year */
  _getDisplayDateFormat: function(date) {
    return date.getUTCFullYear().toString();
  }

});

L.Map.addInitHook(function() {
  if (this.options.timeDimensionControl) {
    this.timeDimensionControl = new CustomTimeDimensionControl(this.options.timeDimensionControlOptions || {});
    // this.addControl(this.timeDimensionControl);
  }
});
