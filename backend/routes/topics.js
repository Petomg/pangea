var express = require('express');
var router = express.Router();
let TopicModel = require('../models/Topic');


router.get('/', function(req, res, next){
    TopicModel.find(function(err, topics){
        if(err){
            return console.error("Error in get db operation");
        } else {
            res.json(topics);
        }
    });
});

router.post('/', function(req, res, next){
    let topicName = req.body.topicname;

    let newTopic = new TopicModel({name: topicName});

    newTopic.save(function(err, urn) {
        if (err) {
            return console.error("Error while creating topic");
        } else {
            res.send('Topic created succesfully');
        }
    });
});

router.post('/delete_topic/:tid', function(req, res, next) {

    TopicModel.deleteOne({ _id: req.params.tid }, function (err) {
        if(err) {
           return console.error(`No topic found with id: ${req.params.tid}`); 
        } else {
            res.send(`Deleted topic: ${req.params.tid} successfuly`);
        }

    });
  });


module.exports = router;