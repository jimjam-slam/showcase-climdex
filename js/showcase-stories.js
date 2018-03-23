/* blah */

var story_popup_options = {
  autoPan: false,
  closeButton: false,
  closeOnEscapeKey: false,
  closeOnClick: false,
  className: 'story_popup'
}

var stories = {

  seusa_warming_hole: {
    name_long: 'South-east US warming hole',
    description: 'Something something',
    init: {
      index: 'TXx',
      season: 'ann',
      output: 'series',
      zoom: 4,
      center_start: [35, 250],
      center_end: [35, 260],
      timeInterval: '1995-01-01T00:00:00.000Z/2008-01-01T00:00:00.000Z',
    },
    duration: 10000,
    annotations: [
      {
        time: 1000,
        duration: 3000,
        type: 'popup',
        content: '<p>Oh hey look at this!</p><p>We should look at it.</p>'
      },
      {
        time: 4500,
        duration: 3000,
        type: 'popup',
        content: '<p>What else can we say?</p>'
      }
    ]
  },

  test2: {
    name_long: 'Some other interesting thing',
    description: 'idk here\'s a description whatever',
    init: {
      index: 'TXx',
      season: 'ann',
      output: 'series',
      zoom: 3,
      center_start: [-10, -80],
      center_end: [-10, -80],
      timeInterval: '1995-01-01T00:00:00.000Z/2008-01-01T00:00:00.000Z',
    },
    duration: 10000,
    annotations: [
      {
        time: 1000,
        duration: 3000,
        type: 'popup',
        content: '<p>Oh hey look at this!</p><p>We should look at it.</p>'
      },
      {
        time: 4500,
        duration: 3000,
        type: 'popup',
        content: '<p>What else can we say?</p>'
      }
    ]
  }
}

var climdex_stories_control =
  L.control.layers(climdex_indices, {}, {
    position: 'topleft',
    matches: matches,
    menu_count: 3,
    menu_delimiter: '_'
  })