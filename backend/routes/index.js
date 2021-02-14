let express = require('express');
let router = express.Router();
let PostModel = require('../models/Post');
let UrnModel = require('../models/Urn');
let CommentsModel = require('../models/Comments');
const jwt = require('jsonwebtoken');

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
    PostModel.findById(req.params.pid).lean().populate({ 
                                                path: 'comments', 
                                                populate: { path: 'author' } 
                                              })
    .populate("author").then( (post) => {
        res.json(post);
      }
    ).catch((err) => {
      return console.error(err);
    });
});


router.post('/add_post', function(req, res, next) {

  let title = req.body.values.title;
  let description = req.body.values.description;
  let topics = req.body.values.topics;
  let upvotes = 0;
  let token = req.body.author;

  let decodedToken = jwt.decode(token, { complete: true }) || {};
  let author_id = decodedToken.payload.user._id;

  let posVotes = 0;
  let negVotes = 0;
  let isClosed = false;


  let newUrn = new UrnModel({posVotes, negVotes, isClosed});

  newUrn.save(function(err, urn){
      if(err) {
          return console.error("Error while creating urn");
      } 
  });

  let newPost = new PostModel({title, description, topics, upvotes, urn: newUrn._id, author: author_id});

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

router.post("/comments/:pid", function(req, res) {
  // INSTANTIATE INSTANCE OF MODEL
  let content = req.body.values.content;
  let token = req.body.author;

  let decodedToken = jwt.decode(token, { complete: true }) || {};
  let author_id = decodedToken.payload.user._id;

  const comment = new CommentsModel({content: content, author: author_id});

  // SAVE INSTANCE OF Comment MODEL TO DB
  comment
    .save()
    .then(comment => {
      return PostModel.findById(req.params.pid);
    })
    .then(post => {
      post.comments.unshift(comment);
      return post.save();
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
