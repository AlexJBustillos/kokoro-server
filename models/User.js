const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
});



module.exports = User = mongoose.model('User', userSchema)