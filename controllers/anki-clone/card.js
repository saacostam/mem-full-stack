import User from '../../models/anki-clone/User.js';
import Deck from '../../models/anki-clone/Deck.js';
import Card from '../../models/anki-clone/Card.js';

async function createCard(req, res){
    const id = req.body.id;
    const question = req.body.question;
    const answer = req.body.answer;

    if (!id || !question || !answer){return res.status(400).json({message:'Missing field!'});}

    try{
        // Check the user
        const user = await User.findOne({_id: req.user.id}).exec();
        if (!user){return res.status(400).json({message:`User not found!`})};

        // Check if the deck is from user
        if (!user.decks.includes(id)){return res.status(401).json({message:`Unauthorized: The specified deck can not be accessed by the user`})}

        // Check deck
        const deck = await Deck.findById(id);
        if (!deck){return res.status(400).json({message:`Deck not found!`})}

        // Create new Card
        const newCard = await Card.create({question, answer});

        // Add new card to deck
        deck.cards.push(newCard._id);
        const newDeck = await deck.save();

        return res.status(200).json({message: `Successfully added a new card to deck ${newDeck.name}`, data: newCard});
    }catch (e){
        // Check for required values
        if (e._message === 'User validation failed'){
            return res.status(400).json({message:e.message});
        }

        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

async function updateCard(req, res){
    const id = req.params.id;
    const question = req.body.question;
    const answer = req.body.answer;
    const deck_id = req.body.deck_id

    if (!id || !question || !answer || !deck_id){return res.status(400).json({message:'Missing field!'});}

    try{
        // Check the user
        const user = await User.findOne({_id: req.user.id}).exec();
        if (!user){return res.status(400).json({message:`User not found!`})};

        // Check if the deck is from user
        if (!user.decks.includes(deck_id)){return res.status(401).json({message:`Unauthorized: The specified card can not be accessed by the user`})}

        // Check deck
        const deck = await Deck.findById(deck_id);
        if (!deck){return res.status(400).json({message:`Deck not found!`})}

        // Check if card is in deck
        if (!deck.cards.includes(id)){return res.status(400).json({message:`Unauthorized: The specified card is not in deck with id ${deck._id}`})}

        // Update card
        const updatedCard = await Card.findOneAndUpdate({_id: id}, {question, answer}, {new:true});

        return res.status(200).json({message: `Successfully updated card of deck ${deck.name}}`, data: updatedCard});
    }catch (e){
        // Check for required values
        if (e._message === 'User validation failed'){
            return res.status(400).json({message:e.message});
        }

        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

async function deleteCard(req, res){
    // Deletes a card
    const id = req.params.id;
    const deck_id = req.query.deck_id

    if (!id || !deck_id){return res.status(400).json({message:'Missing id field!'});}

    try{
        // Check the user
        const user = await User.findOne({_id: req.user.id}).exec();
        if (!user){return res.status(400).json({message:`User not found!`})};

        // Check if the deck is from user
        if (!user.decks.includes(deck_id)){return res.status(401).json({message:`Unauthorized: The specified card can not be accessed by the user`})}

        // Check deck
        const deck = await Deck.findById(deck_id);
        if (!deck){return res.status(400).json({message:`Deck not found!`})}

        // Check if card is in deck
        if (!deck.cards.includes(id)){return res.status(200).json({message:`Unauthorized: The specified card is not in deck with id ${deck._id}`})}

        // Erase card
        const deletedCard = await Card.deleteOne({_id: id});

        if (!deletedCard.acknowledged){res.status(500).json({message: `Server Error: Can not delete card at the moment!`});}

        // Update deck
        deck.cards.pull({_id:id});
        const newDeck = await deck.save();

        return res.status(200).json({message: `Successfully erased card ${deck._id} of deck ${deck.name}`, data: deletedCard});
    }catch (e){
        // Check for required values
        if (e._message === 'User validation failed'){
            return res.status(400).json({message:e.message});
        }

        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

function arrayRemove(arr, value) { 
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

export {createCard, updateCard, deleteCard}