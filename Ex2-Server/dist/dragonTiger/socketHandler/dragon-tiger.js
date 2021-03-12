"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helper = require("../helper/helper");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let catchPreGameResult = {
  gameResult: ''
};

const handler = (io, req) => {
  switch (req.type) {
    case 1:
      const historyGame = (0, _helper.makeRandomHistory)();
      console.log(historyGame);
      io.emit('dragon-tiger', {
        resType: req.type,
        data: historyGame
      });
      break;

    case 2:
      const card = (0, _helper.createCard)(catchPreGameResult);

      const res = _objectSpread(_objectSpread({}, card), {}, {
        isEqualPreGame: Boolean(catchPreGameResult.gameResult === card.gameResult)
      });

      io.emit('dragon-tiger', {
        resType: req.type,
        data: res
      });
      catchPreGameResult = card;
      console.log('res', res);
      break;
  }
};

var _default = handler;
exports.default = _default;