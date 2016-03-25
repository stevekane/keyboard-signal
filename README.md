# KeyboardSignal

Wrap the keyboard events emitted by the browser and transform them into a data structure that can be queried in an intuitive way.  Refer to keys by keyCode (e.g. 32 for SPACE), use convenient mappings to familiar names, or provide your own custom mappings as parameters to the constructor.

## Queries

Queries are dead simple.  Simply ask your keyboard signal instance for their mode as well as the duration that the key has been held down.

## API

This package exports a single constructor.  In the vast majority of apps, you will create a singleton instance of this and use it throughout your application for keyboard-driven behavior.  The module has one function which you will need to call yourself in your "update-loop" for this system to behave as expected.

```javascript
var kbs = new KeyboardSignal(HTMLElement) // This is most often your document body

function update () {
  KeyboardSignal.update(dT, kbs) // dT is determined by you.  pass 0 if you don't care about downDuration for keys
  requestAnimationFrame(update)
}
```

## Example usage

```javascript
var kbs = new KeyboardSignal(document.body)
var last = Date.now()
var current = Date.now()
var dT = current - last

for (var key in kbs.eventListeners) {
  document.body.addEventListener(key, kbs.eventListeners[key])
}

return function update (dT) {
  last = current
  current = Date.now()
  dT = current - last

  KeyboardSignal.update(dT, kbs)

  if (kbs.CTRL.mode.DOWN && kbs.C.mode.JUST_DOWN)               console.log('Copy!')
  if (kbs.CTRL.mode.DOWN && kbs.V.mode.JUST_DOWN)               console.log('Paste!')
  if (kbs.SPACE.mode.JUST_UP && kbs.SPACE.downDuration >= 1000) console.log('fire the missiles')

  requestAnimationFrame(update)
}
```

## FAQ
### Is there a similar module for handling the mouse?
Yes there is.  The sister module [MouseSignal ](https://github.com/stevekane/mouse-signal) will handle mouse events for any HTML element provided.

### Why do I have to provide a dT parameter myself?
This application assumes you're running your code with a run-loop.  It also assumes you likely already have a clock-like mechanism defined according to your preferences.  Thus, you are expected to proude and provide the dT parameter if you would like to be able to track the duration a key has been held down.  If you don't care about that feature, just pass 0 and the system will not track downDuration for keys.

### Why do I have to bind the eventListeners myself?
I do not want to require you to tear this system down using a custom destructor or any other adhoc system like that.  JS has no standardized approach to freeing resources and I don't wish to impose one on you.  Finally, and more importantly, I want you to be free to choose HOW and WHEN to bind your event listeners.  For example, in React.js or a similar Virtual DOM library, you may want to bind them in your React components and allow React itself to unbind them when that component is no longer being rendered.  An example of this common case is included below.

```javascript
import React from 'react'
import DOM from 'react-dom'

const kbs = new KeyboardSignal(document.body)

DOM.render(<div {...kbs.eventListeners} id="app-root"></div>, document.body)
```
