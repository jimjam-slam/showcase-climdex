## Classes:
  - L.Story
  - L.StoryBit
  - L.StoryBit.Animated
  - L.StoryBit.Static
  - L.StoryBit.Null

## L.Story

### Methods

### Options

### Events

Event          | Data | Description
---------------|------|-------------
`storyloading` |      | Fired when the story begins loading. If you need to do any prep work, like clearing other layers off the map or resetting parts of the UI, this is a good place to attach that.
`storyend`     |      | Fired when the story ends. Use this to restore UI functionality if it's been disabled.


## L.StoryBit

```
var my_bit = L.storyBit(
  [0, 30], 4, {
    baselayer: L.Layer(),
    movements: [
      [[0, 30],              { zoom: 4, duration: 3} ],
      [L.LatLng([20, 95]),   { zoom: 5, duration: 6} ]
    ],
    annotations: [
      { overlay: L.ImageOverlay(), when: 5, duration: 3 }
    ]
  });
```

### Methods

### Options

Option      | Data  | Description
------------|-------|-------------------------------------------
`baselayer` | Layer | A `L.GridLayer` object to display with the storybit.
`movements` | Array | An array containing arguments for a series of `flyTo` or `panTo` calls. Each arraay element should be a two-element array containing the arguments for these functions: (1) an `L.LatLng` object or lat/lon array, and (2) options to be passed on.

### Events

Event | Data | Description
------|------|-------------


## L.StoryBit.Animated

### Methods

### Options

### Events
