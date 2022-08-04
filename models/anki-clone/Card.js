import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    question: {
        type: String,
        trim: true,
        required: 'Question field is required'
    },
    answer: {
        type: String,
        trim: true,
        required: 'Answer field is required'
    }
});

const Card = mongoose.model('Card', cardSchema);

export default Card;