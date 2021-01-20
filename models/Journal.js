const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Journal Schema
const journalSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Journal = mongoose.model('Journal', journalSchema)