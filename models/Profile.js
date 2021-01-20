const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Profile Schema
const profileSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String
    },
    meditation: {
        type: String
    },
    experience: {
        type: String
    },
    bio: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = Profile = mongoose.model('Profile', profileSchema)