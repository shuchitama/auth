const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  () => { console.log('Connected to database!') })

//body-parser: lets you read from req.body
app.use(express.json());
//Route Middlewares
app.use('/api/user', authRoute);  //prefix for all routes in auth.js
app.use('/api/posts', postRoute);  //prefix for all routes in posts.js

app.listen(3000, () => console.log('Server up and running!'));