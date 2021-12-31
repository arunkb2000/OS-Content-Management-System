//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent ="";
const aboutContent ="";
const contactContent ="";
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://admin-arunkb:arunkb15@posts.pu1cc.mongodb.net/blog-posts", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);
// let posts = [];
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
  res.render("home", {
    homeContent: homeStartingContent,
    posts: posts
    });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post= new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });  
});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;
  Post.findOne({_id: requestedId},function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content,
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {about: aboutContent})
});

app.get("/contact", function(req, res){
  res.render("contact", {contact: contactContent})
});

app.get("/posts", function(req, res){
  res.redirect("/");
});



let port=process.env.PORT;
if(port == null || port == ""){
port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
