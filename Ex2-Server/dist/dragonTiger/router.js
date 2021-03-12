"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _helper = require("./helper/helper");

var router = (0, _express.Router)();
/* GET users listing. */

router.get('/result', (req, res) => {
  let card = (0, _helper.createCard)();
  console.log('card', card);
  res.status(200).json(card);
});
var _default = router;
exports.default = _default;