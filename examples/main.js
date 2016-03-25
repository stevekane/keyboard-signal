var Enum = require('tiny-enum')
var KeyboardSignal = require('../index.js')
var kbs = new KeyboardSignal(document.body)
var KBS_EL = document.getElementById('KBS')

for (var key in kbs.eventListeners) {
  document.body.addEventListener(key, kbs.eventListeners[key])
}

document.body.addEventListener('keydown', kbs.eventListeners.keydown)
document.body.addEventListener('keyup', kbs.keyup)
document.body.addEventListener('blur', kbs.blur)
document.body.addEventListener('focus', kbs.focus)

function makeUpdate () {
  var last = Date.now()
  var current = Date.now()
  var dT = current - last

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
}

requestAnimationFrame(makeUpdate())
