/* L.StoryBit: a base class for story 'bits' that are displayed sequentially in a story. */

L.StoryBit = L.Evented.extend({

  _movement_timers: [],
  _annotation_timers: [],

  options: {
    baselayer: undefined,
    movements: [],
    annotations: [],
    end_pause: 0
  },

  setMap: function(map)     { this._map = map; },
  _setStory: function(story) {
    this._story = story;
    this.addEventParent(story);
  },

  
  initialize: function(options) {
    // TODO - do some checking on movements and annotations
    L.setOptions(this, options);
    this._baselayer = this.options.baselayer;
    this._movements = this.options.movements;
    this._annotations = this.options.annotations;
    this._end_pause = this.options.end_pause;

    // add event listeners

    // TODO - jQuery dependency
    if (this._baselayer !== undefined)
    {
      this._baselayer.addEventParent(this);
      // this.one('load', this.play);
    }
    
  },

  load: function() {
    this.fire('storybitload', this, propogate = true);

    // attach the baselayer to the map if there's on of each
    if (this._baselayer !== undefined) {}
      if (this._map !== undefined) {
        this._baselayer.addTo(this._map);
        this.play();
      }
      else
        console.error('This StoryBit has no map associated with it. Attach ' +
          'a map either to this StoryBit using this.setMap() or to an ' +
          'attached Story using story.setMap().');
  },

  play: function() {

    this.fire('storybitplay', this, propogate = true);
    // okay, we're gonna set up a whole heap of event listeners for the pans and
    // annotations. when the last of either is done, we'll fire `storybitend`

    // set up movements using setTimeout (and hold onto the timer ids!)
    var ongoing_duration = 0;
    var ongoing_zoom = this._map.getZoom();
    for (var i = 0; i < this._movements.length; i++) {
      var samezoom = this._movements[i].options.zoom == ongoing_zoom;
      this._movement_timers.push(
        setTimeout(this._move, ongoing_duration, this._map, this._movements[i].at, this._movements[i].options, samezoom));
      ongoing_zoom = this._movements[i].options.zoom;
      ongoing_duration += (this._movements[i].options.duration * 1000);
    }

    // now set up annotation toggles using setTimeout
    // (we need separate timers for turning them on and off)
    var latest_removal = 0;
    for (var i = 0; i < this._annotations.length; i++) {
      var overlay_i = this._annotations[i].overlay;
      var when_start_i = this._annotations[i].when * 1000;
      var when_end_i =
        (this._annotations[i].when * 1000) +
        (this._annotations[i].duration * 1000);

      this._annotation_timers.push(
        setTimeout(this._addAnnotation, when_start_i, overlay_i, this._map));
      this._annotation_timers.push(
        setTimeout(this._removeAnnotation, when_end_i, overlay_i))
      if (when_end_i > latest_removal) latest_removal = when_end_i;
    }

    // and, finally, set a quit timer
    this._end_timer = setTimeout(this._end,
      Math.max(ongoing_duration, latest_removal) + (this._end_pause * 1000),
      this)
  },
  
  
  /* usually called by the associated story but should work individually */
  quit: function() {
    // cancel existing quit timer
    console.log('Quitting storybit');
    clearTimeout(this._end_timer);
    this._wrapup();
  },
  
  /* internal functions */
  
  /* called when the function ends *naturally* */
  _end: function(this_bit) {
    console.log('Ending storybit');
    this_bit._wrapup();
    this_bit.fire('storybitend', this_bit, propogate = true);
  },

  _wrapup: function() {
    // remove any layers that've been turned on and not turned off
    console.log('Wrapping up storybit');
    console.log(this);
    for (annotation in this._annotation)
      if (this._map.hasLayer(annotation.overlay))
        this._map.removeLayer(annotation.overlay);
    
    // remove the baselayer (if there is one)
    if (this._baselayer !== undefined)
      if (this._map.hasLayer(this._baselayer))
        this._map.removeLayer(this._baselayer);
    
    // remove all timers (no sweat if they've already fired)
    for (id of this._movement_timers) clearTimeout(id);
    for (id of this._annotation_timers) clearTimeout(id);
  },

  _move: function(map, at, options, samezoom) {
    console.log('Moving to [' + at[0] + ', ' + at[1] + '] (' + samezoom + ')');
    // if (samezoom)
    //   map.panTo(at, L.extend({ animate: true }, options));
    // else
      map.flyTo(at, options.zoom, L.extend({ animate: true }, options));
  },

  _addAnnotation: function(overlay, map) {
    overlay.addTo(map);

  },

  _removeAnnotation: function(overlay) {
    overlay.remove();
  }

});

