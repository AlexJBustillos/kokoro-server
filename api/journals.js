require('dotenv').config();
const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator');
const passport = require('passport');

const db = require('../models');

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    try {
        const user = await user.findById(req.user.id).select('-password');

        const newJournal = new db.Journal({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const journal = await newJournal.save();
        res.json(journal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/', passport.authenticate('jwt', { session: false }),  async (req, res) => {
    try {
        const journals = await db.Journal.find().sort({ date: -1 });
        res.json(journals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const journal = await db.Journal.findById(req.params.id);
        if (!journal) {
            return res.status(404).json({ msg: 'Journal not found' });
        }
        res.json(journal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const journal = await db.Journal.findById(req.params.id);
        if (!journal) {
            return res.status(404).json({ msg: 'Journal not found' })
        }

        if (journal.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await journal.remove();

        res.json({ msg: 'Journal removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/like/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const journal = await db.Journal.findById(req.params.id);

        if (journal.likes.some((like) => like.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Journal already liked' });
        }

        journal.likes.unshift({ user: req.user.id });

        await journal.save();

        return res.json(journal.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

router.put('/unlike/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const journal = await db.Journal.findById(req.params.id);

        if (!journal.likes.some((like) => like.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Journal has not yet been liked' });
        }

        journal.likes = post.likes.filter(
            ({ user }) => user.toString() !== req.user.id
        );

        await journal.save();

        return res.json(journal.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/comment/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    try {
        const user = await db.User.findById(req.user.id).isSelected('-password');
        const journal = await db.Journal.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        journal.comments.unshift(newComment);

        await journal.save();

        res.json(journal.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const journal = await db.Journal.findById(req.params.id);

        const comment = journal.comments.find(
            (comment) => comment.id === req.params.comment_id
        );
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        journal.comments = journal.comments.filter(
            ({ id }) => id !== req.params.comment_id
        );

        await journal.save();
        return res.json(journal.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;