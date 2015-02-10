'use strict'

module.exports = createViewController

var createTurntable = require('turntable-camera-controller')
var createOrbit     = require('orbit-camera-controller')
var createFree      = require('free-camera-controller')
var createMatrix    = require('matrix-camera-controller')

function ViewController(controllers, mode) {
  this._controllerNames = Object.keys(controllers)
  this._controllerList = this._controllerNames.map(function(n) {
    return controllers[n]
  })
  this._mode        = mode
  this._active      = controllers[mode]
}

var proto = ViewController.prototype

var COMMON_METHODS = [
  ['flush', 1],
  ['idle', 1],
  ['lookAt', 4],
  ['rotate', 4],
  ['zoom', 2],
  ['pan', 4],
  ['translate', 4],
  ['move', 4],
  ['setDistance', 2],
  ['setMatrix', 2]
]

var ACCESS_METHODS = [
  ['getDistance', 1],
  ['getUp', 2],
  ['getCenter', 2],
  ['getEye', 2],
  ['getMatrix', 2]
]

COMMON_METHODS.forEach(function(method) {
  var name = method[0]
  var args = method[1]
  var argNames = []
  for(var i=0; i<argNames.length; ++i) {
    argNames.push('a'+i)
  }
  var code = 'var cc=this._controllerList;for(var i=0;i<cc.length;++i){cc.'+method[0]+'('+argNames.join+')}'
  proto[name] = Function.apply(null, argNames.concat(code))
})

ACCESS_METHODS.forEach(function(method) {
  var name = method[0]
  var args = method[1]
  var argNames = []
  for(var i=0; i<argNames.length; ++i) {
    argNames.push('a'+i)
  }
  var code = 'return this._active.' + name + '(' + argNames.join() + ')'  
  proto[name] = Function.apply(null, argNames.concat(code))
})

proto.setMode = function(mode) {
  if(mode === this._mode) {
    return
  }
  var idx = this._controllerNames.indexOf(mode)
  if(idx < 0) {
    return
  }
  var prev = this._active
  var next = this._controllerList[idx]
}

proto.getMode = function() {
  return this._mode
}

function createViewController(options) {
}