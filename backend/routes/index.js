let express = require('express');
let router = express.Router();
let PostModel = require('../models/Post');
let UrnModel = require('../models/Urn');
let CommentsModel = require('../models/Comments');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

let schedule = require('node-schedule');

let programClosing = (post_id) => {
    let futureDate = new Date(new Date().getTime() + 30 * 60 * 24 * 1000); // This is 48 hours from *now*
    console.log(`PROGRAMANDO EVENTO SOBRE: ${post_id} PARA FECHA ${futureDate}`);
    
    schedule.scheduleJob(futureDate, function(){
        console.log(`DISPARANDO EVENTO SOBRE ${post_id}`);
        PostModel.findById(post_id)
        .then( (post) => {
          post.isClosed = true;
          post.save();
        }
        ).catch(() => {
          return console.error("Error while scheduling event");
        });
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bruno malo' });
});


router.get('/get_posts', function(req, res, next) {
  PostModel.find(function(err, posts){
    if(err) {
        return console.error("Error in get DB operation");
    } else {
        res.json(posts);
    }
  })
});

router.get('/posts_by_topics', function(req,res,next) {
  PostModel.find({topics: { $in: req.query.topics }}, function(err, posts) {
    if (err) {
      return console.error("Error in get DB operation");
    }
    else {

      res.json(posts);
    }
  });
    
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

  let newPost = new PostModel({title, description, topics, upvotes, urn: newUrn._id, author: author_id, upvotesUsers: upvotesUsers, isClosed: isClosed});

  newPost.save(function(err, pub){
      if (err) {
        return console.error("Error while adding Post");
      } 
  });
  console.log(newPost._id);
  programClosing(newPost._id);
  return res.send(`${title} saved successfuly`);

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
        return console.error("Invalid user");
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
  

  let decodedToken = jwt.decode(token, { complete: true }) || {};
  let user_id = 0;

  if (decodedToken.payload && decodedToken.payload.user){
    user_id = decodedToken.payload.user._id;
  } else {
    return console.error("Invalid user");
  }

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

  let subcomments = [];
  let upvotes = 0;
  let upvotesUsers = [];

  const comment = new CommentsModel({content: content, author: author_id, subcomments: subcomments, upvotes: upvotes, upvotesUsers: upvotesUsers});

  // SAVE INSTANCE OF Comment MODEL TO DB
  comment
    .save()
    .then(comment => {
      return PostModel.findById(req.params.pid);
    })
    .then(async (post) => {
      post.comments.unshift(comment);
      post.save();
      await comment.populate("author").execPopulate();
      return res.json(comment);
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
  let upvotes = 0;
  let upvotesUsers = [];

  const comment = new CommentsModel({content: content, author: author_id, subcomments: subcomments, upvotes: upvotes, upvotesUsers: upvotesUsers});

  // SAVE INSTANCE OF Comment MODEL TO DB
  comment
    .save()
    .then(comment => {
      return CommentsModel.findById(req.params.cid);
    })
    .then(async (parent_comment) => {
      parent_comment.subcomments.unshift(comment);
      parent_comment.save();
      await comment.populate("author").execPopulate();
      return res.json(comment);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/comments/upvote/:cid", function(req, res){
  CommentsModel.findById(req.params.cid, function (err, comment) {
    if (err){
      return console.error(`No comment found with id: ${req.params.cid}`);
    } else {
      let token = req.cookies["nToken"];

      let decodedToken = jwt.decode(token, { complete: true }) || {};
      let user_id = 0;
      if (decodedToken.payload && decodedToken.payload.user){
        user_id = decodedToken.payload.user._id;
      } else {
        return console.error("Invalid user");
      }

      UserModel.findById(user_id , function(err, user) {
        if (err){
          return console.error(`Invalid User`);
        } else {
          user.reputation += 1;
          user.save();
        }
      });

      if(comment.upvotesUsers.includes(user_id)){
          comment.upvotesUsers.splice(comment.upvotesUsers.indexOf(user_id), 1);
          comment.upvotes = comment.upvotes - 1;
      } else {
          comment.upvotesUsers.push(user_id);
          comment.upvotes = comment.upvotes + 1;
      }

      //post.upvotes = post.upvotes + 1;
      let newUps = comment.upvotes;
      
      comment.save();

      return res.json(newUps);
    }
  });
});

module.exports = router;
