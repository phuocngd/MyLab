"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = exports.app = void 0;

var _express = _interopRequireWildcard(require("express"));

var _path = require("path");

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _http = require("http");

var _socket = require("socket.io");

var _dragonTiger = _interopRequireDefault(require("./dragonTiger/socketHandler/dragon-tiger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const app = (0, _express.default)();
exports.app = app;
const httpServer = (0, _http.createServer)(app);
const io = new _socket.Server(httpServer, {
  cors: {
    origin: 'http://localhost:7456',
    methods: ['GET', 'POST']
  },
  path: '/socketIo/dragon-tiger/'
});
app.use((0, _morgan.default)('dev'));
app.use((0, _express.json)());
app.use((0, _cors.default)());
app.use((0, _express.urlencoded)({
  extended: false
}));
app.use((0, _cookieParser.default)());
app.use(_express.default.static((0, _path.join)(__dirname, 'public')));
io.on('connection', socket => {
  console.log('a user connected', socket.id);
  socket.on('dragon-tiger', req => (0, _dragonTiger.default)(io.to(socket.id), req));
});

const start = async () => {
  try {
    httpServer.listen(4500, () => {
      console.log(`REST API on http://localhost:${4500}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

exports.start = start;