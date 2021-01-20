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
        require: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    date: {
        type: Date,
        default: Date.now()
    }
});



module.exports = User = mongoose.model('User', userSchema)