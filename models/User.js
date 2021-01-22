const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = require('./Profile')
const journalSchema = require('./Journal')

// User Schema
const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    firstTimeUser: Boolean,
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
});



module.exports = User = mongoose.model('User', userSchema)