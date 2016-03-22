var Enum = require('tiny-enum')
var KeyboardSignal = require('../index.js')
var kbs = new KeyboardSignal(document.body)
var E_EL = document.getElementById('E')
var KC_EL = document.getElementById('69')

function replacer (key, value) {
  return key === 'previousMode' || key === 'mode' ? value.toString() : value
}

function makeUpdate () {
  var last = Date.now()
  var current = Date.now()
  var dT = current - last

  return function update (dT) {
    last = current
    current = Date.now()
    dT = current - last

    KeyboardSignal.update(dT, kbs)

    E_EL.innerText = 'E: ' + JSON.stringify(kbs.E, replacer, 2)
    KC_EL.innerText = '69: ' + JSON.stringify(kbs[69], replacer, 2)

    if (kbs.CTRL.mode.DOWN && kbs.C.mode.JUST_DOWN) console.log('Copy!')
    if (kbs.CTRL.mode.DOWN && kbs.V.mode.JUST_DOWN) console.log('Paste!')
    requestAnimationFrame(update)
  }
}

window.kbs = kbs
requestAnimationFrame(makeUpdate())
