/* blah */

// initial browser checks
if (!L.Browser.svg) {
  console.warn('SVG is unavailable. ' +
    'Things like overlay transitions may not work.');
}
if (L.Browser.ielt9) {
  console.warn('IE < 9 not supported.');
  alert('Explore Climdex currently only works on modern browsers.');
}

// initialise map; attach timedimension and its control
var mymap = L.map('map', {
  center: [10, 50],    // lat, lon
  zoom: 2,
  crs: L.CRS.EPSG4326,    // need a matching basemap!
  zoomControl: true,
  attributionControl: false // it's on the about screen instead
  // maxBoundsViscosity: 0.5
});
mymap.zoomControl.setPosition('topleft');
mymap.timeDimension = td;
mymap.addControl(td_control);

// when in data mode, wipe the time cache if the user pans/zooms/resizes
mymap.on('zoomlevelschange resize movestart', function() {
  if (app_mode == 'data')
    wipe_time_cache();
});

// initialise legend (with an empty pic to start)
var legend_dpi = 91;
var legend_url = geoserver_base +
  'REQUEST=GetLegendGraphic&VERSION=1.1.0&&FORMAT=image/png&height=12&' +
  'LEGEND_OPTIONS=fontName:Oswald;fontSize:12;fontColor:0x000000;dx:5;layout:horizontal;' +
  'dpi:' + legend_dpi +
  '&transparent=true&layer='
var legend = L.wmsLegend('img/1x1.png');

// add base tile layer
var base_tiles = L.tileLayer(
  'https://tile.gbif.org/4326/omt/{z}/{x}/{y}@1x.png?style=gbif-light',
  {
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'png',
    updateWhenIdle: false
  }).addTo(mymap);

// populate story menu and attach story-related event listeners
$('#shuffle-stories').on('click touch', random_story);
for (story of showcase_stories) {
  story.createMenuItem('stories-list');
  story.setMap(mymap);
  story.on('storyload', cleanup_for_story);
  story.on('storybitload', update_legend);
  story.on('storybitplay', storybit_ready, story);
  story.on('storybitend storybitquit', storybit_wrapup, story);
  story.on('storyend storyquit', function() {
    switch (app_mode) {
      case 'shuffle':
        random_story();
        break;
      case 'data':
        turn_data_on();
      case 'stories':
      default:
        turn_stories_list_on();
    }
  });
}

// event listener: toggle timebar depending on layer selected in data mode, and
// also update the laye rname on the menu button
mymap.on('baselayerchange', function(ev) {
  console.log('baselayerchange');
  var layer_code = ev.name,
      new_title = '';
  if (app_mode == 'data') {

    // toggle the timebar and move the legend
    if (layer_code.match('series') != null)
      turn_timebar_on();
    else
      turn_timebar_off();

    // get the long layer name and update the control title
    layer_code = layer_code.split(climdex_indices_control._menu_delimiter);
    for (var i = 0; i < layer_code.length; i++) {
      if (climdex_indices_control._matches[layer_code[i]] != undefined)
        new_title += climdex_indices_control._matches[layer_code[i]];
      else
        new_title += layer_code[i];
      
      if (i == 0)
        new_title += ': ';
      else
        new_title += ' ';
    }
    $('.leaflet-control-layers-toggle').html(new_title);
  }  
});

// decide which mode to initialise in (affects how we initialise)
var app_mode;
switch (window.location.search.substring(1)) {
  case 'shuffle':
    random_story();
    break;
  case 'data':
    turn_data_on();
    break;
  case 'stories':
  default:
    turn_stories_list_on();
}
