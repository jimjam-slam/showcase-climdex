/* blah */

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
  turn_data_on();

  // set map view and time 
  mymap.timeDimension.setCurrentTime(1104537600000);
  mymap.flyTo([15, 100], 2);
}

function start_story_mode() {
  app_mode = 'stories';
  turn_data_off();
  turn_stories_list_on();
}

function load_story(event) {
  // use event.data.story_code to access stories
  console.log('Story item clicked! ' + event.data.story_code);

  $('#map-blackout').addClass('toggled_on').one('transitionend', function() {
    
    story = stories[event.data.story_code];

    // first, turn off regular layers and the story list
    for (var i = 0; i < climdex_indices_control._layerControlInputs.length; i++){
      climdex_indices_control._layerControlInputs[i].checked = false;
    }
    climdex_indices_control._onInputClick();
    turn_stories_list_off();

    // now, set initial map view
    mymap.setView(story.init.center_start, story.init.zoom, { animate: false });

    // next, load the story's layer and set the current time


  });


  
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
