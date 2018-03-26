/* */

L.

/* ========================================================================== */

/* L.StoryBit: a base class for story 'bits' that are displayed sequentially in a story. each 

  */

L.StoryBit = L.Evented.extend({

  options: {
    baselayer = {},
    movements: [],
    annotations: [],
    end_pause: 0
  },

  // _story,
  // _map,
  _movement_timers: [],
  _annotation_timers: [],

  setMap: function(map)     { this._map = map; },
  setStory: function(story) {
    this._story = story;
    this.addEventParent(story);
  },

  /* _clearTimers: use to cancel the rest of the storybit elements (eg. if the
    story is interrupted) */
  _clearTimers: function() {
    for (id of this._timer_ids) {
      clearTimeout(id);
    }
  },
  
  initialize: function(at, zoom, options) {
    L.setOptions(this, options);

    // TODO - do some checking on movements and annotations
    this._init = {};
    this._init.at = at || L.latLng([0, 60]);
    this._init.zoom = zoom || 4;
    this._baselayer = this.options.baselayer;
    this._movements = this.options.movements;
    this._annotations = this.options.annotations;
    this._end_pause = this.options.end_pause;

    // add event listeners
    if (this._baselayer !== undefined) {
      this._baselayer.addEventParent(this);
      this.one('load', this.play);
    }
    
  },

  load: function() {
    this.fire('storybitloading');

    // attach the baselayer to the map if there's on of each
    if (this._baselayer !== undefined)
      if (this._map !== undefined) {
        this._baselayer.addTo(this._map);
      }
      else console.error(
          'This StoryBit has no map associated with it. Either:\n' +
          '  Add it to a story using story.addStoryBits(), or\n' +
          '  Attach it to a map separately using this.setMap().');
  },

  play: function() {
    // okay, we're gonna set up a whole heap of event listeners for the pans and
    // annotations. when the last of either is done, we'll fire `storybitend`

    // set up movements using setTimeout (and hold onto the timer ids!)
    var ongoing_duration = 0;
    var ongoing_zoom = this._init.zoom;
    for (var i = 0; i < this._movements.length; i++) {
      var samezoom = this.movements[i].options.zoom == ongoing_zoom;

      this._movement_timers.push(
        setTimeout(this._move, ongoing_duration, 
          this.movements[i].at, this.movements[i].options, samezoom));
      ongoing_zoom = this.movements[i].options.zoom;
      ongoing_duration += (movement[1].duration * 1000);
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
        setTimeout(this._addAnnotation, when_start_i, overlay_i));
      this._annotation_timers.push(
        setTimeout(this._removeAnnotation, when_end_i, overlay_i))
      if (when_end_i > latest_removal) latest_removal = when_end_i;
    }

    // and, finally, set a quit timer
    this._quit_timer = setTimeout(this.quit,
      Math.max(ongoing_duration, latest_removal) + (this._end_pause * 1000))
  },

  quit: function() {
    // cancel existing quit timer
    clearTimeout(this._quit_timer);
    
    // remove any layers that've been turned on and not turned off
    for (annotation in this._annotation)
      if (this._map.hasLayer(annotation.overlay))
        this._map.removeLayer(annotation.overlay);
    
    // remove all timers (no sweat if they've already fired)
    for (id of this._movement_timers) clearTimeout(id);
    for (id of this._annotation_timers) clearTimeout(id);
    
    // TODO - what happens if it's an interrupt and it goes to the next bit?
    this.fire('storybitend')
  }

  /* timer functions */

  _move: function(at, options, samezoom) {
    if (samezoom) this._map.panTo(at, options);
    else          this._map.flyTo(at, options.zoom, options);
  },

  _addAnnotation: function(overlay) {
    overlay.addTo(this._map);

  },

  _removeAnnotation: function(overlay) {

  }

});

L.storyBit = function(options) {
  return new L.StoryBit(options);
}

/* ========================================================================== */

L.StoryBit.Animated = L.StoryBit.extend({

});

L.storyBit.animated = function() {
  return new L.StoryBit.Animated();
}

/* ========================================================================== */

L.Story = L.Evented.extend({

  options: {
    name  : 'Default name',
    description: 'Default description',
    map
  },

  _current_storybit: 0,  // track currently playing story

  initialize: function(storybits, options) {
    L.setOptions(this, options);
    this._name = this.options.name;
    this._description = this.options.description;

    // add each storybit to the story and give it map and story handles
    this._storybits = [];
    if (storybits !== undefined)
      for (bit_i of storybits) {
        bit_i.setStory(this);
        bit_i.setMap(this.map);
        this._storybits.push(bit_i);
      }
      
    // event handlers (mostly from child stories)
    this.on('storybitfinished', this.nextStoryBit);
    
  },

  addStoryBits: function(new_storybits) {
    for (bit_i of new_storybits) {
      bit_i.setStory(this);
      bit_i.setMap(this.map);
      this._storybits.push(bit_i);
    }
  },

  /* createMenuItem: returns an html element that, when clicked,
     calls this.loadStory. optionally attaches the element to a
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
    L.DomEvent.on(item, 'click touch', this.loadStory, this);
    
    return item;
  },

  /* loadStory: get things set up */
  loadStory: function() {
    
    console.log(this._name + ': loading story');
    this.fire('storyloading');

    if (this._storybits.length < 1)
      console.error(this.name + ': no story bits loaded in this story!');
    else {
      this._storybits[_current_storybit].load();
    }
  },

  nextStoryBit: function() {
    console.log(this._name + ': story bit finished');

    _current_storybit++;

    // next story bit (if that wasn't the last one)
    if (this._current_storybit < this._storybits.length) {
      console.log(this._name + ': loading next story bit');
      this._storybits[_current_storybit].load();
    } else {
      // no more bits! story over
      this.fire('storyend');
    }

  }

});

L.story = function(storybits, options) {
  return new L.Story(storybits, options);
}
