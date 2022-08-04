import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required'
    },
    password: {
        type: String,
        trim: true,
        required: 'Password is required'
    },
    decks: [{ type : mongoose.ObjectId, ref: 'Deck' }]
});

const User = mongoose.model('User', userSchema);

export default User;