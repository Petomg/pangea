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
    UserModel.findOne({name: req.params.uname}).lean().populate("pending_friends").then( (user) => {
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
        if(!(user.pending_friends.includes(friend_id))){
            user.pending_friends.push(friend_id);
        }

        user.save();

        res.redirect("/");
        
    }).catch( (err) => {
        return console.error(err);
    })
});

module.exports = router;