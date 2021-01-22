require('dotenv').config();
const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator');
const passport = require('passport');

const db = require('../models');

router.post('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { comments } = req.body
    try {
        const newJournal = await db.Journal.create({
            user: req.params.id,
            text: req.body.text,
            name: req.body.name,
            comments: comments
        })
        res.status(200).json({journal: newJournal})
    } catch (error) {
        res.status(400).json({msg: error})
    }
})

// GET route for all journals/all/:id
router.get('/all/:id', passport.authenticate('jwt', { session: false }),  async (req, res) => {
    try {
        const allJournals = await db.Journal.find({
            user: req.params.id
        })
        res.status(200).json({journals: allJournals})
    } catch (error) {
        res.status(400).json({msg: error})
    }
})

// GET route for journals/:id
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const currentJournal = await db.Journal.findOne({
            _id: req.params.id
        })
        res.status(200).json({journal: currentJournal})
    } catch (error) {
        res.status(400).json({msg: error})
    }
})

// PUT route for journals/:id
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const updateJournal = await db.Journal.updateOne(
            {_id: req.params.id},
            {$set: {
                text: req.body.text,
                name: req.body.name,
                comments: req.body.comments
            }}
        )
        res.status(200).json({journal: updateJournal})
    } catch(error) {
        res.status(400).json({msg: error})
    }
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await db.Journal.deleteOne({_id: req.params.id})
        res.status(200).json({msg: 'Journal Deleted'})
    } catch (error) {
        res.status(400).json({msg: error})
    }
});

module.exports = router;