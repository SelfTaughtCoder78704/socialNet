const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user-model');

const commentSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    userName: {type: String},
    comment: {type: String, default: ""}
})

const postSchema = new Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    postBody: {
        type: String
    },
    postTitle:{
        type: String
    },
    authorName: {
        type: String
    },
    comments:[commentSchema],
    time : { type : Date, default: Date.now },
    likes: {type: Number, default: 0}
})

const Post = mongoose.model('Post', postSchema)
module.exports = Post