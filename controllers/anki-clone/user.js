import User from '../../models/anki-clone/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {compareAsync} from './utils/index.js'

async function registerUser(req, res){
    // Creates a user
    const {name, email, password} = req.body;

    if (!password || !name || !email){
        return res.status(400).json({message:'Missing fields!'})
    }

    try{
        // Password encryption
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // User creation
        const newUser = await User.create({name, email, password: hashedPassword});
        return res.status(201).json({'message':'The user was created successfully!'});
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

async function loginUser(req, res){
    // Validate user credentials and returns a jwt token
    const {email, password} = req.body;

    try{
        // Validation
        const user = await User.findOne({email}).exec();
        if (!user){return res.status(400).json({message:`Email ${email} not found!`})}

        const dbPassword = user.password;

        const isCorrectPassword = await compareAsync(password, dbPassword);

        if (!isCorrectPassword){
            return res.status(400).json({message: 'Incorrect password'});
        }

        // Token Creation
        const token = jwt.sign({
            name: user.email,
            id: user._id,
            created: new Date()
        }, process.env.TOKEN_SECRET)
        
        return res.status(200).header('auth-token', token).json({
            message: `User with email ${email} was authenticated successfully`,
            token: token,
            data: {
                name: user.name,
                email: user.email
            }
        })
    }
    catch (e){
        return res.status(500).json({message: `Server Error: ${e.message}`});
    }
}

export {registerUser, loginUser}