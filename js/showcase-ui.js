/* functions for changing the visibility of the  app menus and dialogs */

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
  app_mode = 'stories';

  // attach stories index layer control
  // climdex_stories_control.addTo(mymap);

  $('#stories-list').addClass('toggled_on');
  $('#nav-stories-list').addClass('toggled_on');
  console.log('stories_list toggled on');
}

function turn_stories_list_off() {
  
  // remove stories layer control (it's not visible, so no need to wait)
  // climdex_stories_control.remove();
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
  app_mode = 'data';

  // attach regular index layer control
  climdex_indices_control.addTo(mymap);
  $('.leaflet-control-layers-toggle').html('Select an index');
  $('#nav-data').addClass('toggled_on');
  $('.leaflet-top.leaflet-left').addClass('toggled_on');
  console.log('data toggled on');
}

function turn_data_off() {
  // need to wait until controls are fully hidden before removing!
  // also need to only do this if the bar is _actually_ visible
  // (don't want several once-off event handlers stacking up!)
  if ($('.leaflet-top.leaflet-left').hasClass('toggled_on'))
    $('.leaflet-top.leaflet-left').one('transitionend', function() {
      for (
        var i = 0;
        i < climdex_indices_control._layerControlInputs.length;
        i++)
        climdex_indices_control._layerControlInputs[i].checked = false;
      climdex_indices_control._onInputClick();
      climdex_indices_control.remove();
    }).removeClass('toggled_on');
  $('.leaflet-bottom.leaflet-left').removeClass('toggled_on');
  $('#nav-data').removeClass('toggled_on');
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

function turn_timebar_off() {
  $('.leaflet-bottom.leaflet-left').removeClass('toggled_on');
  $('.leaflet-control-wms-legend').removeClass('legend-on-timebar');
}

function turn_timebar_on() {
  $('.leaflet-bottom.leaflet-left').addClass('toggled_on');
  $('.leaflet-control-wms-legend').addClass('legend-on-timebar');
}

function toggle_timebar() {
  if ($('.leaflet-bottom.leaflet-left').hasClass('toggled_on'))
    turn_timebar_off();
  else
  turn_timebar_on();
}
