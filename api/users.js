// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

// Models
const db = require('../models');

// GET api/users/test (Public)
router.get('/test', (req, res) => {
    res.json({ msg: 'User endpoint Ok!'});
});

// POST api/users/register (Public)
router.post('/register', (req, res) => {
    // Find user by email
    db.User.findOne({ email: req.body.email })
    .then(user => {
        // if email already exists, send a 400 response
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        } else {
            // Create a new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Salt and hash pw then save user
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    // if (error) throw Error;
                    // Change the pw in newUser to hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})

//POST api/users/login (Public)
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find a user via email
    db.User.findOne({ email })
    .then(user => {
        // If there is not a user
        console.log(user);
        if (!user) {
            res.status(400).json({ msg: 'User not found'});
        } else {
            // A user is found in the database
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                // Check password for match
                if (isMatch) {
                    console.log(isMatch);
                    // User match, send JSON Web Token
                    // Create a token payload
                    const payload = {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    };
                    // Sign token
                    // 3600000 is one hour
                    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
                        res.json({
                            success: true,
                            token: `Bearer ${token}`
                        });
                    });
                } else {
                    return res.status(400).json({ msg: 'Email or Password is incorrect' });
                }
            })
        }
    })
})

// GET api/users/current (Private)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;