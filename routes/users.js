const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
var multer  = require('multer');
//package for making HTTP Request
var request=require("request");
//package to generate a random number
var randomize = require('randomatic');
const {User, validate} = require('../models/user');
const { Driver } = require('../models/driver');
const Rider  = require('../models/rider');
const mongoose = require('mongoose');
const express = require('express');
var path = require('path');
var FormData = require('form-data');
var http = require('http');
var fs = require('fs');
const logger = require('../startup/logging');
const regCtrl = require('../controller/registrationController');
const LocController = require('../controller/locationController');
const router = express.Router();




router.get('/me/:id', auth, async (req, res) => {
  logger.info('GET /users/me called');
  let id = req.params.id;

  const user = await User.findById({_id: id});
  if(!user) return res.status(400).send('User not by Email...');

  res.jsonp({
    status : "success",
    message : "Profile info.",
    object : user
  });
});

router.post('/register', async (req, res) => {

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.jsonp({
    status: 'success',
    message: 'successfully created new user',
    user
  });

});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// var upload = multer({ dest: './public/images/profileImages' });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/profileImages')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})

var upload = multer({ storage: storage })


router.post("/profileImage", auth, upload.single('profile_photo_url'), (req, res, next) => {

  var id = req.body.id;
  User.findOne({ _id: id }, function (err, user) {
    if (err){
      res.status(400).send({
        status: "Failure",
        message: 'User not found by this id',
        object: []
      });
    }
    else{
      logger.info(user.length + 'User Found');
      user.profile_photo_url = req.file.path;
      user.save();

      res.jsonp({
        status: 'success',
        message: 'Image uploaded!',
        object: user
      });
    }
  });
});

router.post('/settings', auth, async function (req, res) {

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('User Not found.');

  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let newPassword1 = req.body.newPassword1;
  var checkPassword = bcrypt.compareSync(oldPassword, user.password);

  if(checkPassword){
    if(newPassword === newPassword1){
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);
      user.password = newPassword;
      await user.save();
      res.jsonp({
        status: 'success',
        messgae: 'password changed..!!',
        object: user
      })
    }else{
      res.jsonp({
        status: 'Failure',
        messgae: 'password do not match',
        object: []
      });
    }
  }
});

router.post('/profile', auth, async function (req, res) {

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('User Not found...');

  let name = req.body.name;
  let address = req.body.address;
  user.name = name;
  user.address = address;
  await user.save();
  res.jsonp({
    status: 'success',
    message: 'SuccessFull name and address is changed...',
    object: user
  })

});




module.exports = router; 