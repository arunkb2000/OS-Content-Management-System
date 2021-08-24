//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "C++ is an extension of C language developed by Bjarne Stroustrup as a general-purpose programming language. The motivation to build C++ was to create something suitable for large software applications. Professor Stroustrup chose C because of its features like general-purpose, speed, portability and the high usage of the language back then. Now that there are thousands of languages and frameworks are introduced, programmers find it complicated to engage with C++.";
const aboutContent = "A programming language is a formal language comprising a set of strings that produce various kinds of machine code output. Programming languages are one kind of computer language, and are used in computer programming to implement algorithms. Most programming languages consist of instructions for computers.";
const contactContent = "Here are the 10 most popular platforms developers use to program projects, according to the report: Linux (80%), Windows (77%), macOS (50%), Raspberry Pi (39%), Docker Container (37%), AWS (35%), Arduino (28%), iOS (24%), Microsoft Azure (23%), Google Cloud Platform (22%). When it comes to actually deploying projects, developers and IT professionals are most likely to use Linux (81%) or Windows (72%), followed by Amazon Web Services (AWS) (37%), macOS (35%), and Docker containers (35%), the report found.";

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
