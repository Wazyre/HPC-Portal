import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/client.js';
import userRoutes from './routes/userRoutes.ts';
import supportRoutes from './routes/supportRoutes.ts';

// Allow referencing .env files
dotenv.config();

// Start Express and define local path
const app = express();
const __dirname = path.resolve();

// Ecnode express to send json over https packets
const urlencodedParser = express.urlencoded({extended: false});
app.use(urlencodedParser, express.json());


// var corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors());

// Initialize Postgres ORM and DB
const prisma = new PrismaClient();

// Env variables
const PORT = process.env.SERVER_PORT || 54322;
const STATUS = process.env.NODE_ENV || 'developement'
const DB_URI = process.env.DB_URI

// Setup APIs
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);

// Serve static assets if in production
if(STATUS === 'production') {
  //Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

// // Connect to database
// mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
// .then((res) => {
//   console.log("Database connected");
// })
// .catch((err) => console.log(err));

// Log if server is up
app.listen(PORT, () => {
  console.log("App is running in", STATUS, "mode on port", PORT);
});