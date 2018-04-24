/* blah */

// var story_popup_options = {
//   autoPan: false,
//   closeButton: false,
//   closeOnEscapeKey: false,
//   closeOnClick: false,
//   className: 'story_popup'
// }

// TODO - start turning this into proper example stories!

var story_popup_opts = {
  maxWidth: 400,
  autoPan: false,
  // offset: Point(0, 7)   // might be good for controlling pos better!
  closeButton: false,
  autoClose: false,
  closeOnEscapeKey: false,
  closeOnClick: false,
  className: 'story-popup'
}

var showcase_stories = [
  L.story(
    [
      L.storyBit(
        {
          baselayer:
            L.tileLayer.wms(geoserver_base, L.extend({
              layers: 'TXx_ann_trendval',
              env: 'low:-0.075;mid:0;high:0.075',
              leg_units: '&deg;C/yr'
            }, geoserver_options)),
          movements: [
            {
              at: [35, 265],
              options: { zoom: 4, duration: 10 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 3,
              content: 'Climate change is a <span class="emph">global</span> phenomenon.'
            },
            {
              type: 'comment', when: 4,
              content: 'But not all places are affected equally.'
            },
            {
              type: 'clear_comments', when: 6
            },
            {
              type: 'comment', when: 6.5,
              content: 'Our hottest days have become <span class="emph">hotter...</span>'
            },
            {
              type: 'comment', when: 7.5,
              content: '... but not in the American mid-west.'
            },
            {
              type: 'comment', when: 8.5,
              content: 'There\'re a few reasons for this.'
            }
          ],
          end_pause: 10//,
          //commentary_parent = 'story-commentary'
        })
    ],
    {
      name: 'South-east US warming hole',
      description: 'Something something',
      selectable: true,
      at: [35, 225], 
      zoom: 4
    })
];

/* cleanup_for_stories: prep the ui for story mode (disable existing base
   layers, turn off story menu, wipe time cache).
   attach to storyloading events. */
function cleanup_for_story(story) {
  $('#map-blackout').one('transitionend', function() {
    turn_data_off();
    turn_stories_list_off();
    wipe_time_cache();
    story.play();
  }).addClass('toggled_on');
}

function storybit_ready() {
  $('#map-blackout').removeClass('toggled_on');
}