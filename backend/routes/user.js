const express = require('express');
const router = express.Router();

let UserModel = require("../models/User");
let PostModel = require('../models/Post');

const jwt = require('jsonwebtoken');

router.get('/:uid', function(req, res, next){
    UserModel.findById(req.params.uid).then( (user) => {
        res.json(user);
    }).catch( (err) => {
        return console.error(err);
    })
})

router.get('/profile/:uname', function(req, res, next){
    UserModel.findOne({name: req.params.uname}).lean().populate("pending_friends").populate("friends").then( (user) => {
        res.json(user);
    }).catch( (err) => {
        return console.error(err);
    })
})

router.get('/posts/:uid', function(req, res, next) {
    PostModel.find({author: req.params.uid}).then( (posts) => {
        res.json(posts);
    }).catch( (err) => {
        return console.error(err);
    })
});

router.post('/add_friend/:uid', function(req, res, next) {
    UserModel.findById(req.params.uid).then( (user) => {
        let token = req.body.friend_token;

        let decodedToken = jwt.decode(token, { complete: true }) || {};
        let friend_id = decodedToken.payload.user._id;
        if(!(user.pending_friends.includes(friend_id)) && !(user.friends.includes(friend_id))){
            user.pending_friends.push(friend_id);
        }

        user.save();

        res.redirect("/");
        
    }).catch( (err) => {
        return console.error(err);
    })
});

router.post('/confirm_friend/:uid', async function(req, res, next) {
        let user1 = await UserModel.findById(req.params.uid);

        let friend_id = req.body.friend_id;
        console.log(friend_id);
        let user2 = await UserModel.findById(friend_id);
        
        console.log(user1);
        console.log(user2);

        if(user1.pending_friends.includes(friend_id)){
            user1.pending_friends.splice(user1.pending_friends.indexOf(friend_id), 1);
            if (!(user1.friends.includes(friend_id))){
                user1.friends.push(friend_id);
                user2.friends.push(user1._id);
            }
        }

        user1.save();
        user2.save();

        
        await user1.populate('friends').populate('pending_friends').execPopulate();

        res.json(user1);
});

router.post('/delete_friend/:uid', async function(req, res, next) {
         let user1 = await UserModel.findById(req.params.uid);
 
         let friend_id = req.body.friend_id;

         let user2 = await UserModel.findById(friend_id);

        if (user1.friends.includes(friend_id)){
            user1.friends.splice(user1.friends.indexOf(friend_id),1);
            user2.friends.splice(user2.friends.indexOf(user1._id),1);
        }
        
 
         user1.save();
         user2.save();
         
         await user1.populate('friends').populate('pending_friends').execPopulate();

         res.json(user1);
         
 });
 

router.post('/decline_friend/:uid', function(req, res, next) {
    UserModel.findById(req.params.uid).then( async (user) => {

        let friend_id = req.body.friend_id;

        if(user.pending_friends.includes(friend_id)){
            user.pending_friends.splice(user.pending_friends.indexOf(friend_id), 1);
        }

        user.save();

        await user.populate('friends').populate('pending_friends').execPopulate();

        res.json(user);
        
    }).catch( (err) => {
        return console.error(err);
    })
});

module.exports = router;