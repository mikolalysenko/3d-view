3d-view
=======
This module is a generic interface which synchronizes several existing view interactions

* [turntable-camera-controller](https://github.com/mikolalysenko/turntable-camera-controller)
* [orbit-camera-controller](https://github.com/mikolalysenko/orbit-camera-controller)
* [matrix-camera-controller](https://github.com/mikolalysenko/orbit-camera-controller)

Each camera controller proceeds by appending events onto a log of 

# API

```javascript
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
Returns the target of the camera

#### `camera.getDistance(t)`

#### `camera.setDistance(t, r)`

#### `camera.setDistanceLimits(lo, hi)`

#### `camera.getDistanceLimits([out])`

# License
(c) 2015 Mikola Lysenko. MIT License