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
            { overlay: L.popup(story_popup_opts)
                .setLatLng([35, 240])
                .setContent('<p>Climate change is a <span class="red">global</span> phenomenon.<p>'),
              when: 0, duration: 5
            },
            { overlay: L.popup(story_popup_opts)
                .setLatLng([30, 250])
                .setContent('<p>But not all places are affected equally.<p>'),
              when: 2, duration: 3
            },
            { overlay: L.popup(story_popup_opts)
                .setLatLng([25, 255])
                .setContent('<p>Our hottest days have become <span class+"red">hotter</span>...<p>'),
              when: 5, duration: 5
            },
            { overlay: L.popup(story_popup_opts)
              .setLatLng([20, 260])
              .setContent('<p>But not in the US mid-west.<p>'),
            when: 7, duration: 3
            }
          ],
          end_pause: 30
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