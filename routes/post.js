const express = require('express');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router();
const User = require('../models/user-model');
const mongoose = require('mongoose');
const Post = require('../models/post-model');


router.post('/:id', ensureAuthenticated, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        post.comments.push({
            userName: req.user.username,
            comment: req.body.post
        })
        post.save()
        .then(savedPost => {
            res.redirect('/homefeed')
        })
    })
})

router.post('/:id/delete', ensureAuthenticated, (req, res) => {
    Post.deleteOne({_id: req.params.id})
    
    .then((removedPost) => {
        // User.findById(req.user._id)
        // .select('userPost')
        // .populate('userPost')
        // .exec()
        // .then(selectedUser => {
        //     res.json({selectedUser, removedPost})
        // })
        console.log(removedPost)
        res.redirect('/profile')
    })
})

module.exports = router;