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

var time_suffix = '-01-01T00:00:00.000Z';

var showcase_stories = [

  // animated storybit test
  // L.story(
  //   [
  //     L.storyBit.animated(td_player,
  //       {
  //         baselayer_label: 'Summer nights: series',
  //         baselayer:
  //           L.timeDimension.layer.wms(
  //             L.tileLayer.wms(
  //               geoserver_base, L.extend({
  //                 layers: 'SU_ann_series',
  //                 env: 'low:10;high:366',
  //                 leg_units: 'days/yr',
  //                 bounds: [[50, -136], [24, -60]]
  //               }, geoserver_options)),
  //             { cache: 10 }),
  //         time_start: '1990' + time_suffix,
  //         time_end: '1999' + time_suffix,
  //         movements: [
  //           {
  //             by: [0, 50], type: 'panBy',
  //             options: { duration: 10 }
  //           }
  //         ],
  //         annotations: [
  //           {
  //             type: 'comment', when: 3,
  //             content: 'Climate change is a <span class="emph">global</span> phenomenon.'
  //           },
  //           {
  //             type: 'comment', when: 4,
  //             content: 'But not all places are affected equally.'
  //           },
  //           {
  //             type: 'clear_comments', when: 6
  //           },
  //           {
  //             type: 'comment', when: 6.5,
  //             content: 'Our hottest days have become <span class="emph">hotter...</span>'
  //           },
  //           {
  //             type: 'comment', when: 7.5,
  //             content: '... but not in the American mid-west.'
  //           },
  //           {
  //             type: 'comment', when: 8.5,
  //             content: 'There\'re a few reasons for this. <a href="https://doi.org/10.1016/j.wace.2018.01.001">Read the paper.</a>'
  //           }
  //         ],
  //         end_pause: 1//,
  //       })
  //   ],
  //   {
  //     name: 'Animation test',
  //     description: 'Are animated layers working?',
  //     selectable: true,
  //     at: [[50, -129], [24, -60]],
  //     padding_topleft: dynamic_padding_tl,
  //     padding_bottomright: [0, 0]
  //   }),

  // dtr: fingerprint of climate change
  L.story(
    [
      L.storyBit(
        {
          baselayer_label: 'Daily temperature range: annual average (1951&ndash;2017)',
          baselayer:
            L.tileLayer.wms(geoserver_base, L.extend({
              layers: 'DTR_ann_avg',
              env: 'low:7;high:18',
              leg_units: '&deg;C',
              bounds: [[-30, -120], [30, 120]]    // approx. full world
            }, geoserver_options)),
          movements: [
            {
              by: [0, 50], type: 'panBy', options: { duration: 6 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: 'How do we know that <span class="emph">humans</span> are changing the climate?'
            },
            {
              type: 'comment', when: 3,
              content: 'One fingerprint is DTR:'
            },
            {
              type: 'comment', when: 4,
              content: '<span class="emph">Daily Temperature Range</span>'
            }
          ],
          end_pause: 0
        }),

      L.storyBit(
        {
          movements: [
            {
              at: [[25, -125], [50, -80]], type: 'flyToBounds', // usa
              options: { duration: 1 }
            },
            {
              by: [0, 50], type: 'panBy',
              options: { duration: 10 }
            }
          ],
          annotations: [
            {
              // sw radiation
              type: 'layer', when: 1, duration: 9,
              content: L.marker([40, -109], {
                icon: L.icon({
                  iconUrl: 'img/icon-swrad.png',
                  iconSize:     [200, 132],
                  iconAnchor:   [100, 102]
                })
              })
            },
            {
              type: 'comment', when: 1,
              content: 'Heat comes in from the Sun during the <span class="emph">day...</span>'
            },
            {
              // night time
              type: 'layer', when: 3, duration: 7,
              content: L.terminator({ 
                // resolution, color, fillColor, fillOpacity,
                time: '2018-06-18T02:00:00Z' 
              })
            },
            {
              // lw radiation
              type: 'layer', when: 3, duration: 3,
              content: L.marker([36, -86], {
                icon: L.icon({
                  iconUrl: 'img/icon-lwrad.png',
                  iconSize:     [200, 132],
                  iconAnchor:   [100, 102]
                })
              })
            },
            {
              type: 'comment', when: 3,
              content: '... and escapes at <span class="emph">night.</span>'
            },
            {
              type: 'clear_comments', when: 5
            },
            {
              // smaller lw radiation
              type: 'layer', when: 6, duration: 4,
              content: L.marker([36, -86], {
                icon: L.icon({
                  iconUrl: 'img/icon-lwrad.png',
                  iconSize:     [100, 66],
                  iconAnchor:   [50, 51]
                })
              })
            },
            {
              type: 'comment', when: 6,
              content: 'But the <span class="emph">greenhouse effect</span> should keep heat in at night.'
            },
            {
              type: 'comment', when: 8,
              content: 'How can we test this?'
            },
            {
              type: 'clear_comments', when: 10
            },
          ],
          end_pause: 0//,
        }),

      L.storyBit(
        {
          baselayer_label: 'Daily temperature range: annual average (1951&ndash;2017)',
          baselayer:
            L.tileLayer.wms(geoserver_base, L.extend({
              layers: 'DTR_ann_avg',
              env: 'low:9;high:15',
              leg_units: '&deg;C',
              bounds: [[-10, 112], [-44, 153]]    // australia
            }, geoserver_options)),
          movements: [
            {
              at: [[-10, 112], [-44, 153]], type: 'flyToBounds',
              options: { animate: false }
            },
            {
                by: [50, 0], type: 'panBy',
                options: { duration: 9 }}
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: 'DTR tells us how <span class="emph">daytime</span> and <span class="emph">nighttime</span> temperatures differ.'
            },
            {
              type: 'layer', when: 3, duration: 9,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([-23.84, 133.1]).setContent(
                '<h1>High DTR</h1><p>Hot days and cold nights.</p>')
            },
            {
              type: 'layer', when: 6, duration: 6,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([-18.22, 146.8]).setContent(
                '<h1>Low DTR</h1><p>Smaller temperature swings across the day.</p>')
            }
          ],
          end_pause: 0
        }),

      L.storyBit(
        {
          baselayer_label: 'Daily temperature range: annual trend (1951&ndash;2017)',
          baselayer:
            L.tileLayer.wms(geoserver_base, L.extend({
              layers: 'DTR_ann_trendval',
              env: 'low:-0.08;mid:0;high:0.08',
              leg_units: '&deg;C/yr',
              bounds: [[-80, -179], [80, 179]]    // zoom out
            }, geoserver_options)),
          movements: [
            {
              at: [[-30, -120], [30, 120]], type: 'flyToBounds',
              options: { animate: true, duration: 1 }
            },
            {
                by: [0, -50], type: 'panBy',
                options: { duration: 10 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: 'Global DTR has <span class="emph">fallen</span> slightly over the last 50 years.'
            },
            {
              type: 'comment', when: 4,
              content: 'So <span class="emph">nights are warming faster</span> than days.'
            },
            {
              type: 'clear_comments', when: 7
            },
            {
              type: 'comment', when: 8,
              content: 'This catch-up helps us <span class="emph">attribute</span> climate changes to the greenhouse effect.'
            },
            {
              type: 'comment', when: 11,
              content: '<span class="small"><a target="_blank" href="https://doi.org/10.1175/JCLI-D-13-00032.1">Lewis & Karoly (2013)</a>; <a target="_blank" href="https://doi.org/10.1029/2004GL019998">Braganza et al. (2004)</a></span>'
            }
          ],
          end_pause: 3
        })
    ],
    {
      name: 'Daily temperature range',
      description: 'A fingerprint of climate change',
      selectable: true,
      at: [[-30, -120], [30, 120]],
      padding_topleft: dynamic_padding_tl,
      padding_bottomright: [0, 0]
    }),
  
  // rainfall: changing extremes in wet and dry regions
  L.story(
    [
      L.storyBit.animated(td_player,
        {
          baselayer_label: 'Total annual rainfall: series',
          baselayer:
            L.timeDimension.layer.wms(
              L.tileLayer.wms(
                geoserver_base, L.extend({
                  layers: 'PRCPTOT_ann_series',
                  env: 'low:0;high:2000',
                  leg_units: 'mm',
                  bounds: [[22.79, 94.09], [-28.81, 155]],
                }, geoserver_options)),
              { cache: 10 }),
          time_start: '1980' + time_suffix,
          time_end: '1989' + time_suffix,
          movements: [
            {
              by: [0, 50], type: 'panBy',
              options: { duration: 17 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: 'Water is important to everyone on Earth...'
            },
            
            {
              type: 'comment', when: 4,
              content: '... and we all use it <span class="emph">differently.</span>'
            },
            {
              type: 'clear_comments', when: 7
            },
            
            {
              type: 'comment', when: 8,
              content: 'Some places get <span class="emph">more water...</span>'
            },
            {
              type: 'layer', when: 8, duration: 9,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([14.87, 99.2]).setContent(
                '<h1>Thailand</h1>')
            },
            {
              type: 'comment', when: 11,
              content: '... some get <span class="emph">less water...</span>'
            },
            {
              type: 'layer', when: 11, duration: 6,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([-22.27, 123.79]).setContent(
                '<h1>Western Australia</h1>')
            },
            {
              type: 'comment', when: 14,
              content: '... and climate change is affecting <span class="emph">both.</span>'
            },
          ],
          end_pause: 0
        }),

      L.storyBit(
        {
          baselayer_label: 'Rainiest day: annual trend (1951&ndash;2017)',
          baselayer:
            L.tileLayer.wms(geoserver_base, L.extend({
              layers: 'Rx1day_ann_trendval',
              env: 'low:-1.1;mid:0;high:1.1',
              leg_units: 'mm/yr',
              bounds: [[22.79, 94.09], [-28.81, 155]], // australia + se asia
            }, geoserver_options)),
          movements: [
            {
                by: [-50, 0], type: 'panBy',
                options: { duration: 10 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: "ARCCSS researchers looked the world's <span class='emph'>driest</span> and <span class='emph'>wettest</span> regions."
            },
            {
              type: 'comment', when: 4,
              content: "<span class='emph'>Extreme</span> rainfall is getting worse in <span class='emph'>both</span> regions."
            },
            {
              type: 'comment', when: 7,
              content: "But it's more complicated than that."
            }
          ],
          end_pause: 0
        }),

      L.storyBit(
        {
          baselayer_label: 'Total annual rainfall: annual trend (1951&ndash;2017)',
          baselayer:
            L.tileLayer.wms(geoserver_base, L.extend({
              layers: 'PRCPTOT_ann_trendval',
              env: 'low:-8;mid:0;high:8',
              leg_units: 'mm/yr',
              bounds: [[22.79, 94.09], [-28.81, 155]], // australia + se asia
            }, geoserver_options)),
          movements: [
            {
              at: [[22.79, 94.09], [8, 110]], type: 'flyToBounds', // se asia
              options: { duration: 1 }
            },
            {
                by: [0, 50], type: 'panBy',
                options: { duration: 6 }
            },
            {
              at: [[-9, 113.5], [-28.81, 129.25]], type: 'flyToBounds', // wa
              options: { duration: 1 }
            },
            {
                by: [0, 50], type: 'panBy',
                options: { duration: 6 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: "Wet regions might getting more extreme rainfall, but their <span class='emph'>total rainfall isn't changing.</span>"
            },
            {
              type: 'comment', when: 7,
              content: "Dry places, in contrast, are getting both worse extreme rainfall and <span class='emph'>more rainfall overall.</span>"
            }
          ],
          end_pause: 0
        }),

      L.storyBit(
        {
          movements: [
            {
              at: [[22.79, 94.09], [-28.81, 129.25]], type: 'flyToBounds', // se asia
              options: { duration: 1 }
            },
            {
                by: [0, 50], type: 'panBy',
                options: { duration: 10 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: "These <span class='emph'>subtle but important differences</span> determine how different countries, and industries, prepare for climate change."
            },
            {
              type: 'comment', when: 5,
              content: "Observing climate extremes helps us understand these subtleties."
            },
            {
              type: 'comment', when: 8,
              content: "<span class='small'><a href='https://doi.org/10.1038/nclimate2941'>Donat et al. 2016</a></span>"
            },
            
          ],
          end_pause: 0
        })

    ],
    {
      
      name: 'Changing rainfall in wet and dry regions',
      description: 'The impacts of climate change differ across countries and industries.',
      selectable: true,
      at: [[22.79, 94.09], [-28.81, 129.25]],
      padding_topleft: dynamic_padding_tl,
      padding_bottomright: [0, 0]
    }
  ),

  // se asia: heat and urbanising
  L.story(
    [

      L.storyBit(
        {
          movements: [
            {
                by: [100, 100], type: 'panBy',
                options: { duration: 18 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: "South-east Asia is the <span class='emph'>most rapidly urbanising</span> region in the world."
            },
            {
              type: 'layer', when: 2, duration: 16,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([14.6, 121]).setContent(
                '<h1>Manila</h1><p>13.1 million</p>')
            },
            {
              type: 'layer', when: 2.5, duration: 15.5,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([13.73, 100.55]).setContent(
                '<h1>Bangkok</h1><p>9.4 million</p>')
            },
            {
              type: 'layer', when: 3, duration: 15,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([10.7, 106.7]).setContent(
                '<h1>Ho Chi Minh City</h1><p>7.5 million</p>')
            },
            {
              type: 'layer', when: 3.5, duration: 14.5,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([1.34, 103.85]).setContent(
                '<h1>Singapore</h1><p>5.7 million</p>')
            },
            {
              type: 'layer', when: 4, duration: 14,
              content: L.popup({
                autopan: false, closeButton: false, autoClose: false,
                closeOnEscapeKey: false, closeOnClick: false,
                className: 'story-popup', maxWidth: 200
              }).setLatLng([-6.3, 106.9]).setContent(
                '<h1>Jakarta</h1><p>10.5 million</p>')
            },
            {
              type: 'comment', when: 4,
              content: "As of 2010, <span class='emph'>nearly half</span> of the population lives in cities."
            },
            {
              type: 'comment', when: 6,
              content: "<span class='small'><a href='http://www.un.org/en/development/desa/population/publications/pdf/urbanization/the_worlds_cities_in_2016_data_booklet.pdf'>United Nations (2016)</a>; <a href='www.stateofthetropics.org'>State of the Tropics (2014)</a></span>"
            },
            {
              type: 'clear_comments', when: 8
            },
            {
              type: 'comment', when: 9,
              content: "These people are already <span class='emph'>vulnerable</span> to heat: cities trap it."
            },
            {
              type: 'comment', when: 12,
              content: "This Urban Heat Island makes cities <span class='emph'>warmer</span> than their surrounds."
            },
            {
              type: 'comment', when: 15,
              content: "The effect is <span class='emph'>worst at night.</span>"
            },
          ],
          end_pause: 0
        }),

      L.storyBit(
        {
          baselayer_label: 'Fraction of warm days: annual trend (1951&ndash;2017)',
          baselayer:
            L.tileLayer.wms(geoserver_base, L.extend({
              layers: 'TN90p_ann_trendval',
              env: 'low:-1.2;mid:0;high:1.2',
              leg_units: 'p.p./yr',
              bounds: [[30, 93], [-2, 125]], // se asia
            }, geoserver_options)),
          movements: [
            {
                by: [50, 0], type: 'panBy',
                options: { duration: 10 }
            }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: "Climate change is compounding the Urban Heat Island."
            },
            {
              type: 'comment', when: 4,
              content: "Warm nights are becoming more frequent in many parts of the world..."
            },
            {
              type: 'comment', when: 7,
              content: "But the <span class='emph'>biggest changes</span> are in South-East Asia."
            }
          ],
          end_pause: 0
        }),
        
      L.storyBit(
        {
          baselayer_label: 'Fraction of warm days: annual trend (1951&ndash;2017)',
          baselayer:
            L.tileLayer.wms(geoserver_base, L.extend({
              layers: 'WSDI_ann_trendval',
              env: 'low:-1;mid:0;high:1',
              leg_units: 'p.p./yr',
              bounds: [[30, 93], [-2, 125]], // se asia
            }, geoserver_options)),
          movements: [
            // {
            //     by: [50, 0], type: 'panBy',
            //     options: { duration: 4 }
            // }
          ],
          annotations: [
            {
              type: 'comment', when: 1,
              content: "Runs of warm days are also getting <span class='emph'>longer,</span> giving people less relief."
            }//,
            // {
            //   type: 'comment', when: 4,
            //   content: "Cities need to look for <span class='emph'>longer,</span> giving people less relief."
            // }
          ],
          end_pause: 4
        })
    ],
    {
      
      name: 'South-east Asia',
      description: 'Twin impacts of cliate change and urbanisation.',
      selectable: true,
      at: [[30, 93], [-2, 125]],
      padding_topleft: dynamic_padding_tl,
      padding_bottomright: [0, 0]
    }
  )

  ];

/* cleanup_for_stories: prep the ui for story mode (disable existing base
   layers, turn off story menu, wipe time cache).
   attach to storyloading events. */
function cleanup_for_story(story) {
  $('#map-blackout').one('transitionend', function() {
    console.log('#map-blackout transitionend handler');
    turn_data_off();
    turn_stories_list_off();
    wipe_time_cache();
    $('#story-bitbar').addClass('toggled_on');
    story.play();
    console.log('#map-blackout transitionend handler DONE');
  }).addClass('toggled_on');
}

function storybit_ready() {
  console.log('storybitready handler');
  console.log(this._storybits[this._current_storybit]._baselayer_label);

  if (
    this._storybits[this._current_storybit]._baselayer_label !== undefined &&
    this._storybits[this._current_storybit]._baselayer_label !== '' &&
    this._storybits[this._current_storybit]._baselayer_label !== 'No baselayer') {
      $('#story-bitbar-label').html(
        this._storybits[this._current_storybit]._baselayer_label);
      $('#story-bitbar').addClass('toggled_on');
      // also turn the year indicator on if it's animated
      if (this._storybits[this._current_storybit] instanceof L.StoryBit.Animated)
        $('#story-bitbar-td').removeClass('disabled');
    } else if ($('#story-bitbar').hasClass('toggled_on')) {
      // otherwise, turn it off if it's off
      $('#story-bitbar').removeClass('toggled_on');
      $('#story-bitbar-td').addClass('disabled');
    }
  
  $('#map-blackout').removeClass('toggled_on');
}

function storybit_wrapup() {
  console.log('storybitend handler');
  legend.update('img/1x1.png');
  $('#story-bitbar').removeClass('toggled_on');
  $('#story-bitbar-td').addClass('disabled');
}

/* dynamic_padding_tl: calculates padding for the story movements based on the
   window's aspect ratio at the time (eg. device rotation mid-story).
   compensates for the 50px header bar to match css styling */
function dynamic_padding_tl(map) {
  var map_size = map.getSize(),
      aspect = map_size.x / (map_size.y + 50);
  console.log('Dynamic TL padding requested!');
  console.log('map size: ' + map_size.x + ', ' + map_size.y);
  console.log('Apect ratio: ' + aspect);
  return aspect <= 1.25 ?                             // max aspect ratio
    [0,              ((map_size.y - 50) / 2) + 50] :  // portrait padding
    [map_size.x / 2, 50]                              // landscape padding
}

/* getRandomInt: helper for getting random stories */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/* random_story: load a random story */
function random_story() {
  app_mode = 'shuffle';
  showcase_stories[getRandomInt(showcase_stories.length)].load();
}

/* update_legend: update legend according to storybit baselayer*/
function update_legend(bit) {
  
  // undefined or non-wms baselayer: just use a blank legend
  if (bit._baselayer === undefined)
    legend.update('img/1x1.png');
  else if (
    !(bit._baselayer instanceof L.TimeDimension.Layer.WMS) &&
    !(bit._baselayer instanceof L.TileLayer.WMS))
    legend.update('img/1x1.png');
  else {
    // wms legend: calculate the legend labels + url and update 
    console.log(bit);
    var param_root;
    if (bit._baselayer instanceof L.TimeDimension.Layer.WMS)
      param_root = bit._baselayer._baseLayer.wmsParams;
    else if (bit._baselayer instanceof L.TileLayer.WMS)
      param_root = bit._baselayer.wmsParams;

    var lab_env = param_root.env,
        lab_units = param_root.leg_units,
        env_bits = lab_env.split(/:|;/),
        lab_low = env_bits[1] + ' ' + lab_units,
        lab_high = env_bits[env_bits.length - 1] + ' ' + lab_units,
        layers = param_root.layers;
    legend.update(legend_url + layers, lab_low, lab_high);
  }
}
