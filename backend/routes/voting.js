var express = require('express');
var router = express.Router();
let UrnModel = require('../models/Urn');
const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    UrnModel.find(function(err, urn){
        if(err) {
            return console.error("Error in get db operation");
        } else {
            res.json(urn);
        }
      })
});

router.post('/', function(req, res, next){
    let posVotes = 0;
    let negVotes = 0;
    let isClosed = false;

    let newUrn = new UrnModel({posVotes, negVotes, isClosed});

    newUrn.save(function(err, urn){
        if(err) {
            return console.error("Error while creating urn");
        } else {
            res.send('Urn created successfuly');
        }
    });
});

router.get('/:vid', function(req, res, next) {
    UrnModel.findById(req.params.vid, function(err, urn){
        if (err) {
            return console.error(`No Urn found with id: ${req.params.vid}`);
        } else {
            res.json(urn);
        }
    });
});

router.post('/positive/:vid', function(req, res, next){
    UrnModel.findById(req.params.vid, function(err, urn) {
        if (err) {
            return console.error(`No urn found with id: ${req.params.vid}`)
        } else {
            let decodedToken = jwt.decode(req.body.user_token, { complete: true }) || {};
            let user_id = decodedToken.payload.user._id;

            if (!(urn.isClosed)){
                if(urn.negUsers.includes(user_id)){
                    urn.negVotes = urn.negVotes - 1;
                    urn.posVotes = urn.posVotes + 1;
                    urn.negUsers.splice(urn.negUsers.indexOf(user_id));
                    urn.posUsers.push(user_id);
                    
                } else if (!urn.posUsers.includes(user_id)){
                    urn.posVotes = urn.posVotes + 1;
                    urn.posUsers.push(user_id);
                }

                urn.save();
            }

            return res.json(urn);
        }
    });
})

router.post('/negative/:vid', function(req, res, next){

    UrnModel.findById(req.params.vid, function(err, urn) {
        if (err) {
            return console.error(`No urn found with id: ${vid}`)
        } else {
            let decodedToken = jwt.decode(req.body.user_token, { complete: true }) || {};
            let user_id = decodedToken.payload.user._id;

            if (!(urn.isClosed)){
                if(urn.posUsers.includes(user_id)){
                    urn.posVotes = urn.posVotes - 1;
                    urn.negVotes = urn.negVotes + 1;
                    urn.posUsers.splice(urn.posUsers.indexOf(user_id));
                    urn.negUsers.push(user_id);
                    
                } else if (!urn.negUsers.includes(user_id)){
                    urn.negVotes = urn.negVotes + 1;
                    urn.negUsers.push(user_id);
                }

                urn.save();
            }

            return res.json(urn);
        }
    });
})

router.post('/close/:vid', function(req, res, next){

    UrnModel.findById(req.params.vid, function(err, urn) {
        if (err) {
            return console.error(`No urn found with id: ${vid}`)
        } else {
            urn.isClosed = true;
            urn.save();
        }
    });
})


module.exports = router;