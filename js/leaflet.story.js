/* L.StoryBit: a base class for story 'bits' that are displayed sequentially in a story. */

L.StoryBit = L.Evented.extend({

  _movement_timers: [],
  _annotation_timers: [],
  _commentary_el: null,

  options: {
    baselayer_label: 'No baselayer',
    baselayer: undefined,
    movements: [],
    annotations: [],
    end_pause: 0,
    commentary_el_class: 'story-commentary',
    commentary_parent: document.body,
    padding_topleft: [0, 0],
    padding_bottomright: [0, 0]
  },

  setMap: function(map)     { this._map = map; },
  _setStory: function(story) {
    this._story = story;
    this.addEventParent(story);
    this._padding_topleft = story.options.padding_topleft;
    this._padding_bottomright = story.options.padding_bottomright;
  },
  
  initialize: function(options) {
    // TODO - do some checking on movements and annotations
    L.setOptions(this, options);
    this._baselayer_label = this.options.baselayer_label;
    this._baselayer = this.options.baselayer;
    this._movements = this.options.movements;
    this._annotations = this.options.annotations;
    this._end_pause = this.options.end_pause;
    this._commentary_el_class = this.options.commentary_el_class;
    this._padding_topleft = this.options.padding_topleft;
    this._padding_bottomright = this.options.padding_bottomright;

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
    if (this._map === undefined)
      console.error('This StoryBit has no map associated with it. Attach ' +
        'a map either to this StoryBit using this.setMap() or to an ' +
        'attached Story using story.setMap().');
    else {
      if (this._baselayer !== undefined)
        this._baselayer.addTo(this._map);
      this.play();
    }
  },

  play: function() {

    // create a commentary container and turn it on
    this._commentary_el = L.DomUtil.create('div',
      this._commentary_el_class, document.body);
    L.DomUtil.addClass(this._commentary_el, 'toggled_on');
    
    this.fire('storybitplay', this, propogate = true);

    /* okay, we're gonna set up a whole heap of event listeners for the pans and
       annotations. when the last of either is done, we'll fire `storybitend` */

    // set up movements using setTimeout (and hold onto the timer ids!)
    var ongoing_duration = 0;

    for (var i = 0; i < this._movements.length; i++) {

      var movement;
      if (this._movements[i].type == 'panBy')
        movement = this._movements[i].by;
      else
        movement = this._movements[i].at;

      this._movement_timers.push(
        setTimeout(this._move, ongoing_duration,
          movement, this, this._movements[i].options, this._movements[i].type));

      ongoing_duration += (this._movements[i].options.duration * 1000);
    }

    // now set up annotation toggles using setTimeout
    // (we need separate timers for turning them on and off)
    var latest_removal = 0;
    console.log('Number of annotations: ' + this._annotations.length);
    for (var i = 0; i < this._annotations.length; i++) {
      
      var type = this._annotations[i].type,
          content = this._annotations[i].content,
          when = this._annotations[i].when * 1000;
      
      switch (type) {

        case 'comment':
          // comment: add to 
          this._annotation_timers.push(
            setTimeout(this._addCommentary, when, this._commentary_el,
                content));
          break;

        case 'clear_comments':
          // ... set up a timer to clear all comments
          this._annotation_timers.push(
            setTimeout(this._resetCommentary, when, this._commentary_el));
          if (when > latest_removal) latest_removal = when;
          break;

        case 'layer':
          // regular layers: set up timers to turn on and off
          var duration = this._annotations[i].duration * 1000,
              when_end = when + duration;

          console.log('Adding annotation layer:');
          // add a className option to the content
          if (content.options.className === undefined)
            content.options.className = 'story-annotation'
          else
            content.options.className += ' story-annotation'
          
          this._annotation_timers.push(
            setTimeout(
              this._addAnnotation, when, content, this._map));
          this._annotation_timers.push(
            setTimeout(this._removeAnnotation, when_end, content))
          if (when_end > latest_removal) latest_removal = when_end;
          break;

        default:
          console.error('storybitplay: annotation\'s overlay property should either be a string or a Leaflet layer.');
      }      
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
    this_bit.fire('storybitquit', this_bit, propogate = true);
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
    // remove any layers and comments that've been turned on and not turned off
    console.log('Wrapping up storybit');
    // console.log(this);
    for (annotation in this._annotation)
      if (this._map.hasLayer(annotation.overlay))
        this._map.removeLayer(annotation.overlay);
    
    // remove the baselayer (if there is one)
    if (this._baselayer !== undefined)
      this._baselayer.remove();
      // if (this._map.hasLayer(this._baselayer)) {
      //   console.log('Removing StoryBit baselayer');
      //   this._map.removeLayer(this._baselayer);
      // }
    
    this._destroyCommentary(this._commentary_el);
    
    // remove all timers (no sweat if they've already fired)
    for (id of this._movement_timers) clearTimeout(id);
    for (id of this._annotation_timers) clearTimeout(id);
  },

  /* _move: used to execute map movements. can either do a pan or fly to a
     point, or a fly to a bounds (depending on at) */
  _move: function(at, bit, options, move_point_type = 'flyTo') {

    // TODO - needs some parameter error checking!
    switch (move_point_type) {
      case 'panTo':
        bit._map.panTo(at, L.extend({ animate: true }, options));
        break;
      case 'panBy':
        bit._map.panBy(at, L.extend({ animate: true }, options))
        break;
      case 'flyTo':
        bit._map.flyTo(at, options.zoom, L.extend({ animate: true },
          options));
      case 'flyToBounds':
        bit._map.flyToBounds(at, L.extend({
          paddingTopLeft:
            typeof this._padding_topleft == 'function' ?
              this._padding_topleft(this._bit._map) :
              this._padding_topleft,
          paddingBottomRight:
            typeof this._padding_bottomright == 'function' ?
              this._padding_bottomright(this._bit._map) :
              this._padding_bottomright 
        }, options));
        break;
      case 'fitWorld':
        bit._map.fitWorld(L.extend({
          paddingTopLeft:
            typeof this._padding_topleft == 'function' ?
              this._padding_topleft(this._bit._map) :
              this._padding_topleft,
          paddingBottomRight:
            typeof this._padding_bottomright == 'function' ?
              this._padding_bottomright(this._bit._map) :
              this._padding_bottomright
        }, options));
        break;
      default:
        console.error('Unrecognised movement type: should be ' +
          'panBy, panTo, flyTo or flyToBounds.');
      }
  },

  /* add and remove annotation layers from the map */
  _addAnnotation: function(overlay, map) {

    // add story-annotation to the overlay's class list
    if (overlay.options.className == undefined) {
      overlay.options.className = 'story-annotation'
    } else {
      overlay.options.className += ' story-annotation'
    }
    
    overlay.addTo(map);

    // now, add the toggled_on class to each node
    // (for some reason, setStyle can't be used after attaching to the map)
    // (also, a timer is needed to trigger animation)
    if (overlay._renderer instanceof L.SVG) {
      for (i = 0; i < overlay._renderer._rootGroup.children.length; i++) {
        setTimeout(function(overlay_child) {
          overlay_child.classList.add('toggled_on');
        }, 0, overlay._renderer._rootGroup.children[i])
      }
    }
  },

  _removeAnnotation: function(overlay, map) {

    // remove toggled_on from each overlay node (if SVG)
    if (overlay._renderer instanceof L.SVG) {
      for (i = 0; i < overlay._renderer._rootGroup.children.length; i++) {
        setTimeout(function(overlay_child) {
          overlay_child.classList.remove('toggled_on');
        }, 0, overlay._renderer._rootGroup.children[i])
      }
    }

    // not sure how to remove it on an event, so i'll just a use a hacky timer
    setTimeout(function() { overlay.remove(); }, 500);
  },

  /* add commentary p elements to the given parent, and clear them all */
  _addCommentary: function(target, comment) {
    console.log('Adding commentary');
    var to_append = document.createElement('p');
    to_append.innerHTML = comment;
    target.appendChild(to_append);
    setTimeout(L.DomUtil.addClass, 20, to_append, 'toggled_on');
  },

  /* _resetCommentary: transition the target comementary parent out, then empty
     it out. finally, transition it back in (empty) */
  _resetCommentary: function(target) {
    function empty_and_reset() {
      console.log('Transition ended, emptying commentary');
      L.DomEvent.off(this, 'transitionend', empty_and_reset, this);
      L.DomUtil.empty(this);
      L.DomUtil.addClass(this, 'toggled_on');
    }
    console.log('Resetting commentary after fade out');
    L.DomEvent.on(target, 'transitionend', empty_and_reset, target);
    L.DomUtil.removeClass(target, 'toggled_on');
  },

  /* _destroyCommentary: transition the target commentary out, then destory
     it */
  _destroyCommentary: function(target) {
    function destroy() {
      console.log('Transition ended, destroying commentary');
      console.log(this);
      L.DomEvent.off(this, 'transitionend', destroy, this);
      L.DomUtil.remove(this);
    }
    console.log('Destroying commentary after fade out');
    L.DomEvent.on(target, 'transitionend', destroy, target);
    L.DomUtil.removeClass(target, 'toggled_on');
  }

});

L.storyBit = function(options) {
  return new L.StoryBit(options);
}

/* ========================================================================== */

L.StoryBit.Animated = L.StoryBit.extend({

  options: {
    // preparing_classname: 'storybit-preparing'
    time_start: undefined,
    time_end:   undefined
  },

  _td_player: undefined,
  _set_td_player: function(td_player) { this._td_player = td_player; },
  _frames: undefined,
  _start_dt: undefined,
  _end_dt: undefined,

  initialize: function(td_player, options) {
    L.StoryBit.prototype.initialize.call(this, options);
    this._set_td_player(td_player);
    this._start_dt = new Date(this.options.time_start);
    this._end_dt = new Date(this.options.time_end);
    this._frames = this._baselayer.options.cache;
  },

  load: function() {
    this.fire('storybitload', this, propogate = true);
    console.log('Loading animated storybit');

    // attach the baselayer to the map if there's on of each
    if (this._map === undefined)
      console.error('This StoryBit has no map associated with it. Attach ' +
        'a map either to this StoryBit using this.setMap() or to an ' +
        'attached Story using story.setMap().');
    else if
      (this._td_player === undefined || this._map.timeDimension === undefined)
      console.error('Need a timeDimension associated with the map and a ' +
        'timeDimension player associated with this StoryBit.');
    else {
      if (this._baselayer !== undefined) {
        /* for StoryBit.Animated, we need to attach this layer, set the time
           range, set the animation to start playing and, and only play once we
           detect it's run its course (to make sure it's cached properly). */
           
        /* TODO - i also want to hide the layer until i know it's run its course
           (in the event this isn't the first storybit in the story), but i'm
           not 100% sure that appending a css class before attaching will work
           (b/c even if i take it off later, timedimension will continue to use
           it for newly created time slices) */
        this._baselayer.addTo(this._map);

        if (this._start_dt === undefined || this._end_dt === undefined)
          console.error('time_start and time_end options are required if you' +
            'provide a timeDimension baselayer.');

        var td = this._map.timeDimension,
            tdp = this._td_player;

        /* set the time bounds for the story:
           first limits going OUT, then current time, then limits going IN */
        var currentIndices = [
          td.getLowerLimitIndex() || 0,
          td.getCurrentTimeIndex(),
          td.getUpperLimitIndex() || td._availableTimes.length - 1,
        ];
        var newIndices = [
          td._seekNearestTimeIndex(this._start_dt),
          td._seekNearestTimeIndex(this._start_dt),
          td._seekNearestTimeIndex(this._end_dt),
        ];
        console.log('Changing limits from ' + currentIndices + ' to ' +
          newIndices);
        
        // limits moving OUT go BEFORE currentTime
        if (currentIndices[0] > newIndices[0])
          td.setLowerLimitIndex(newIndices[0]);
        if (newIndices[2] > currentIndices[2])
          td.setUpperLimitIndex(newIndices[2]);

        // move currentTime.
        // gotcha: it won't actually upate 'til the layer has loaded!
        td.on('timeload', this._prefetch_animation, this);
        td.setCurrentTimeIndex(newIndices[1]);

        // limits moving IN go AFTER currentTime
        if (currentIndices[0] < newIndices[0])
          td.setLowerLimitIndex(newIndices[0]);
        if (newIndices[2] < currentIndices[2])
          td.setUpperLimitIndex(newIndices[2]);
        
        // (limits not moving don't matter)
      }
      else
        this.play();  // if there's no baselayer, just play the bit without it
    }
  },

  _prefetch_animation: function() {
    td.off('timeload', this._prefetch_animation, this);
    console.log('New limits are ' + [
      td._lowerLimit, td._currentTimeIndex, td._upperLimit]);

    /* prefetch the animation frames, then play when we have them */
    this._baselayer.on('timeload', this._check_to_play, this);
    console.log('Fetching ' + this._frames + ' frames before starting; ' +
      td.getNumberNextTimesReady(1, this._frames, true) +
      ' already available');
    td.prepareNextTimes(1, this._frames, true);
  },

  _check_to_play: function() {
    if (td.getNumberNextTimesReady(1, this._frames, true) < this._frames) {
      // still waiting
      // console.log('Waiting (' +
      //   td.getNumberNextTimesReady(1, this._frames, true) + ' of ' +
      //   this._frames + ' frames ready)')
    } else {
      // ready!
      // console.log('let\'s go');
      this._baselayer.off('timeload', this._check_to_play, this);
      // td.off('timeload', preload_storybit_frames, this);
      this._map.timeDimension.setCurrentTime(this._start_dt.valueOf());
      this._td_player.start();
      this.play();
    }
  },

  // extra _wrapup: leave the timedimension player the way we found it
  _wrapup: function() {
    var tdp = this._td_player;
    // console.log(tdp);
    tdp.stop();
    // console.log(this);
    // this._baselayer._unvalidateCache();
    this._baselayer._evictCachedTimes(0, 0);
    L.StoryBit.prototype._wrapup.call(this);
  }

});

L.storyBit.animated = function(td_player, options) {
  return new L.StoryBit.Animated(td_player, options);
}

/* ========================================================================== */

L.Story = L.Evented.extend({

  options: {
    name: 'Default name',
    description: 'Default description',
    at: L.point([0, 60]),
    zoom: 4,
    padding_topleft: [0, 0],
    padding_bottomright: [0, 0],
  },

  _current_storybit: 0,  // track currently playing story

  initialize: function(storybits, options, map) {
    L.setOptions(this, options);
    this._name = this.options.name;
    this._description = this.options.description;
    this._padding_topleft = this.options.padding_topleft;
    this._padding_bottomright = this.options.padding_bottomright;
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
        'button', 'story-menu-item', L.DomUtil.get(parent_id));
    else
      item = L.DomUtil.create('button', 'story-menu-item');

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

    // either use setView or fitBounds, provided on whether a point or a
    // bound is given. use padding and aspect ratio from options for the latter
    if (
      typeof this.options.at[0] == 'object' ||
      this.options.at instanceof L.Bounds) {
      // bounds: use fitBounds (with padding depending on orientation)
      this._map.fitBounds(this.options.at, {
        paddingTopLeft:
          typeof this._padding_topleft == 'function' ?
            this._padding_topleft(this._map) :
            this._padding_topleft,
        paddingBottomRight:
          typeof this._padding_bottomright == 'function' ?
            this._padding_bottomright(this._map) :
            this._padding_bottomright,
        animate: false
      });
    } else if (
      typeof this.options.at[0] == 'number' ||
      this.options.at instanceof L.Point) {
      // point: use setView
      this._map.setView(this.options.at, this.options.zoom, { animate: false });
    } else {
      console.error('Either give a point or a bounds for the story\'s at property.');
    }

    // load first storybit, if it's there
    if (this._storybits.length > 0) {
      console.log('Story has ' + this._storybits.length + ' bits');
      this._current_storybit = 0;
      this._storybits[0].load();
    }
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
      console.log(this._name + ': loading next story bit (number ' +
      this._current_storybit + ')');
      this._storybits[this._current_storybit].load();
    } else
      this._end();
  },

  quit: function() {
    // quit the current storybit as well, if one is still going
    if (this._current_storybit < this._storybits.length)
      this._storybits[_current_storybit].quit();
      this._current_storybit = 0;
      this.fire('storyquit', this);
  },

  _end: function() {
    this._current_storybit = 0;
    this.fire('storyend', this);
  }

});

L.story = function(storybits, options, map) {
  return new L.Story(storybits, options, map);
}
