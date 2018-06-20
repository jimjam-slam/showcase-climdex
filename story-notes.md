# Leaflet.Story

A Leaflet plugin that helps you show users layers in a guided way.

A Story is made up a of a series of StoryBits. Each StoryBit has a starting location and zoom. StoryBits can pan or fly to a series of other locations or zoom levels, and they can display annotations (other layers) for a nominate duration. They can also have a baselayer that is displayed for as long as the StoryBit runs.

When a Story is loaded, it will load each storybit in turn until they end or the Story is interrupted using `L.Story.quit()`. Any layers displayed by a currently running bit will be removed if the story is quit or if the StoryBit is skipped.

If you don't need to display a series of StoryBits, you can use one StoryBit on its own!

You can use the events fired (in particular, `storyloading`/`storybitloading` and `storyend storyquit`/`storybitend storybitquit storybitskip`) to prepare your UI and disable aspects of interactivity if you don't want users to interrupt a currently playing Story or StoryBit.

## Example

```js
// build the story
var my_story = L.Story(
  [
    L.storyBit(
      [0, 30], 4, {
        baselayer: L.Layer(),
        movements: [
          { at: [0, 30],             options: { zoom: 4, duration: 3} },
          { at: L.LatLng([20, 95]),  options: { zoom: 5, duration: 6} }
        ],
        annotations: [
          { overlay: L.ImageOverlay(), when: 5, duration: 3 }
        ]
      }),
    another_storybit,
    yet_another_storybit
  ],
  {
    name: "My World Tour",
    description: "An action-packed tour!"
  },
  map);

// use event handlers to go into 'story mode' when you don't want people
// interrupting things 
```

## API
  - [L.Story](#lstory)
  - [L.StoryBit](#lstorybit)
  <!-- - [L.StoryBit.Animated](#lstorybitanimated) -->

## L.Story

```js
L.story(
  storybits,    // an array of StoryBit objects
  options,      // see Options, below
  map);         // a map to direct. can attach later with setMap()
```

### Methods

Method             | Returns     | Description 
-------------------|-------------|------------
`L.story`          | L.Story     | Factory method. Use this to create a new Story.
`initialize()`     |             | Called when the object is created. Sets options, attaches a map (if one is given) and attaches any given storybits.
`addStoryBits()`   |             | Allows additional storybits to be added after initialisation.
`setMap()`         |             | Gives this story, and any currently attached StoryBits, a reference to the given map.
`createMenuItem()` | HTMLElement | Returns an HTML element that, when clicked, calls `this.load()`. Optionally attaches the element to a parent container with a given DOM ID.
`load()`           |             | Loads the first attached StoryBit and adds event handlers to automatically load subsequent ones.
`quit()`           |             | Quit the story before it ends naturally. Use this as a callback to DOM events if you want a keyboard or button interrupt.

### Options

Option                | Type                         | Default                 | Description
----------------------|------------------------------|-------------------------|------------
`name`                | String                       | `"Default name"`        | A name for the story. Used by `createMenuItem()`. 
`description`         | String                       | `"Default description"` | A description for the story. Used by `createMenuItem()`.
`map`                 | Object                       | `{}`                    | A Leaflet map to control. can be set later.
`at`                  | Array, `L.point`, `L.bounds` | `L.point([0, 60])`      | A point or bounds at which to begin the story.
`zoom`                | Number                       | `4`                     | An initial zoom. Not used if `at` is a bounds.
`padding_topleft`     | Array, Function              | `[0, 0]`                | Either an array for padding `fitBounds` in the top-left, or a reference to a function that returns such an array (taking a map argument).
`padding_bottomright` | Array, Function              | `[0, 0]`                | Either an array for padding `fitBounds` in the bottom-right, or a reference to a function that returns such an array (taking a map argument).

### Events

Event          | Data | Description
---------------|------|-------------
`storyload` |      | Fired when the story begins loading. If you need to do any prep work, like clearing other layers off the map or resetting parts of the UI, this is a good place to attach that.
`storyend`     |      | Fired when the story ends _naturally_ (ie. it isn't interrupted). Use this to restore UI functionality if it's been disabled.
`storyquit`    |      | Fired when `this.quit()` is called. Use this to restore UI functionality if it's been disabled during the story.

## L.StoryBit

```js
L.storyBit(
  at,
  zoom,
  options);

var my_bit = L.storyBit(
  [0, 30], 4, {
    baselayer: L.Layer(),
    movements: [
      { at: [0, 30],             options: { zoom: 4, duration: 3} },
      { at: L.LatLng([20, 95]),  options: { zoom: 5, duration: 6} }
    ],
    annotations: [
      { overlay: L.ImageOverlay(), when: 5, duration: 3 }
    ]
  });
```

### Methods

Method             | Returns     | Description 
-------------------|-------------|------------
`L.storyBit`       | L.StoryBit  | Factory method. Use this to create a new Story.
`setMap()`         |             | Gives this StoryBit a reference to the given map.
`initialize()`     |             | Called when the object is created. Sets options, attaches a map (if one is given) and attaches any given storybits.
`load()`           |             | Loads an attached baselayer and calls `this.play()`. If you have a special layer that needs time to load asynchronously, you might want to override this method. 
`play()`           |             | Starts playing the StoryBit, setting up timers for the annotations and viewport movements described.
`quit()`           |             | Quit the story before it ends naturally, clearing any still-displayed layers and clearing any forthcoming movements or annotations. Use this as a callback to DOM events if you want a keyboard or button interrupt.

### Options

Option                  | Type            | Default              | Description                     
------------------------|-----------------|----------------------|---------------------------------
`baselayer`             | Layer           | `{}`                 | A `L.GridLayer` object to display with the StoryBit.
`movements`             | Array           | `[]`                 | An array containing arguments for a series of `flyTo` or `panTo` calls. Each array element should be an object containing the arguments for these functions: `at`, an `L.LatLng` object or lat/lon array; and `options`, options to be passed on.
`annotations`           | Array           | `[]`                 | An array of objects. Each object should have `overlay`, a layer to be shown; `when`, the time (in seconds) after playing the bit at which the annotation should be shown; and `duration`, the time (in seconds) for which it should be shown.
`end_pause`             | Number          | `0`                  | The time (in seconds) for which the bit should pause after the last annotation disappears or movement completes before quitting.
`commentary_parent`     | Object          | `document.body`      | The DOM element to which to append the StoryBit's commentary container.
`commentary_el_class`   | String          | `"story-commentary"` | A CSS class that will be applied to the StoryBit's commentary container.
`padding_topleft`       | Array, Function | `[0, 0]`             | Either an array for padding `fitBounds` in the top-left, or a reference to a function that returns such an array (taking a map argument). Overridden by the associated story.
`padding_bottomright`   | Array, Function | `[0, 0]`             | Either an array for padding `fitBounds` in the bottom-right, or a reference to a function that returns such an array (taking a map argument). Overridden by the associated story.
commentary_el_class: 'story-commentary',
    commentary_parent: document.body,

### Events

Event             | Data | Description
------------------|------|-------------
`storybitload`    |      | Fired when the storybit begins loading.
`storybitplay`    |      | Fired when the storybit begins playing.
`storybitend`     |      | Fired whens a storybit ends naturally.
`storybitskip`    |      | Fired when a storybit is 'skipped' part way through.
`storybitquit`    |      | Fired when the storybit is quit altogether.

## L.StoryBit.Animated

### Methods

### Options

Option                | Type   | Default                | Description                     
----------------------|--------|------------------------|---------------------------------
`preparing_classname` | String | `"storybit-preparing"` | A CSS class name to be appended to the layers created by 

### Events
