const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./../models/User');
const router = express.Router();

router.post('/', function (req, res, next) {
    let body = req.body;
    let { name, email, password, role } = body;

    let newUser = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });
    
    newUser.save((err, user) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: newUser
        });

    })
});


module.exports = router;