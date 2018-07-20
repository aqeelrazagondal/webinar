const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const webinarSchema = new mongoose.Schema({

  web_name: { type: String,  maxlength: 50 },
  web_date: { type: Date },
  web_day: { type: String },
  web_start_time: { type: Date },
  web_description: { type: String,  maxlength: 500 },
  web_utc: { type: String },
  web_topic: { type: String,  maxlength: 50 },

}, { timestamps: true });

const Webinar = mongoose.model('Webinar', webinarSchema);
module.exports.Webinar = Webinar; 
