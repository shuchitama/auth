const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation')
router.post('/register', async (req, res) => {

  //Validate data before making a user
  const {error} = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message)

  //check if user is already in database
  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists) return res.status(400).send('Email already exists!')

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);


  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch(err) {
    res.status(400).send(err)
  }

});

//Login
router.post('/login', async(req,res) => {

  //Validate data before logging in
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message)

  //check if the email exists
  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Email not found!');
  
  //check password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass) return res.status(400).send('Invalid password')

  //create and assign a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token);

  // res.send("Logged in!")
  })


module.exports = router;