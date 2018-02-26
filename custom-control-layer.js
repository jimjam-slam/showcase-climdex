/* custom layer control: create a pair of (css) dropdowns instead */

L.Control.Layer.DropdownSet = L.Control.Layer.include({
  onAdd: function(map) {
    var controlSet = L.DomUtil.create('div', )
  },

  onRemove: function(map) {
    // nothing to do here
  }
});

L.control.layer.dropdownSet = function() {
  return new L.Control.Layer.DropdownSet();
}