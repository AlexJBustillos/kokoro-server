require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const db = require('../models');

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const profile = await db.Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'avatar']
        );
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const {
        status,
        meditation,
        experience,
        bio
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (meditation) profileFields.meditation = meditation;
    if (experience) profileFields.experience = experience;
    if (bio) profileFields.bio = bio;

    try {
        let profile = await db.Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const profiles = await db.Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

router.get('/user/:user_id', async ({ params: { user_id }}, res) => {
    try {
        const profile = await db.Profile.findOne({user: user_id}).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error'})
    }
})

router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await Promise.all([
            db.Journal.deleteMany({ user: req.user.id }),
            db.Profile.findOneAndRemove({ user: req.user.id }),
            db.User.findOneAndRemove({ _id: req.user.id })
        ]);

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/experience', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const profile = await db.Profile.findOne({ user: req.user.id });
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.delete('experience/:exp_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const foundProfile = await db.Profile.findOne({ user: req.user.id });
        await foundProfile.save();
        return res.status(200).json(foundProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;