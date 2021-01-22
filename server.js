// Imports
require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport')
require('./config/passport')(passport);
const PORT = process.env.PORT || 8000;

// API
const users = require('./api/users');
const profiles = require('./api/profiles');
const journals = require('./api/journals');

// MIddleware
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(passport.initialize())

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Smile, you are being watched by the Backend Engineerin Team'})
})

app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/journals', journals);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

