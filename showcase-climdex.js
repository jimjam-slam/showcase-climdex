/* blah */

/* about overlay controls */
function turn_about_on() {
    $('#about').addClass('toggled_on');
    $('#nav-about').addClass('toggled_on');
    console.log('About toggled on');
}
function turn_about_off() {
  $('#about').removeClass('toggled_on');
  $('#nav-about').removeClass('toggled_on');
  console.log('About toggled off');
}
function toggle_about() {

  if ($('#about').hasClass('toggled_on'))
    turn_about_off();
  else
    turn_about_on();
}
$('#nav-about').on('click touch', toggle_about);
$('#close-about').on('click touch', toggle_about);

/* map code! */

var geoserver_base = 'http://localhost:8080/geoserver/climdex/wms?';
var app_mode = 'data';

/* wipe_time_cache: if in data mode, destroy all non-visible layers (ie. cached
   time slices). called whenever someone moves or zooms */
function wipe_time_cache()
{
  // only look for caches to wipe if in data mode
  if (app_mode == 'data')
  {
    current_time_id = mymap.timeDimension.getCurrentTime();
    
    // ... for each time layer synced to the time dimension...
    $.each(mymap.timeDimension._syncedLayers, function(sync_index, sync_value)
    {
      // ... and each time slice in the synced time layer...
      $.each(sync_value._layers, function(slice_index, slice_value)
      {
        // remove the slice if it doesn't match the current time
        if (slice_index != current_time_id)
        {
          console.log('Deleting cached time slice');
          mymap.removeLayer(slice_value);
        }
      });
    });
  }
}

/* TODO - event listener for window resize? maybe that'll help the time slider
   from flickering on hover */

// if (app_mode == 'data' | app_mode == 'tour')
// {
//   start_app(app_mode);
// } else
// {
//   console.error('app_mode should either be \'data\' or \'tour\'');
// }

// initialise map
var mymap = L.map('map', {
  center: [10, -80],    // lat, lon
  zoom: 2,
  zoomControl: true,
  timeDimension: true,
  timeDimensionOptions: {
      timeInterval: '1995-01-01T00:00:00.000Z/2004-01-01T00:00:00.000Z',
      period: 'P1Y'
  },
  timeDimensionControl: true,
  timeDimensionControlOptions: {
    position: 'topleft',
    speedSlider: false,
    playerOptions: {
      loop: true,
      transitionTime: 250,
      startOver: true
    }
  }
});
mymap.zoomControl.setPosition('bottomleft');

// add tile layer
L.tileLayer(
  'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}',
  // 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
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
// TODO - switch from $.extend() to L.util.extend()
var climdex_indices = {
  'CDD: Max dry spell length_Year_Series': L.timeDimension.layer.wms(
    L.tileLayer.wms(
      geoserver_base + '/climdex/wms?',
      $.extend({}, geoserver_options, { layers: 'CDD_ann_series' })),
    { cache: 12 }),
  'CSDI: Cold spell duration index_Year_Series': L.timeDimension.layer.wms(
    L.tileLayer.wms(
      geoserver_base + '/climdex/wms?',
      $.extend({}, geoserver_options, { layers: 'CSDI_ann_series' })),
    { cache: 12 }),
  'TXx: Hottest daily max temp_Year_Series': L.timeDimension.layer.wms(
    L.tileLayer.wms(
      geoserver_base + '/climdex/wms?',
      $.extend({}, geoserver_options, { layers: 'TXx_ann_series' })),
    { cache: 12 }),
  'TXx: Hottest daily max temp_January_Series': L.timeDimension.layer.wms(
    L.tileLayer.wms(
      geoserver_base + '/climdex/wms?',
      $.extend({}, geoserver_options, { layers: 'TXx_jan_series' })),
    { cache: 12 }),
  'TXx: Hottest daily max temp_July_Series': L.timeDimension.layer.wms(
    L.tileLayer.wms(
      geoserver_base + '/climdex/wms?',
      $.extend({}, geoserver_options, { layers: 'TXx_jul_series' })),
    { cache: 12 })
};

// add 'em with a layer control
// var climdex_indices_control = L.control.layers(climdex_indices, {}, {
//   position: 'topleft'
// }).addTo(mymap);
var climdex_indices_control =
  L.control.layers.comboBaseLayer(climdex_indices, {}, {
    position: 'topleft'
  }).addTo(mymap);

// to improve performance, i need to clear cached time slices when new tiles
// are requested in response to a pan or zoom
mymap.on('zoomlevelschange resize movestart', wipe_time_cache);

// TODO - add a legend (http://leafletjs.com/examples/choropleth/)

// set to first frame
// mymap.timeDimension.setCurrentTime(946728000000);
