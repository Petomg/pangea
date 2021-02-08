const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');
const router = express.Router();
require('../config');

router.post('/', function(req, res, next){
    let body = req.body;

    User.findOne({ email: body.email }, function(err, user){
        // Hay error? Le mando un 500 (Internal server error)
    
        if(err){
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        // No existe tal usuario? Le mando un 400 (Bad Request)
        
        if (!user) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Incorrect user and password combination"
                }
            })
        }

        // Existe el usuario pero no coincide la contra? Le mando un 400 (Bad Request)

        if(! bcrypt.compareSync(body.password, user.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Incorrect user and password combination"
                }
            })
        }

        // Esta todo bien? Genero el token y lo devuelvo junto con el usuario

        let token = jwt.sign({
                user: user,
            },  process.env.SEED_AUTENTICACION ,{ //TODO: LOGRAR USAR process.env.SEED_AUTENTICATION
                expiresIn: process.env.CADUCIDAD_TOKEN //TODO: LOGRAR USAR process.env.CADUCIDAD_TOKEN
        })

        res.json({
            ok: true,
            user: user,
            token
        })
    })
});

module.exports = router;