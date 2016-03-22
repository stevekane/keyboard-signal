var Enum = require('tiny-enum')
var CONSTANTS = require('./CONSTANTS')
var KEY_COUNT = CONSTANTS.KEY_COUNT
var BASE_KEY_MAP = CONSTANTS.BASE_KEY_MAP

var KEY_MODE = new Enum('INACTIVE', 'DOWN', 'UP', 'JUST_DOWN', 'JUST_UP')

module.exports = KeyboardSignal

function KeyState () {
  this.previousMode = KEY_MODE.UP
  this.mode = KEY_MODE.UP
  this.downDuration = 0
}

function KeyboardSignal (body, keyMap) {
  keyMap = keyMap || BASE_KEY_MAP
  var self = this

  for (var i = 0; i < KEY_COUNT; i++) {
    this[i] = new KeyState
  }

  for (var key in keyMap) defProp(key)

  function defProp (key) {
    Object.defineProperty(self, key, {
      enumerable: false,
      get: function () { 
        var keyCode = keyMap[key]
        var ks = self[keyCode]

        return ks
      }
    }) 
  }

  function keydown (e) {
    var ks = self[e.keyCode]

    if (ks.mode !== KEY_MODE.DOWN) ks.mode = KEY_MODE.JUST_DOWN
  }

  function keyup (e) {
    var ks = self[e.keyCode]

    ks.mode = KEY_MODE.JUST_UP
  }

  function blur () {
    for (var i = 0, ks; ks = self[i]; i++) {
      ks.mode = KEY_MODE.INACTIVE
    }
  }

  function focus () {
    for (var i = 0, ks; ks = self[i]; i++) {
      ks.mode = KEY_MODE.UP
    }
  }

  body.addEventListener('keydown', keydown)
  body.addEventListener('keyup', keyup)
  body.addEventListener('blur', blur)
  body.addEventListener('focus', focus)
}

KeyboardSignal.update = function (dT, kbs) {
  for (var i = 0, ks; ks = kbs[i]; i++) {
    if      (ks.previousMode === KEY_MODE.JUST_DOWN) ks.mode = KEY_MODE.DOWN
    else if (ks.previousMode === KEY_MODE.JUST_UP)   ks.mode = KEY_MODE.UP
    else {}
    ks.downDuration = ks.mode === KEY_MODE.DOWN ? ks.downDuration + dT : 0
    ks.previousMode = ks.mode
  }
}
