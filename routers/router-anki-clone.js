import deckRouter from './anki-clone/deck.js';
import userRouter from './anki-clone/user.js';
import cardRouter from './anki-clone/card.js';
import { Router } from 'express';

import {verifyToken} from '../controllers/anki-clone/middleware/index.js';

const ankiCloneRouter = Router();
ankiCloneRouter.use('/user', userRouter);
ankiCloneRouter.use('/deck', verifyToken, deckRouter);
ankiCloneRouter.use('/card', verifyToken, cardRouter);

export default ankiCloneRouter;