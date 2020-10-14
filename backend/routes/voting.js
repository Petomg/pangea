var express = require('express');
var router = express.Router();
let UrnModel = require('../models/Urn');

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
            return console.error(`No Urn found with id: ${vid}`);
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
            if (!(urn.isClosed)){
                urn.posVotes = urn.posVotes + 1;
                urn.save();
            }
        }
    });
})

router.post('/negative/:vid', function(req, res, next){

    UrnModel.findById(req.params.vid, function(err, urn) {
        if (err) {
            return console.error(`No urn found with id: ${vid}`)
        } else {
            if (!(urn.isClosed)){
                urn.negVotes = urn.negVotes + 1;
                urn.save();
            }
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