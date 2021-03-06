const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./../models/User');
const router = express.Router();
const verif = require("../general/verificaciones");

router.post('/', function (req, res, next) {
    let body = req.body;
    let { name, email, password, role } = body;
    let friends = [];
    let pending_friends = [];
    let reputation = 0;
    
    // Si no pasa alguna verificion isValid es falso

    let isValid = verif.verificaMail(email) && 
                  verif.verificaUsuario(name) && 
                  verif.verificaPassword(password);

    if (!isValid) {
        return res.status(400).json({
            ok: false,
            err: "Information not valid"
        });
    }

    let newUser = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
        friends,
        pending_friends,
        reputation
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