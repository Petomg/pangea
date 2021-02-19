const express = require('express');
const router = express.Router();

let UserModel = require("../models/User");
let PostModel = require('../models/Post');

router.get('/:uid', function(req, res, next){
    UserModel.findById(req.params.uid).then( (user) => {
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

module.exports = router;