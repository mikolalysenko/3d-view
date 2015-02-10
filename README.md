3d-view
=======


# API

## Constructor

#### `var camera = require('3d-view')([options])`

## Methods

#### `camera.getMatrix(t[, out])`

#### `camera.idle(t)`

#### `camera.flush(t)`

#### `camera.setMode(mode)`

#### `camera.getMode()`

#### `camera.lookAt(t, center, eye, up)`

#### `camera.rotate(t, yaw, pitch, roll)`

#### `camera.zoom(t, dr)`

#### `camera.pan(t, dx, dy, dz)`

#### `camera.translate(t, dx, dy, dz)`

#### `camera.move(t, dx, dy, dz)`
Similar behavior to `camera.pan`, however the up-vector is locked.

#### `camera.setDistance(t, r)`

#### `camera.setMatrix(t, matrix)`

#### `camera.getUp(t[, out])`

#### `camera.getCenter(t[, out])`

#### `camera.getEye(t[, out])`

#### `camera.getDistance(t)`

# License
(c) 2015 Mikola Lysenko. MIT License