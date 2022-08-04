import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
    name: String,
    cards: [{ type : mongoose.ObjectId, ref: 'Card' }]
});

const Deck = mongoose.model('Deck', deckSchema);

export default Deck;