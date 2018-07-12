const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect('mongodb://admin:web123@ds233581.mlab.com:33581/webinar')
    .then(() => winston.info('Connected to the databse...'));
}