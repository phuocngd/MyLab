import { createCard, makeRandomHistory } from '../helper/helper';

let catchPreGameResult = { gameResult: '' };

const handler = (io, req) => {
  switch (req.type) {
    case 1:
      const historyGame = makeRandomHistory();
      console.log(historyGame);
      io.emit('dragon-tiger', { resType: req.type, data: historyGame });
      break;
    case 2:
      const card = createCard(catchPreGameResult);
      const res = {
        ...card,
        isEqualPreGame: Boolean(
          catchPreGameResult.gameResult === card.gameResult
        )
      };

      io.emit('dragon-tiger', { resType: req.type, data: res });
      catchPreGameResult = card;
      console.log('res', res);
      break;
  }
};
export default handler;
