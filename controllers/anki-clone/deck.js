import Deck from '../../models/anki-clone/Deck.js';
import User from '../../models/anki-clone/User.js';
import Card from '../../models/anki-clone/Card.js';

async function createDeck(req, res){
    // Create a deck for the given user
    const name = req.body.name;
    if (!name){return res.status(400).json({message:'A name property must be added!'});}

    try{
        // Check the user
        const user = await User.findOne({_id: req.user.id}).exec();
        if (!user){return res.status(400).json({message:`User not found!`})};

        // Create a new deck
        const newDeck = await Deck.create({name});

        // Link deck to user
        const update = {$push: {'decks':newDeck._id }};
        await User.findOneAndUpdate({_id: req.user.id}, update);

        return res.status(200).json({message: 'Successfully added a new Deck', data: {_id:newDeck._id, name:newDeck.name, size: 0}});
    }catch (e){
        // Check for required values
        if (e._message === 'User validation failed'){
            return res.status(400).json({message:e.message});
        }

        // Check for unique values
        if (e.code === 11000){
            const field = Object.keys(e.keyValue);
            return res.status(400).json({message:`The given ${field} is already taken`});
        }

        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

async function updateDeck(req, res){
    const id = req.params.id;
    const name = req.body.name;
    if (!name || !id){return res.status(400).json({message:'Missing field!'});}

    try{
        // Check the user
        const user = await User.findOne({_id: req.user.id}).exec();
        if (!user){return res.status(400).json({message:`User not found!`})};

        // Check if the deck is from user
        if (!user.decks.includes(id)){return res.status(401).json({message:`Unauthorized: The specified deck can not be accessed by the user`})}

        // Update deck
        const updatedDeck = await Deck.findOneAndUpdate({_id: id}, {name, name}, {new:true});

        if (!updatedDeck){
            return res.status(400).json({message:`Deck not found!`})
        }

        return res.status(200).json({message: `Successfully updated deck ${name} with id ${id}`, data: updatedDeck});
    }catch (e){
        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

async function getAllDecksFromUser(req, res){
    try{
        // Check the user
        const user = await User.findOne({_id: req.user.id}).exec();
        if (!user){return res.status(400).json({message:`User not found!`})};

        // Get all decks
        const decks = await Deck.find().where('_id').in(user.decks).select({name:1, size: {$size: '$cards'}}).exec();

        return res.status(200).json({message: `All decks from user ${user.name}!`, data: decks});
    }catch (e){
        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

async function getDeckById(req, res){
    const id = req.params.id;
    if (!id){return res.status(400).json({message:'Missing field: id!'});}

    try{
        // Check the user
        const user = await User.findOne({_id: req.user.id}).exec();
        if (!user){return res.status(400).json({message:`User not found!`})};

        // Check if the deck is from user
        if (!user.decks.includes(id)){return res.status(401).json({message:`Unauthorized: The specified deck can not be accessed by the user`})}

        // Find deck
        const deck = await Deck.findById(id);
        if (!deck){
            return res.status(400).json({message:`Deck not found!`})
        }

        // Resolve cards
        const cards = await Card.find().where('_id').in(deck.cards).exec();
        deck.cards = cards;

        return res.status(200).json({message: `Successfully retrieved the deck ${deck.name}`, data: deck});
    }catch (e){
        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

async function deleteDeck(req, res){
    const id = req.params.id;
    if (!id){return res.status(400).json({message:'Missing field: id!'});}

    try{
        // Check the user
        const user = await User.findOne({_id: req.user.id}).exec();
        if (!user){return res.status(400).json({message:`User not found!`})};

        // Check if the deck is from user
        if (!user.decks.includes(id)){return res.status(401).json({message:`Unauthorized: The specified deck can not be accessed by the user`})}

        // Find deck
        const deck = await Deck.findById(id);
        if (!deck){return res.status(200).json({message:`Deck not found!`})}

        // Delete referenced cards
        const ids = deck.cards;
        const deleteResponse = await Card.deleteMany( {_id:{$in:ids}} );

        if (!deleteResponse.acknowledged){res.status(500).json({message: `Server Error: Can not delete deck at the moment!`});}

        // Erase deck
        const deletedDeck = await Deck.deleteOne({_id: id});

        if (!deletedDeck.acknowledged){res.status(500).json({message: `Server Error: Can not delete card at the moment!`});}

        // Update user: erase reference to deck in user document
        // Unlink deck to user
        const update = {$pull: {'decks':id }};
        await User.findOneAndUpdate({_id: req.user.id}, update);


        return res.status(200).json({message: `Successfully erased deck ${deck.name}`, data: deletedDeck});
    }catch (e){
        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

export {createDeck, updateDeck, getAllDecksFromUser, getDeckById, deleteDeck}