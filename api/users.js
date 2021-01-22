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
// router.get('/test', (req, res) => {
//     res.json({ msg: 'User endpoint Ok!'});
// });

// POST api/users/register (Public)
router.post('/register', (req, res)=>{
    //Find user by email
    db.User.findOne({ email: req.body.email})
    .then(user =>{
        //If email already exist we want to send a 400 response
        if (user) {
            return res.status(400).json({ msg: 'Email already exist'})
        } else {
            //Create a new user
            const newUser = new db.User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                firstTimeUser: true,
                avatar: null,

            });
            //Salt and has password, then save the user
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (error, hash) =>{
                    if (error) throw Error;
                    //Change password in newUser to hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})
// router.post('/signup', async (req, res) => {
//     try {
//         // Find user by email
//         const currentUser = await db.User.findOne({ 
//             email: req.body.email
//         })
//         if (currentUser) {
//             // if email already exists, send a 400 response
//             return res.status(400).json({ msg: 'Email already exists' });
//         } else {
//             // Create a new user
//             const newUser = new db.User({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 firstTimeUser: true,
//                 avatar: null
//             });
//             // Create salt for password
//             bcrypt.genSalt(10, (error, salt) => {
//                 if (error) throw Error
//                 // Hash Password with salt
//                 bcrypt.hash(newUser.password, salt, async (error, hash) => {
//                     try {
//                         if (error) throw Error
//                         // Change pw to the hash version
//                         newUser.password = hash
//                         // Save new user with hashed pw
//                         const createdUser = await newUser.save()
//                         res.status(200).json({
//                             user: createdUser
//                         })
//                     } catch(error) {
//                         res.status(400).json({msg: error})
//                     }
//                 })
//             })
//         }
//     } catch(error) {
//         res.status(400).json({msg: error})
//     }
// })


    

//POST api/users/login (Public)
router.post('/login',  async (req, res) => {
    try {
        // grab email and passwrod from form
        const email = req.body.email;
        const password = req.body.password;
        //find user by email
        const currentUser = await db.User.findOne({email})
        if (!currentUser) {
            // Send 400 repsonse if no user
            res.status(400).json({msg: 'User not found'})
        } else {
            // Log in uf user exists
            const isMatch = await bcrypt.compare(password, currentUser.password)
            // Check pw for match
            if (isMatch) {
                // Create a token if payload match
                const payload = {
                    id: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.name,
                    firstTimeUser: currentUser.firstTimeUser,
                    avatar: currentUser.avatar
                }
                // Sign token to login
                jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}, (error, token) => {
                    res.status(200).json({
                        success: true,
                        token: `Bearer ${token}`
                    })
                })
            } else {
                // send 400 if no match
                return res.status(400).json({msg: 'Password is incorrect'})
            }
        }
    } catch(error) {
        res.status(400).json({msg: error})
    }
})

// GET api/users/:id (Private)
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const currentUser = await db.User.findOne({
            _id: req.params.id
        })
        res.status(200).json({user: currentUser})
    } catch(error) {
        res.status(400).json({msg: error})
    }
});

// PUT route for users/:id (Private)
router.put('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const { firstTimeUser, newName, newAvatar } = req.body
    if (firstTimeUser === false) {
        try {
            const updatedUser = await db.User.updateOne(
                {_id: req.params.id},
                {$set: {firstTimeUser: firstTimeUser}}
            )
            res.status(200).json({user: updatedUser})
        } catch(error) {
            res.status(400).json({msg: error})
        }
    } else {
        try {
            const updatedUser = await db.User.updateOne(
                {_id: req.params.id},
                {$set: {name: newName, avatar: newAvatar}}
            )
            res.status(200).json({user: updatedUser})
        } catch (error) {
            res.status(400).json({msg: error})
        }
    }
})

//Create delete route for user
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await db.Profile.deleteOne({user: req.params.id})
        await db.Journal.deleteMany({user: req.params.id})
        await db.User.deleteOne({_id: req.params.id})
        res.status(200).json({msg: 'User deleted'})
    } catch(error) {
        res.status(400).json({msg: error})
    }
})

module.exports = router;