import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { PrismaClient } from './generated/prisma/client.ts';
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

// Initialize Postgres ORM and DB
const prisma = new PrismaClient();

// Env variables
const PORT = process.env.SERVER_PORT || 54322;
const STATUS = process.env.NODE_ENV || 'development'

// Setup APIs
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);

// Serve static assets if in production
if(STATUS === 'production') {
  //Set static folder
  app.use(express.static('frontend/dist'));
  // See https://expressjs.com/en/guide/migrating-5.html#path-syntax for splat explanation
  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  })
}

// Log if server is up
app.listen(PORT, () => {
  console.log("App is running in", STATUS, "mode on port", PORT);
});