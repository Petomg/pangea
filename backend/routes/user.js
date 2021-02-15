const express = require('express');
const router = express.Router();

const UserModel = require("../models/User");

router.get('/:uid', function(req, res, next){
    UserModel.findById(req.params.uid).then( (user) => {
        res.json(user);
    }).catch( (err) => {
        return console.error(err);
    })
})

module.exports = router;