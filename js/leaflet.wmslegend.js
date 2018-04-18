/*
 * L.Control.WMSLegend is used to add a WMS Legend to the map
 */

L.Control.WMSLegend = L.Control.extend({
    options: {
        position: 'bottomright',
        uri: ''
    },

    onAdd: function () {
        var controlClassName = 'leaflet-control-wms-legend',
            legendClassName = 'wms-legend',
            legendLabelClassName = 'wms-legend-label',
            stop = L.DomEvent.stopPropagation;
        this.container = L.DomUtil.create('div', controlClassName);
        this.label_low =
            L.DomUtil.create('p', legendLabelClassName, this.container);
        this.label_low.innerHTML = '';
        this.img = L.DomUtil.create('img', legendClassName, this.container);
        this.img.src = this.options.uri;
        this.img.alt = 'Legend';
        this.label_high =
            L.DomUtil.create('p', legendLabelClassName, this.container);
        this.label_high.innerHTML = '';

        L.DomEvent
            .on(this.img, 'click', this._click, this)
            .on(this.label_low, 'click', this._click, this)
            .on(this.label_high, 'click', this._click, this)
            .on(this.container, 'click', this._click, this)
            .on(this.img, 'mousedown', stop)
            .on(this.img, 'dblclick', stop)
            .on(this.img, 'click', L.DomEvent.preventDefault)
            .on(this.img, 'click', stop);
        this.height = null;
        this.width = null;
        return this.container;
    },
    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        // toggle legend visibility
        var style = window.getComputedStyle(this.img);
        if (style.display === 'none') {
            this.img.style.display = this.displayStyle;
            this.label_low.style.display = this.displayLabelLowStyle;
            this.label_high.style.display = this.displayLabelHighStyle;
            L.DomUtil.removeClass(this.container, 'wms-legend-collapsed');
        }
        else {
            if (this.width === null && this.height === null) {
                // Only do inside the above check to prevent the container
                // growing on successive uses
                this.height = this.container.offsetHeight;
                this.width = this.container.offsetWidth;
            }
            this.displayStyle = this.img.style.display;
            this.displayLabelLowStyle = this.label_low.style.display;
            this.displayLabelHighStyle = this.label_high.style.display;
            this.img.style.display = 'none';
            this.label_low.style.display = 'none';
            this.label_high.style.display = 'none';
            L.DomUtil.addClass(this.container, 'wms-legend-collapsed');
        }
    },

    /* adding a function to update the legend with a new uri */
    update: function(uri, label_low = '', label_high = '') {
        this.options.uri = uri;
        this.img.src = this.options.uri;
        this.label_low.innerHTML = label_low
        this.label_high.innerHTML = label_high
    }
});

L.wmsLegend = function (uri) {
    var wmsLegendControl = new L.Control.WMSLegend;
    wmsLegendControl.options.uri = uri;
    mymap.addControl(wmsLegendControl);
    return wmsLegendControl;
};
