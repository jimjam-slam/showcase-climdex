/* blah */

// var story_popup_options = {
//   autoPan: false,
//   closeButton: false,
//   closeOnEscapeKey: false,
//   closeOnClick: false,
//   className: 'story_popup'
// }

var showcase_stories = [
  L.story(
    [

    ],
    {
      name: 'South-east US warming hole',
      description: 'Something something',
      selectable: true
      // next_story: '',
    }
  )
];

// var stories = {

//   seusa_warming_hole: {
//     name_long: 'South-east US warming hole',
//     description: 'Something something',
//     start_story: true,
//     next_story: 'test2',
//     init: {
//       base_layer: 'TXx_ann_series',
//       year_start: '1995',
//       year_end: '2002',
//       col_low: '25',
//       col_med: '35',
//       col_hi: '45',

//       zoom: 4,
//       center_start: [35, 250],
//       center_end: [35, 260],
//       // timeInterval: '1995-01-01T00:00:00.000Z/2002-01-01T00:00:00.000Z',
//     },
//     duration: 10000,
//     annotations: [
//       {
//         time: 1000,
//         duration: 3000,
//         type: 'popup',
//         content: '<p>Oh hey look at this!</p><p>We should look at it.</p>'
//       },
//       {
//         time: 4500,
//         duration: 3000,
//         type: 'popup',
//         content: '<p>What else can we say?</p>'
//       }
//     ],
//   }
// }

// build the list of base layers required for the stories
// for (var i in stories) {
//   stories_baselayers[i] = L.timeDimension.layer.wms(
//     L.tileLayer.wms(
//       geoserver_base,
//       $.extend({}, geoserver_options, { layers: stories[i].init.base_layer })),
//     {
//       cache:
//         parseInt(stories[i].init.year_end) -
//         parseInt(stories[i].init.year_start) + 1
//     });
// }

// and here's the control for them
// var climdex_stories_control = L.control.layers(
//   stories_baselayers, {}, {
//     position: 'topleft',
//     matches: matches,
//     menu_count: 3,
//     menu_delimiter: '_'
//   });

/* showcase_story_load: prep the ui for story mode. attach to storyloading events. */
function cleanup_for_stories() {
  $('#map-blackout').addClass('toggled_on').one('transitionend', function() {
    for (var i = 0; i < climdex_indices_control._layerControlInputs.length; i++)
      climdex_indices_control._layerControlInputs[i].checked = false;
    
    turn_stories_list_off();
    wipe_time_cache();
  });
}
