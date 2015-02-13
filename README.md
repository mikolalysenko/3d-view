3d-view
=======
This module is a generic interface which synchronizes several existing view interactions

* [turntable-camera-controller](https://github.com/mikolalysenko/turntable-camera-controller)
* [orbit-camera-controller](https://github.com/mikolalysenko/orbit-camera-controller)
* [matrix-camera-controller](https://github.com/mikolalysenko/orbit-camera-controller)

Each camera controller proceeds by appending events onto a log of 

# API

[Try a more complete demo here](https://mikolalysenko.github.io/3d-view)

```javascript
var now            = require('right-now')
var bunny          = require('bunny')
var perspective    = require('gl-mat4/perspective')
var fit            = require('canvas-fit')
var createContext  = require('gl-context')
var createAxes     = require('gl-axes')
var createMesh     = require('gl-simplicial-complex')
var createCamera   = require('3d-view')

//Set up WebGL
var canvas = document.createElement('canvas')
document.body.appendChild(canvas)
window.addEventListener('resize', fit(canvas), false)
var gl = createContext(canvas, {}, render)

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
  center:  [
    0.5*(bounds[0][0]+bounds[1][0]),
    0.5*(bounds[0][1]+bounds[1][1]),
    0.5*(bounds[0][2]+bounds[1][2]) ],
  eye: [0, 0, bounds[1][2]],
  distanceLimits: [1, 1000]
})

//Create mode drop down
var modeSelect = document.createElement('select')
camera.modes.forEach(function(mode) {
  modeSelect.add(new Option(mode, mode))
})
modeSelect.style.position = 'absolute'
modeSelect.style.left = '10px'
modeSelect.style.top = '10px'
modeSelect.style['z-index'] = 10
document.body.appendChild(modeSelect)


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
  var dx =  (ev.clientX - lastX) / gl.drawingBufferWidth
  var dy = -(ev.clientY - lastY) / gl.drawingBufferHeight
  if(ev.which === 1) {
    if(ev.shiftKey) {
      //zoom
      camera.rotate(now(), 0, 0, dx)
    } else {
      //rotate
      camera.rotate(now(), dx, dy)
    }
  } else if(ev.which === 3) {
    //pan
    camera.pan(now(), dx, dy)
  }
  lastX = ev.clientX
  lastY = ev.clientY
})

canvas.addEventListener('wheel', function(e) {
  camera.pan(now(), 0, 0, e.deltaY)
})

//Redraw frame
function render() {

  //Update camera parameters
  var t = now()
  camera.idle(t - 20)
  camera.flush(t - 100)

  //Compute parameters
  var cameraParams = {
    view: camera.getMatrix(t - 25),
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
}
```

## Constructor

#### `var camera = require('3d-view')([options])`

## Methods

#### `camera.getMatrix(t[, out])`
Computes the state of the camera matrix at time `t`

* `t` is the time 
* `out` is an optional length 16 array that gets the current matrix

**Returns** the current view matrix

#### `camera.idle(t)`
Idles the camera at time `t`

* `t` is the time to idle at

#### `camera.flush(t)`
Flush all events in camera state before time `t`

* `t` is the cut off time for the flush

#### `camera.modes`
An array of modes supported by the camera

#### `camera.setMode(mode)`
Sets the camera mode

* `mode` is the new mode.  Must be either `turntable`, `orbit` or `matrix`

#### `camera.getMode()`
Retrieves the current camera mode

#### `camera.lookAt(t, eye, center, up)`
Reset camera position to focus on a specified target

* `t` is the time of the event
* `eye` is the position of the camera
* `center` is the target of the camera
* `up` is a vector pointing up

#### `camera.rotate(t, yaw, pitch, roll)`
Rotates the camera incrementally by some amount

* `t` is the time of the input event
* `yaw` is the amount to rotate by along y-axis in radians
* `pitch` is the amount to rotate by along x-axis in radians
* `roll` is the amount to rotate by along z-axis in radians

#### `camera.pan(t, dx, dy, dz)`
Pans the camera in local (view relative) coordinates

* `t` is the time of the event
* `dx,dy,dz` is the amount to move

#### `camera.translate(t, dx, dy, dz)`
Translates the camera in world (absolute global) coordinates

* `t` is the time of the event
* `dx,dy,dz` is the amount to move

#### `camera.setMatrix(t, matrix)`
Sets the camera matrix to some fixed 4x4 matrix

* `t` is the time of the event
* `matrix` is the new camera matrix

#### `camera.getUp(t[, out])`
Gets the up vector of the camera

* `t` is the time of the event
* `out` is a storage vector (optional) recieving the up vector

**Returns** the up vector

#### `camera.getEye(t[, out])`
Returns the position of the camera in world coordinates

* `t` is the time to sample
* `out` is storage for the result

**Returns** the position of the camera

#### `camera.getCenter(t[, out])`
Returns the target of the camera (only affects turntable and orbit mode)

#### `camera.getDistance(t)`
Returns distance to target at time `t` (only affects turntable and orbit mode)

#### `camera.setDistance(t, r)`
Sets camera distance at time `t`

* `t` is the time of the event
* `r` is the new camera distance

#### `camera.setDistanceLimits(lo, hi)`
Sets bounds on the camera distance

#### `camera.getDistanceLimits([out])`
Retrieves the camera limitsx

# License
(c) 2015 Mikola Lysenko. MIT License