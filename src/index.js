var Enum = require('tiny-enum')
var CONSTANTS = require('./CONSTANTS')
var KEY_COUNT = CONSTANTS.KEY_COUNT
var BASE_KEY_MAP = CONSTANTS.BASE_KEY_MAP

var KEY_MODE = new Enum('DOWN', 'UP', 'JUST_DOWN', 'JUST_UP')

function KeyState () {
  this.nextMode = KEY_MODE.UP
  this.mode = KEY_MODE.UP
  this.downDuration = 0
}

module.exports = KeyboardSignal

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


    self.active = true
    if (ks) ks.nextMode = KEY_MODE.DOWN
  }

  function keyup (e) {
    var ks = self[e.keyCode]

    self.active = true
    if (ks) ks.nextMode = KEY_MODE.UP

    if (e.keyCode === 91 || e.keyCode === 93) reset()
  }

  function blur () {
    self.active = false
  }

  function focus () {
    self.active = true
  }

  function reset () {
    for (var i = 0; i < KEY_COUNT; i++) {
      self[i].nextMode = KEY_MODE.UP
    }
  }

  this.active = false
  this.eventListeners = {
    keydown: keydown,
    keyup: keyup,
    blur: blur,
    focus: focus
  }
}

KeyboardSignal.KeyState = KeyState

KeyboardSignal.KEY_MODE = KEY_MODE

KeyboardSignal.update = function (dT, kbs) {
  for (var i = 0, ks; ks = kbs[i]; i++) {
    if      (!kbs.active)                       ks.mode = KEY_MODE.UP
    else if (ks.mode.JUST_DOWN)                 ks.mode = KEY_MODE.DOWN
    else if (ks.mode.JUST_UP)                   ks.mode = KEY_MODE.UP
    else if (ks.nextMode.DOWN && !ks.mode.DOWN) ks.mode = KEY_MODE.JUST_DOWN
    else if (ks.nextMode.UP && !ks.mode.UP)     ks.mode = KEY_MODE.JUST_UP
    else                                        ks.mode = ks.nextMode

    if (!kbs.active || ks.mode.UP || ks.mode.JUST_DOWN) ks.downDuration = 0
    else                                                ks.downDuration += dT
  }
  return kbs
}

KeyboardSignal.prototype.toString = function () {
  var out = ''

  for (var i = 0; i < KEY_COUNT; i++) {
    for (var j = 0; j < 10; j++) {
      out += this[i].mode.toString() + ' /\t' + this[i].downDuration + '\t'
    }
    out += '\n'
  }
  return out
}
