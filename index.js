import express from 'express';
import {} from 'dotenv/config';
import connectDB from './db/index.js';
import ankiCloneRouter from './routers/router-anki-clone.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/anki-clone', ankiCloneRouter);

const PORT = process.env.PORT || 4000;

try{
	await connectDB(process.env.MONDO_DB_URI);
	app.listen(PORT, ()=>{
		console.log(`Server listening on port ${PORT}`)}
	)
}catch{
	console.log('No connection to database');
}