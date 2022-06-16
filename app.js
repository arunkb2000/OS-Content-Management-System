//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const nodemailer=require('nodemailer');
const path=require('path');
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent ="";
const aboutContent ="";
const contactContent ="";
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://admin-arunkb:arunkb15@posts.pu1cc.mongodb.net/blog-posts", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);
// let posts = [];

app.get('/',function(req,res){
  res.render('signup');
});

var email;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 25,
  secure: false,
  service : 'Gmail',
  
  auth: {
    user: 'projectwork204@gmail.com',
    pass: '@Placement2022@',
  },
  tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
  },
  
});
  
app.post('/send',function(req,res){
  email=req.body.email;

   // send mail with defined transport object
  var mailOptions={
      to: req.body.email,
     subject: "Otp for registration is: ",
     html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" 
   };
   
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('otp',{msg:"otp has been sent"});
  });
});

app.post('/verify',function(req,res){

  if(req.body.otp==otp){
    app.get("/home", function(req, res){
      const pageCount = 2;
      Post.find({}, function(err, posts){
        let page=Object.keys(posts).length;
        if (!page) { page = 1;}
        if (page > pageCount) {
          page = pageCount
        }
 //Below code is for pagination(not complete code only limited page we can see using this code we need to modify it as well)
//       res.render("home", {
//         homeContent: homeStartingContent,
//         page: page,
//         pageCount: pageCount,
//         posts: posts.slice(page * 2 - 2, page * 2)
//         });
        res.render("home", {
        homeContent: homeStartingContent,
        page: page,
        pageCount: pageCount,
        posts: posts
        });
      });
    });
    res.redirect("/home");
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
          res.redirect("/home");
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
      res.redirect("/home");
    });
  }
  else{
      res.render('otp', {
          msg : 'otp is incorrect'
      });
  }
});  
app.post('/resend',function(req,res){
  var mailOptions={
      to: email,
     subject: "Otp for registration is: ",
     html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" 
   };
   
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('otp',{msg:"otp has been sent"});
  });

});





let port=process.env.PORT;
if(port == null || port == ""){
port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
