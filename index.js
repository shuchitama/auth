const express = require('express');
const app = express();

//Import Routes
const authRoute = require('./routes/auth');

//Route Middlewares
app.use('/api/user', authRoute);  //prefix for all routes in auth.js

app.listen(3000, () => console.log('Server up and running!'));