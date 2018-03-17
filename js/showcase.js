/* blah */

/* about overlay controls */
function turn_about_on() {
  turn_stories_list_off(); 
  turn_data_off(); 
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

  if ($('#nav-about').hasClass('toggled_on'))
    turn_about_off();
  else
    turn_about_on();
}
$('#nav-about').on('click touch', toggle_about);
$('#close-about').on('click touch', toggle_about);

/* story list */
function turn_stories_list_on() {
  turn_about_off();
  turn_data_off();
  $('#stories-list').addClass('toggled_on');
  $('#nav-stories-list').addClass('toggled_on');
  console.log('stories_list toggled on');
}
function turn_stories_list_off() {
  $('#stories-list').removeClass('toggled_on');
  $('#nav-stories-list').removeClass('toggled_on');
  console.log('stories-list toggled off');
}
function toggle_stories_list() {

if ($('#nav-stories-list').hasClass('toggled_on'))
  turn_stories_list_off();
else
  turn_stories_list_on();
}
$('#nav-stories-list').on('click touch', toggle_stories_list);

/* data mode */
function turn_data_on() {
  turn_stories_list_off();
  turn_about_off();
  $('#nav-data').addClass('toggled_on');
  $('.leaflet-top.leaflet-left').css({
    'visibility': 'visible',
    'opacity': 1
  });
  console.log('data toggled on');
}
function turn_data_off() {
  $('#nav-data').removeClass('toggled_on');
  $('.leaflet-top.leaflet-left').css({
    'visibility': 'hidden',
    'opacity': 0
  });
  console.log('data toggled off');
}
function toggle_data() {

  if ($('#nav-data').hasClass('toggled_on'))
    turn_data_off();
  else
    turn_data_on();
}
$('#nav-data').on('click touch', toggle_data);
$('#close-data').on('click touch', toggle_data);


/* wipe_time_cache: destroy all non-visible layers (ie. cached time slices).
   in data mode, this gets called whenever the user pans or zooms.
   in story or tour mode, it gets called whenever a story starts */
function wipe_time_cache()
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

// initialise map
var mymap = L.map('map', {
  center: [10, 50],    // lat, lon
  zoom: 2,
  crs: L.CRS.EPSG4326,    // need a matching basemap!
  zoomControl: true,
  maxBoundsViscosity: 0.5,
  timeDimension: true,
  timeDimensionOptions: {
      timeInterval: '1951-01-01T00:00:00.000Z/2017-01-01T00:00:00.000Z',
      period: 'P1Y'
  },
  timeDimensionControl: true,
  timeDimensionControlOptions: {
    position: 'topleft',
    speedSlider: false,
    limitSliders: true,
    playerOptions: {
      loop: true,
      transitionTime: 250,
      startOver: true
    }
  }
});
mymap.zoomControl.setPosition('bottomleft');
mymap.setMaxBounds([[-90, -30], [95, 360]]);
mymap.on('zoomlevelschange resize movestart', function() {
  // only look for caches to wipe if in data mode
  if (app_mode == 'data')
  {
    wipe_time_cache();
  }
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
L.tileLayer(
  'https://tile.gbif.org/4326/omt/{z}/{x}/{y}@1x.png?style=gbif-light',
  {
    attribution: 'Tiles &copy; <a href="http://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> (reprojected by <a href="https://tile.gbif.org">GBIF</a>)',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'png'
  }).addTo(mymap);

// initialise layer control
var climdex_indices_control =
  L.control.layers.comboBaseLayer(climdex_indices, {}, {
    position: 'topleft',
    matches: matches,
    menu_count: 3,
    menu_delimiter: '_'
  }).addTo(mymap);

// populate story menu
// enable and populate story menu
for (i in stories) {
  var story = stories[i];
  var item = L.DomUtil.create('div', 'story_menu_item',
    L.DomUtil.get('stories-list'));
  
  item_name = document.createElement('h2');
  item_name.innerHTML = stories[i].name_long;
  item.appendChild(item_name);
  item_description = document.createElement('p');
  item_description.innerHTML = stories[i].description;
  item.appendChild(item_description);
  
  $(item).on('click touch', { story_code: i }, load_story);
}

function start_data_mode() {
  // remove old ui elements
  $('#nav-stories-list').removeClass('toggled_on');
  
  // turn ui elements on
  app_mode = 'data';
  $('#nav-data').addClass('toggled_on');
  $('.leaflet-top.leaflet-left').css({
    'visibility': 'visible',
    'opacity': 1
  });

  // set map view and time 
  mymap.timeDimension.setCurrentTime(1104537600000);
  mymap.flyTo([15, 100], 2);
}

function start_story_mode() {
  // remove old ui elements
  $('#nav-data').removeClass('toggled_on');
  $('.leaflet-top.leaflet-left').css({
    'visibility': 'hideen',
    'opacity': 0
  });
  
  // turn ui elements on
  app_mode = 'stories';
  $('#nav-stories-list').addClass('toggled_on');
}

function load_story(event) {
  // use event.data.story_code to access stories
  alert('Story item clicked! ' + event.data.story_code);
}

// decide which mode to initialise in (affects how we initialise)
var app_mode;
switch (window.location.search.substring(1)) {
  case 'stories':
    start_story_mode();
    break;
  case 'tour':
    // auto rotate stories
    break
  case 'data':
  default:
    start_data_mode();
}
