/* */

L.Story = L.Evented.extend({

  options: {
    name  : 'Default name',
    description: 'Default description',
    selectable: true,
    next_story: ''
  },

  _current_storybit: 0,  // track currently playing story

  initialize: function(storybits, options) {
    L.setOptions(this, options);

    // add each storybit to the story
    this._storybits = [];
    if (storybits !== undefined)
      for (bit_i of storybits)
        this._storybits.push(bit_i);

    // define event handlers
    this.on('storybitfinished', this.nextStoryBit);
    
  },

  addStoryBits: function(new_storybits) {
    this._storybits = this._storybits.concat(new_storybits);
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
    item_name.innerHTML = this.options.name;
    item.appendChild(item_name);
    var item_description = document.createElement('p');
    item_description.innerHTML = this.options.description;
    item.appendChild(item_description);
    
    // add event listener for button interaction
    L.DomEvent.on(item, 'click touch', this.loadStory, this);
    
    return item;
  },

  /* loadStory: get things set up */
  loadStory: function() {
    
    console.log(this.options.name + ': loading story');
    this.fire('storyloading');

    if (this._storybits.length < 1)
      console.error(this.name + ': no story bits loaded in this story!');
    else {
      this._storybits[_current_storybit].loadStoryBit();
    }
  },

  nextStoryBit: function() {
    console.log(this.options.name + ': story bit finished');

    _current_storybit++;

    // next story bit (if that wasn't the last one)
    if (this._current_storybit < this._storybits.length) {
      console.log(this.options.name + ': loading next story bit');
      this._storybits[_current_storybit].loadStoryBit();
    } else {
      // no more bits! story over
      this.fire('storyend');
    }

  }

});

L.story = function(storybits, options) {
  return new L.Story(storybits, options);
}

/* ========================================================================== */

// L.StoryBit = L.Evented.extend({

//   options: {
//     story,
//     // baselayer: 'TXx_ann_series',
//     // year_start: '1995',
//     // year_end: '2002',
//     // col_low: '25',
//     // col_med: '35',
//     // col_hi: '45',

//     zoom: 4,
//     center_start: [35, 250],
//     center_end: [35, 260],
//   },

//   initialize: function(options) {
//     L.setOptions(this, options);

//     if (this.options.story !== undefined) {
//       this.addEventParent(this.options.story);
//     } else {
//       console.error('StoryBit cannot initialize without a story reference.');
//     }
//   }

// });

// L.StoryBit.addInitHook(function() {

// });

// L.storyBit = function() {
//   return new L.StoryBit();
// }

// /* ========================================================================== */

// L.StoryBit.Animated = L.StoryBit.extend({

// });

// L.StoryBit.Animated.addInitHook(function() {

// });

// L.storyBit.animated = function() {
//   return new L.StoryBit.Animated();
// }

// /* ========================================================================== */

// L.StoryBit.Static = L.StoryBit.extend({

// });

// L.StoryBit.Static.addInitHook(function() {

// });

// L.storyBit.static = function() {
//   return new L.StoryBit.Static();
// }