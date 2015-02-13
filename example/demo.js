'use strict'

var now            = require('right-now')
var bunny          = require('bunny')
var perspective    = require('gl-mat4/perspective')
var fit            = require('canvas-fit')
var createContext  = require('gl-context')
var createAxes     = require('gl-axes')
var createMesh     = require('gl-simplicial-complex')
var createCamera   = require('../view')

//Set up WebGL
var canvas = document.createElement('canvas')
document.body.appendChild(canvas)
window.addEventListener('resize', fit(canvas), false)
var gl = createContext(canvas, {}, render)

var controlDiv = document.createElement('div')
controlDiv.style.position = 'absolute'
controlDiv.style['z-index'] = 10
controlDiv.style.left = '10px'
controlDiv.style.top = '10px'
document.body.appendChild(controlDiv)

var delayControl = document.createElement('input')
delayControl.type = 'range'
delayControl.min = 0
delayControl.max = 200
delayControl.value = 30
controlDiv.appendChild(delayControl)

var modes = ['turntable', 'orbit', 'matrix']
var modeSelect = document.createElement('select')
for(var i=0; i<modes.length; ++i) {
  var option = document.createElement('option')
  option.text = modes[i]
  option.value = modes[i]
  modeSelect.add(option)
}
controlDiv.appendChild(modeSelect)

var lookAtButton = document.createElement('input')
lookAtButton.type = 'submit'
lookAtButton.value = 'Reset'
controlDiv.appendChild(lookAtButton)

var statusElement = document.createElement('p')
statusElement.style['font-size'] = '30%'
controlDiv.appendChild(statusElement)

//Create objects for rendering
var bounds = [[-10,-10,-10], [10,10,10]]
var mesh = createMesh(gl, {
    cells: bunny.cells,
    positions: bunny.positions,
    colormap: 'jet'
  })
var axes = createAxes(gl, {
    bounds: bounds,
    tickSpacing: [1,1,1],
    textSize: 0.05
  })

//Set up camera
var projectionMatrix = new Array(16)
var camera = createCamera({
  radius: 50,
  center:  [
    0.5*(bounds[0][0]+bounds[1][0]),
    0.5*(bounds[0][1]+bounds[1][1]),
    0.5*(bounds[0][2]+bounds[1][2]) ]
})

//Hook event listeners
var lastX = 0, lastY = 0

document.oncontextmenu = function(e) { 
  e.preventDefault()
  e.stopPropagation()
  return false 
}

modeSelect.addEventListener('change', function(ev) {
  camera.setMode(modeSelect.value)
})

canvas.addEventListener('mousemove', function(ev) {
  var dx = (ev.clientX - lastX) / gl.drawingBufferWidth
  var dy = (ev.clientY - lastY) / gl.drawingBufferHeight
  if(ev.which === 1) {
    camera.rotate(now(), dx, dy)
  }
  if(ev.which === 3) {
    camera.pan(now(), dx, dy)
  }
  lastX = ev.clientX
  lastY = ev.clientY
})

canvas.addEventListener('wheel', function(e) {
  camera.zoom(now(), e.deltaY)
})

lookAtButton.addEventListener('click', function() {
  camera.lookAt(now(),
    [ 0, 0, -50 ],
    [ 0.5*(bounds[0][0]+bounds[1][0]),
      0.5*(bounds[0][1]+bounds[1][1]),
      0.5*(bounds[0][2]+bounds[1][2]) ],
    [ 0, 1, 0 ])
})

//Redraw frame
function render() {
  //Update camera parameters
  var t = now()
  var delay = +delayControl.value
  camera.idle(t - delay)
  camera.flush(t - 100 * (delay + 1))

  //Compute parameters
  var cameraParams = {
    view: camera.getMatrix(t - 2*delay),
    projection: perspective(
      [],
      Math.PI/4.0,
      gl.drawingBufferWidth/gl.drawingBufferHeight,
      0.1,
      1000.0)
  }

  //Draw everything
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.enable(gl.DEPTH_TEST)
  axes.draw(cameraParams)
  mesh.draw(cameraParams)

  //Write out status stuff
  statusElement.innerHTML = 
    '<p>Zoom=' + camera.getZoom(t-2*delay) + 
    '</p><p>Up=[' + camera.getUp(t-2*delay).join() + 
    ']</p><p>Eye=[' + camera.getEye(t-2*delay).join() + 
    ']</p><p>Matrix=</p><table><tr><td>' + cameraParams.view.slice(0,4).join('</td><td>') + 
    '</td></tr><tr><td>' + cameraParams.view.slice(4,8).join('</td><td>') + 
    '</td></tr><tr><td>' + cameraParams.view.slice(8,12).join('</td><td>') + 
    '</td></tr><tr><td>' + cameraParams.view.slice(12,16).join('</td><td>') + 
    '</td></tr></table>'
}