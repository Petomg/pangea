var express = require('express');
var router = express.Router();
let PostModel = require('../models/Post');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bruno malo' });
});


router.get('/get_posts', function(req, res, next) {
  PostModel.find(function(err, posts){
    if(err) {
        return console.error("Error in get db operation");
    } else {
        res.json(posts);
    }
  })
});


router.get('/get_posts/:pid', function(req,res,next){
    PostModel.findById(req.params.pid, function (err, post) {
      if (err){
        return console.error(`No post found with id: ${pid}`);
      } else {
        res.json(post);
      }
    });
});


router.post('/add_post', function(req, res, next) {

  let title = req.body.title;
  let description = req.body.description;
  let topics = req.body.topics;
  let upvotes = 0;

  let newPost = new PostModel({title, description, topics, upvotes});
  newPost.save(function(err, pub){
      if (err) {
        return console.error("Error while adding Post");
      } else {
        res.send(`${title} saved successfuly`);
      }
  });
});

router.post('/upvote_post/:pid', function(req, res, next) {

  PostModel.findById(req.params.pid, function (err, post) {
    if (err){
      return console.error(`No post found with id: ${pid}`);
    } else {
      post.upvotes = post.upvotes + 1;
      post.save();
    }
  });

});

router.post('/delete_post/:pid', function(req, res, next) {

  PostModel.deleteOne({ _id: req.params.pid }, function (err) {
      if(err) {
         return console.error(`No post found with id: ${pid}`); 
      } 
  });
});




module.exports = router;
