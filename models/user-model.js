const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post-model');


const userSchema = new Schema({
    username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	firstName: {
		type: String
    },
    lastName:{
        type:String
    },
	userImage : {
		type:String,
		default:'bullyBookLogo.png'
	},
	userPost: [{type: mongoose.Schema.Types.ObjectId,ref: 'Post'}],

	sentRequest:[{
		username: {type: String, default: ''}
	}],
	request: [{
		userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		username: {type: String, default: ''}
	}],
	friendsList: [{
		friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		friendName: {type: String, default: ''}
		
	}],
	totalRequest: {type: Number, default:0}

    
});

const User = mongoose.model('user', userSchema);

module.exports = User;