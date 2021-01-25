require('dotenv').config();
const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const passport = require('passport');

const db = require('../models');

// router.get('/me',  async (req, res) => {
//     try {
//         const profile = await db.Profile.findOne({ user: req.user.id }).populate(
//             'user',
//             ['name', 'avatar']
//         );
//         if (!profile) {
//             return res.status(400).json({ msg: 'There is no profile for this user' });
//         }
//         res.json(profile);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });
// Create POST route for profiles/:id
router.post('/:id', async (req, res) => {
    try {
        const newProfile = await db.Profile.create({
            user: req.params.id,
            status: req.body.status,
            meditation: req.body.meditation,
            experience: req.body.experience,
            bio: req.body.bio
        })
        res.status(200).json({profile: newProfile});
    } catch (error) {
        res.status(400).json({msg: error})
    }
});

// GET route for profiles/:id
router.get('/:id', async (req, res) => {
    try {
        const currentProfile = await db.Profile.find({
            user: req.params.id
        })
        res.status(200).json({profile: currentProfile})
    } catch (error) {
        res.status(400).json({msg: error})
    }
});

// create PUT route for profiles/:id
router.put('/:id', async (req, res) => {
    try {
        console.log(req);
        const updateProfile = await db.Profile.findOneAndUpdate(
            {user: req.params.id},
            {$set: {
                status: req.body.status,
                meditation: req.body.meditation,
                experience: req.body.experience,
                bio: req.body.bio  
            }},
            {new: true, upsert: true}
        )
        console.log(updateProfile);
        res.status(200).json({profile: updateProfile})
    } catch (error) {
        res.status(400).json({msg: error})
    }
})

// create delete route for profiles/:id
// router.delete('/:id', async (req, res) => {
//     try {
//         await db.Profile.deleteOne({_id: req.params.id})
//         res.status(200).json({msg: 'Profile deleted'})
//     } catch (error) {
//         res.status(400).json({msg: error})
//     }
// });

module.exports = router;