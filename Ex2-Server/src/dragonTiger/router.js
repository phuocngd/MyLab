import { Router } from 'express';
import { createCard } from './helper/helper';
var router = Router();

/* GET users listing. */
router.get('/result', (req, res) => {
  let card = createCard();
  console.log('card', card);
  res.status(200).json(card);
});

export default router;
