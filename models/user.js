const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
  f_name: {
    type: String,
    // minlength: 5,
    maxlength: 50
  },
  l_name: {
    type: String,
    // minlength: 5,
    maxlength: 50
  },
  address: String,
  email: {
    type: String,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean,
  user_type: {
    type: String,
    lowercase: true,
    trim: true
  },
  name: String,
  address: String,
  loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  },
  profile_photo_url: { type: String },
  // active: Boolean,
  // alert: { type: Boolean, default: true },
  // OS: String,
  // verified_user: Boolean,
  // deactivate_user: { type: Boolean, default: false },
  // country_code: String,
  // verification_code: String,
  // message: {type: String, default: null },
  // palyer_id: String,
  // access_code: String,
  // last_shared_loc_time: { type: Date, default: Date.now }
  // role: [],
  // operations: []
}, { timestamps: true });

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

// function validateUser(user) {
//   const schema = {
//     name: Joi.string().min(5).max(50).required(),
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(5).max(255).required(),
//     user_type: Joi.string().min(5).max(15)
//   };

//   return Joi.validate(user, schema);
// }

const User = mongoose.model('User', userSchema);
module.exports.User = User; 