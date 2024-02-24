const express = require('express');
require('dotenv').config();
const cors = require('cors')
const jwt = require('jsonwebtoken');

const PORT = 5173;
const secretKey = process.env.SECRET_KEY;
const app = express();

app.use(cors())

// Connect to MongoDB database
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Middleware to extract token from Authorization Header
const extractToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token)
      req.token = token;
  }
  next();
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  if (!req.token){
    req.user = null;
    return next();
  }
  jwt.verify(req.token, secretKey, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  });
};

// Import routes 
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

// To access the req body as json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Calling the routes
app.use('/', authRouter);
app.use("/api", extractToken, verifyToken, indexRouter);

// Create a server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
})