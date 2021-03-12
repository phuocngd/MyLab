"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeRandomHistory = exports.createCard = void 0;
const TYPE = ['A', 'B', 'C', 'D'];
const CARDS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const getRandomValue = (max, min = 0) => Math.floor(Math.random() * max) + min;

const compareCard = (cardOne, cardTwo) => {
  if (cardOne.value === cardTwo.value) return 'draw';
  const winner = [cardOne, cardTwo].sort(function (a, b) {
    return b.value - a.value;
  });
  return winner[0].name;
};

const randomCard = name => {
  const card = getRandomValue(13);
  const type = getRandomValue(4);
  return {
    card: CARDS[card] + TYPE[type],
    value: card,
    name: name
  };
};

const makeRandomHistory = () => {
  const gameHistory = [];
  let item = 100;

  while (item > 0) {
    gameHistory.push({
      gameResult: getRandomValue(3, 1)
    });
    item--;
  }

  return gameHistory;
};

exports.makeRandomHistory = makeRandomHistory;

const createCard = preGame => {
  const dragonCard = randomCard('dragon');
  const tigerCard = randomCard('tiger');
  const winnerValue = compareCard(dragonCard, tigerCard);
  const newGame = {
    dragonCard: dragonCard.card,
    tigerCard: tigerCard.card,
    winner: winnerValue
  };
  return newGame;
};

exports.createCard = createCard;