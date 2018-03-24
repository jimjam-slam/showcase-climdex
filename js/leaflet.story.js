/* */

L.Story = L.Evented.extend({

  options: {
    name_long: 'Default name',
    description: 'Default description',
    selectable: true,
    next_story: '',
  },

  initialize: function(storybits, options) {
    L.setOptions(this, options);

    // set up storybits
    this._storybits = [];
    if (storybits !== undefined) {
      for (bit_i of storybits) {
        // add each storybit to the story
        this._storybits.push(bit_i);


      }
    }
  }

});

L.story = function(storybits, options) {
  return new L.Story(storybits, options);
}

/* ========================================================================== */

L.StoryBit = L.Evented.extend({

  options: {
    story,
    // baselayer: 'TXx_ann_series',
    // year_start: '1995',
    // year_end: '2002',
    // col_low: '25',
    // col_med: '35',
    // col_hi: '45',

    zoom: 4,
    center_start: [35, 250],
    center_end: [35, 260],
  },

  initialize: function(options) {
    L.setOptions(this, options);

    if (this.options.story !== undefined) {
      this.addEventParent(this.options.story);
    } else {
      console.error('StoryBit cannot initialize without a story reference.');
    }

});

L.StoryBit.addInitHook(function() {

});

L.storyBit = function() {
  return new L.StoryBit();
}

/* ========================================================================== */

L.StoryBit.Animated = L.StoryBit.extend({

});

L.StoryBit.Animated.addInitHook(function() {

});

L.storyBit.animated = function() {
  return new L.StoryBit.Animated();
}

/* ========================================================================== */

L.StoryBit.Static = L.StoryBit.extend({

});

L.StoryBit.Static.addInitHook(function() {

});

L.storyBit.static = function() {
  return new L.StoryBit.Static();
}