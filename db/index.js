import mongoose from 'mongoose';

async function connectDB(uri){
    return mongoose.connect(uri)
}

export default connectDB;