/* blah */

$(function() {

  geoserver_base = 'http://localhost:8080/geoserver/climdex/wms?'

  // initialise map
  var mymap = L.map('map', {
    center: [-10, -80],    // lat, lon
    zoom: 2,
    timeDimension: true,
    timeDimensionOptions: {
        timeInterval: '1995-01-01T00:00:00.000Z/2014-01-01T00:00:00.000Z',
        period: 'P1Y'
    },
    timeDimensionControl: true,
  });

  // add tile layer
  L.tileLayer(
    'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}',
    {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 1,
      maxZoom: 16,
      ext: 'png'
    }).addTo(mymap);

  // base options for all geoserver wms requests
  var geoserver_options = {
    service: 'WMS',
    version: '1.1.0',
    request: 'GetMap',
    // layers: 'CDD_ann',
    format: 'image/png',
    className: 'blend_multiply',
    transparent: true
  };

  // a virtual 'time' layers for each climdex index 
  var climdex_indices = {
    'CDD (Annual)': L.timeDimension.layer.wms(
      L.tileLayer.wms(
        geoserver_base + '/climdex/wms?',
        $.extend({}, geoserver_options, { layers: 'CDD_ann' })),
      { cache: 12 }),
    'CSDI (Annual)': L.timeDimension.layer.wms(
      L.tileLayer.wms(
        geoserver_base + '/climdex/wms?',
        $.extend({}, geoserver_options, { layers: 'CSDI_ann' })),
      { cache: 12 })
  };
  
  // add 'em with a layer control
  L.control.layers(climdex_indices).addTo(mymap);

  // add a legend (http://leafletjs.com/examples/choropleth/)

  // set to first frame
  // mymap.timeDimension.setCurrentTime(946728000000);

});