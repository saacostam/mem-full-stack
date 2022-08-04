import {createDeck, updateDeck, getAllDecksFromUser, getDeckById, deleteDeck} from '../../controllers/anki-clone/deck.js';
import { Router } from 'express';

const deckRouter = Router();

deckRouter.get('/:id', getDeckById);
deckRouter.get('/', getAllDecksFromUser);
deckRouter.post('/', createDeck);
deckRouter.patch('/:id', updateDeck);
deckRouter.delete('/:id', deleteDeck);

export default deckRouter;