L.storyBit = function(options) {
  return new L.StoryBit(options);
}

/* ========================================================================== */

// L.StoryBit.Animated = L.StoryBit.extend({

// });

// L.storyBit.animated = function() {
//   return new L.StoryBit.Animated();
// }

/* ========================================================================== */

L.Story = L.Evented.extend({

  options: {
    name: 'Default name',
    description: 'Default description',
    at: L.latLng([0, 60]),
    zoom: 4
  },

  _current_storybit: 0,  // track currently playing story

  initialize: function(storybits, options, map) {
    L.setOptions(this, options);
    this._name = this.options.name;
    this._description = this.options.description;
    if (map !== undefined)
      this.setMap(map);

    // add each storybit to the story and give it map and story handles
    this._storybits = [];
    if (storybits !== undefined)
      for (bit_i of storybits) {
        bit_i._setStory(this);
        this._storybits.push(bit_i);
        if (map !== undefined)
          bit_i.setMap(this._map);
      }
  },

  addStoryBits: function(new_storybits) {
    for (bit_i of new_storybits) {
      bit_i._setStory(this);
      this._storybits.push(bit_i);
      if (this._map !== undefined)
      bit_i.setMap(this._map);
    }
  },

  setMap: function(map) {
    this._map = map;

    for (bit_i of this._storybits) {
      bit_i.setMap(map);
    }
  },

  /* createMenuItem: returns an html element that, when clicked,
     calls this.load. optionally attaches the element to a
     parent dom id. */
  createMenuItem: function(parent_id) {
    var item;
    
    // create item div and optionally attach to parent
    if (parent_id !== undefined && parent_id !== '')
      item = L.DomUtil.create(
        'button', 'story_menu_item', L.DomUtil.get(parent_id));
    else
      item = L.DomUtil.create('button', 'story_menu_item');

    // create and attach button contents
    var item_name = document.createElement('h2');
    item_name.innerHTML = this._name;
    item.appendChild(item_name);
    var item_description = document.createElement('p');
    item_description.innerHTML = this._description;
    item.appendChild(item_description);
    
    // add event listener for button interaction
    L.DomEvent.on(item, 'click touch', this.load, this);
    
    return item;
  },

  /* load: get things set up. really just exists to fire an event: i want to have transition code happen externally to this but still set the initail view
  internally. separating load and play allows that to happen!  */
  load: function() {
    
    console.log(this._name + ': loading story');
    this.fire('storyload', this);
  },

  play: function() {
    
    console.log(this._name + ': playing story');
    this._map.setView(this.options.at, this.options.zoom, { animate: false });

    // load first storybit, if it's there
    if (this._storybits.length > 0)
      this._storybits[this._current_storybit].load();
    else
      console.error(this.name + ': no story bits loaded in this story!');
      
    // event handlers
    this.on('storybitend storybitskip', this._nextStoryBit);
    
    // TODO - register a callback for keyboard interrupts

  },

  _nextStoryBit: function() {
    console.log(this._name + ': story bit finished');

    // next story bit (if that wasn't the last one)
    this._current_storybit++;
    if (this._current_storybit < this._storybits.length) {
      console.log(this._name + ': loading next story bit');
      this._storybits[_current_storybit].load();
    } else
      this._end();
  },

  quit: function() {
    // quit the current storybit as well, if one is still going
    if (this._current_storybit < this._storybits.length)
      this._storybits[_current_storybit].quit();
    this.fire('storyquit', this);
    this._current_storybit = 0;
  },

  _end: function() {
    this.fire('storyend', this);
    this._current_storybit = 0;
  }

});

L.story = function(storybits, options, map) {
  return new L.Story(storybits, options, map);
}
