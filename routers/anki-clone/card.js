import {createCard, updateCard, deleteCard} from '../../controllers/anki-clone/card.js';
import {Router} from 'express';

const cardRouter = Router();

cardRouter.post('/', createCard);
cardRouter.patch('/:id', updateCard);
cardRouter.delete('/:id', deleteCard)

export default cardRouter;