let express = require('express');
let router = express.Router();
let PostModel = require('../models/Post');
let UrnModel = require('../models/Urn');
let CommentsModel = require('../models/Comments');
const jwt = require('jsonwebtoken');
const { populate } = require('../models/Comments');
const UserModel = require('../models/User');

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
                                                populate: { path: 'author' }, 
                                              }).populate({
                                                path: 'comments',
                                                populate: { 
                                                    path: 'subcomments',
                                                    populate: 'author'
                                                } 
                                              })
    .populate("author").then( (post) => {
        res.json(post);
      }
    ).catch((err) => {
      return console.error(err);
    });
});


router.post('/add_post', function(req, res, next) {

  let title = req.body.title;
  let description = req.body.description;
  let topics = req.body.topics;
  let upvotes = 0;
  let upvotesUsers = [];
  let token = req.cookies["nToken"];

  let decodedToken = jwt.decode(token, { complete: true }) || {};
  let author_id = decodedToken.payload.user._id;

  let posVotes = 0;
  let negVotes = 0;
  let posUsers = [];
  let negUsers = [];
  let isClosed = false;

  UserModel.findById(author_id , function(err, user) {
    if (err){
      return console.error(`Not a valid user`);
    } else {
      user.reputation += 50;
      user.save();
    }
  });

  let newUrn = new UrnModel({posVotes, posUsers, negVotes, negUsers, isClosed});

  newUrn.save(function(err, urn){
      if(err) {
          return console.error("Error while creating urn");
      } 
  });

  let newPost = new PostModel({title, description, topics, upvotes, urn: newUrn._id, author: author_id, upvotesUsers: upvotesUsers});

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
      return console.error(`No post found with id: ${req.params.pid}`);
    } else {
      let token = req.cookies["nToken"];

      let decodedToken = jwt.decode(token, { complete: true }) || {};
      let user_id = 0;
      if (decodedToken.payload && decodedToken.payload.user){
        user_id = decodedToken.payload.user._id;
      } else {
        console.error("Invalid user");
      }

      UserModel.findById(user_id , function(err, user) {
        if (err){
          return console.error(`Invalid User`);
        } else {
          user.reputation += 1;
          user.save();
        }
      });

      if(post.upvotesUsers.includes(user_id)){
          post.upvotesUsers.splice(post.upvotesUsers.indexOf(user_id), 1);
          post.upvotes = post.upvotes - 1;
      } else {
          post.upvotesUsers.push(user_id);
          post.upvotes = post.upvotes + 1;
      }

      //post.upvotes = post.upvotes + 1;
      let newUps = post.upvotes;
      
      post.save();

      return res.json(newUps);
    }
  });

});

router.post('/delete_post/:pid', function(req, res, next) {
  let token = req.cookies["nToken"];
  let author_id = req.body.author_id;
  console.log(req.body);

  let decodedToken = jwt.decode(token, { complete: true }) || {};
  let user_id = 0;

  if (decodedToken.payload && decodedToken.payload.user){
    user_id = decodedToken.payload.user._id;
  } else {
    return console.error("Invalid user");
  }

  console.log(user_id);
  console.log(author_id);

  if (user_id !== author_id){
    return console.error("Invalid operation for current user");
  }

  PostModel.deleteOne({ _id: req.params.pid }, function (err) {
      if(err) {
         return console.error(`No post found with id: ${pid}`); 
      } 
  });
});

router.post("/comments/:pid", function(req, res) {
  // INSTANTIATE INSTANCE OF MODEL
  let content = req.body.content;
  let token = req.cookies["nToken"];

  let decodedToken = jwt.decode(token, { complete: true }) || {};
  let author_id = 0;
  if (decodedToken.payload){
    author_id = decodedToken.payload.user._id;
  } else {
    return console.error("Invalid user token");
  }

  UserModel.findById(author_id , function(err, user) {
    if (err){
      return console.error(`Error loading user: ${user_id}`);
    } else {
      user.reputation += 10;
      user.save();
    }
  });

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

router.post("/comments/sub/:cid", function(req, res) {
  // INSTANTIATE INSTANCE OF MODEL
  let content = req.body.content;
  let token = req.cookies["nToken"];

  let decodedToken = jwt.decode(token, { complete: true }) || {};
  let author_id = 0;
  if (decodedToken.payload){
    author_id = decodedToken.payload.user._id;
  } else {
    return console.error("Invalid user token");
  }

  UserModel.findById(author_id , function(err, user) {
    if (err){
      return console.error(`Invalid user`);
    } else {
      user.reputation += 10;
      user.save();
    }
  });

  let subcomments = []

  const comment = new CommentsModel({content: content, author: author_id, subcomments: subcomments});

  // SAVE INSTANCE OF Comment MODEL TO DB
  comment
    .save()
    .then(comment => {
      return CommentsModel.findById(req.params.cid);
    })
    .then(parent_comment => {
      parent_comment.subcomments.unshift(comment);
      return parent_comment.save();
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
