"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _uuid = require("uuid");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function vehiclesData() {
  this.store = {};
}

vehiclesData.prototype.getAllVehicles = function () {
  return Promise.resolve({
    status: "SUCCESS",
    data: Object.values(this.store)
  });
};

vehiclesData.prototype.addNewVehicle = function (type, initLat, initLng, initSpeed) {
  var id = (0, _uuid.v4)();
  this.store[id] = {
    id: id,
    type: type,
    lat: initLat,
    lng: initLng,
    speed: initSpeed,
    lastMoved: Date.now(),
    lastUpdated: Date.now()
  };
  return Promise.resolve({
    status: "SUCCESS",
    data: _objectSpread({}, this.store[id])
  });
};

vehiclesData.prototype.updatePosition = function (id, newLat, newLng, speed) {
  if (!this.store[id]) {
    return Promise.reject({
      status: "FAILED",
      err: "No Vehicle exists with id: ".concat(id)
    });
  }

  var _this$store$id = this.store[id],
      lat = _this$store$id.lat,
      lng = _this$store$id.lng;
  var lastMoved = newLat !== lat || newLng !== lng ? Date.now() : this.store[id].lastMoved;
  this.store[id] = _objectSpread({}, this.store[id], {
    lat: newLat,
    lng: newLng,
    speed: speed,
    lastMoved: lastMoved,
    lastUpdated: Date.now()
  });
  return Promise.resolve({
    status: "SUCCESS",
    data: _objectSpread({}, this.store[id])
  });
};

var vDB = new vehiclesData();
var _default = vDB;
exports["default"] = _default;