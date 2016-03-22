var KeyboardSignal = require('../index.js')
var kbs = new KeyboardSignal(document.body)
var E_EL = document.getElementById('E')
var KC_EL = document.getElementById('69')

function makeUpdate () {
  var last = Date.now()
  var current = Date.now()
  var dT = current - last

  return function update (dT) {
    last = current
    current = Date.now()
    dT = current - last

    KeyboardSignal.update(dT, kbs)

    E_EL.innerText = 'E: ' + JSON.stringify(kbs.E, null, 2)
    KC_EL.innerText = '69: ' + JSON.stringify(kbs[69], null, 2)

    if (kbs.E.mode === 'JUST_DOWN') console.log('You just pushed E')
    requestAnimationFrame(update)
  }
}

window.kbs = kbs
requestAnimationFrame(makeUpdate())
