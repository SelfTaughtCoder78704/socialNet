const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const path = require('path');
const async = require('async');
const formidable = require('formidable');
const router = express.Router();
const User = require('../models/user-model');
const mongoose = require('mongoose');
const Post = require('../models/post-model');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('landing', {user: req.user });
});


router.post('/', (req, res) => {
  var form =new formidable.IncomingForm();
	form.parse(req);
	let reqPath= path.join(__dirname, '../');
	let newfilename;
	form.on('fileBegin', function(name, file){
		file.path = reqPath+ 'public/upload/'+ req.user.username + file.name;
		newfilename= req.user.username+ file.name;
	});
	form.on('file', function(name, file) {
		User.findOneAndUpdate({
			username: req.user.username
		},
		{
			'userImage': newfilename
		},
		function(err, result){
			if(err) {
				console.log(err);
			}
		});
	});
	req.flash('success_msg', 'Your profile picture has been uploaded');
	res.redirect('/');
})



router.get('/search', ensureAuthenticated, function(req, res){
	let allFriendsNames = []
	var sent =[];
	var friends= [];
	var received= [];
	received= req.user.request;
	sent= req.user.sentRequest;
	friends= req.user.friendsList;
	friends.forEach(f => {
		allFriendsNames.push(f.friendName)
	})


	User.find({username: {$ne: req.user.username}}, function(err, result){
		if (err) throw err;
		
		res.render('search',{
			result: result,
			sent: sent,
			friends: friends,
			received: received,
			allFriendsNames
		});
	});
});

router.post('/search', ensureAuthenticated, function(req, res) {
	  var searchfriend = req.body.searchfriend;
	if(searchfriend) {
	 	var mssg= '';
		if (searchfriend == req.user.username) {
			searchfriend= null;
		}
		 User.find({username: searchfriend}, function(err, result) {
			 if (err) throw err;
				 res.render('search', {
				 result: result,
				 mssg : mssg
			 });
	   	});	
	}
	 
 	async.parallel([
		function(callback) {
			if(req.body.receiverName) {
					User.update({
						'username': req.body.receiverName,
						'request.userId': {$ne: req.user._id},
						'friendsList.friendId': {$ne: req.user._id}
					}, 
					{
						$push: {request: {
						userId: req.user._id,
						username: req.user.username
						}},
						$inc: {totalRequest: 1}
						},(err, count) =>  {
							console.log(err);
							callback(err, count);
						})
			}
		},
		function(callback) {
			if(req.body.receiverName){
					User.update({
						'username': req.user.username,
						'sentRequest.username': {$ne: req.body.receiverName}
					},
					{
						$push: {sentRequest: {
						username: req.body.receiverName
						}}
						},(err, count) => {
						callback(err, count);
						})
			}
		}],
	(err, results)=>{
		res.redirect('/search');
	});

			async.parallel([
				// this function is updated for the receiver of the friend request when it is accepted
				function(callback) {
					if (req.body.senderId) {
						User.update({
							'_id': req.user._id,
							'friendsList.friendId': {$ne:req.body.senderId}
						},{
							$push: {friendsList: {
								friendId: req.body.senderId,
								friendName: req.body.senderName
							}},
							$pull: {request: {
								userId: req.body.senderId,
								username: req.body.senderName
							}},
							$inc: {totalRequest: -1}
						}, (err, count)=> {
							callback(err, count);
						});
					}
				},
				// this function is updated for the sender of the friend request when it is accepted by the receiver	
				function(callback) {
					if (req.body.senderId) {
						User.update({
							'_id': req.body.senderId,
							'friendsList.friendId': {$ne:req.user._id}
						},{
							$push: {friendsList: {
								friendId: req.user._id,
								friendName: req.user.username
							}},
							$pull: {sentRequest: {
								username: req.user.username
							}}
						}, (err, count)=> {
							callback(err, count);
						});
					}
				},
				function(callback) {
					if (req.body.user_Id) {
						User.update({
							'_id': req.user._id,
							'request.userId': {$eq: req.body.user_Id}
						},{
							$pull: {request: {
								userId: req.body.user_Id
							}},
							$inc: {totalRequest: -1}
						}, (err, count)=> {
							callback(err, count);
						});
					}
				},
				function(callback) {
					if (req.body.user_Id) {
						User.update({
							'_id': req.body.user_Id,
							'sentRequest.username': {$eq: req.user.username}
						},{
							$pull: {sentRequest: {
								username: req.user.username
							}}
						}, (err, count)=> {
							callback(err, count);
						});
					}
				} 		
			],(err, results)=> {
				res.redirect('/search');
			});
});



router.get('/profile', ensureAuthenticated, (req, res) =>{
	// User.find({}, (err, users) => {
	// 	if(err){
	// 		console.log(err)
	// 	}else{
	// 		res.render('profile', {
	// 			user: req.user,
				
	// 		})
	// 	}
	// })
	Post.find({}, (err, post) =>{
		if(err){
			console.log(err)
		}else{
			res.render('profile', {post})
		}
	} )
 
});

router.post('/profile',ensureAuthenticated, (req, res) => {
		
	User.findById(req.user._id, (err, user) => {
		if(err){
			console.log(err)
		}else{
			Post.create({
				author: req.user._id,
				postBody: req.body.postBody,
				postTitle: req.body.postTitle,
				authorName: req.user.username
			}, (err, post) => {
				if(err) {
					console.log(err)
				}else{
					console.log(post)
					user.userPost.push(post)
					user.save()
					.then(() => {
						res.redirect('/profile')
					})
				}
			})
		}
	})

})
			


// function getUserWithPosts(username){
// 	return User.findOne({ username: username })
// 	  .populate('posts').exec((err, posts) => {
// 		console.log("Populated User " + posts);
		
// 	  })
	  
//   }

router.get('/homefeed',ensureAuthenticated, (req, res) => {
	let friendPosts = []
	let strippedPosts = []
	let newArr = []
	User.find({username: {$ne: req.user.username}})
	.select('userPost')
	.populate('userPost')
	.exec()
	.then(post => {
		// res.render('feed', {post})
		
		
		User.findById(req.user._id, (err, user) => {
			if(err) {
				console.log(err)
			}else{
				
				let allPosts = []
				
				post.forEach((p) => {
					allPosts.push(p.userPost)
					
				})
				for(let i = 0; i < allPosts.length; i++){
					newArr =newArr.concat(allPosts[i]);
				}
				console.log(allPosts)
				newArr.forEach((p, i) => {
					
					user.friendsList.forEach(f => {
						if(f.friendName === p.authorName){
							friendPosts.push(p)
						}
					})
					
				})
				// res.json({user, friendPosts})

			}
		})
	})
	.then(() => {
		User.find({username: req.user.username})
		.select('userPost')
		.populate('userPost')
		.exec()
		.then(myPost => {
			myPost.forEach(p => {
				friendPosts.push(p.userPost)

			})
			for(var i = 0; i < friendPosts.length; i++){
    			strippedPosts = strippedPosts.concat(friendPosts[i]);
			}
		
			res.render('feed',{strippedPosts})
			// res.json({strippedPosts})
		})
	})
	
	
})

	


module.exports = router;


