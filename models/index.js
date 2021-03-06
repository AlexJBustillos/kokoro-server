require('dotenv').config();
const mongoose = require('mongoose');


// Mongo connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Mongoose connection object
const db = mongoose.connection;
// console.log(db);

// Set up event listener that will fire once connection opens for database
// log to the terminal what host and port we are on 
db.once('open', () => {
    console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
})

db.on('error', (error) => {
    console.log(`Database error\n ${error}`);
});


module.exports.User = require('./User');
module.exports.Profile = require('./Profile');
module.exports.Journal = require('./Journal');