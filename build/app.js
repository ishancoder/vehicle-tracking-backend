"use strict";

require("@babel/polyfill");

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _db = _interopRequireDefault(require("./db/db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var logger = (0, _morgan["default"])('tiny');
var PORT = process.env.PORT || 8000; // Setup socket and server

var app = (0, _express["default"])();

var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server);
io.origins('*:*');
app.use(logger);
app.use(_bodyParser["default"].json()); // Allowing every origin for now.

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _db["default"].getAllVehicles();

          case 3:
            result = _context.sent;
            res.json(result);
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            res.status(500).json(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.put('/add',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body, type, lat, lng, speed, result;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, type = _req$body.type, lat = _req$body.lat, lng = _req$body.lng, speed = _req$body.speed;

            if (!(!type || lat == null || lng == null || speed == null)) {
              _context2.next = 4;
              break;
            }

            res.status(400).json({
              err: "Make sure your request have 'type', 'speed', 'lat' and 'lng'"
            });
            return _context2.abrupt("return");

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return _db["default"].addNewVehicle(type, lat, lng, speed);

          case 7:
            result = _context2.sent;
            io.emit('new-vehicle', result.data);
            res.json(result);
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](4);
            res.json(_context2.t0);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 12]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.post('/update/:vehicleId',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var vehicleId, _req$body2, lat, lng, speed, result;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            vehicleId = req.params.vehicleId;
            _req$body2 = req.body, lat = _req$body2.lat, lng = _req$body2.lng, speed = _req$body2.speed;

            if (!(lat == null || lng == null || !vehicleId || speed == null)) {
              _context3.next = 5;
              break;
            }

            res.status(400).json({
              err: "Make sure your request have 'lat', 'lng', 'speed' and there should be a 'vehicleId' in URL params"
            });
            return _context3.abrupt("return");

          case 5:
            _context3.prev = 5;
            _context3.next = 8;
            return _db["default"].updatePosition(vehicleId, lat, lng, speed);

          case 8:
            result = _context3.sent;
            io.emit('update', result.data);
            res.json(result);
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](5);
            res.status(500).json(_context3.t0);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 13]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
io.on("connection",
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee4() {
  var result;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _db["default"].getAllVehicles();

        case 2:
          result = _context4.sent;
          if (result.status === "SUCCESS") io.emit('initial-data', result.data);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4);
})));
server.listen(PORT, function () {
  return console.log("App is running on port : ".concat(PORT));
});