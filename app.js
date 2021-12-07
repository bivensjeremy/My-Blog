require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const log = console.log


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://admin:" + process.env.BLOGDBPASSWORD + "@clusterformyblog.qiths.mongodb.net/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const blogPostSchema = {
    title: String,
    content: String,
    uploadDate: Date
};

const Post = mongoose.model('Post', blogPostSchema)
let isLoggedIn = false;

app.get('/', function(req, res){
    Post.find({}, function(err, posts){
        res.render('home', {
        posts:posts
        })
    });   
});

app.get('/sign-in', function(req, res){
    res.render('sign-in')
});

app.post('/sign-in', function(req, res){
    const password = req.body.password;
    const composerPassword = process.env.AUTH_PASS;
    if(password === composerPassword){
        res.render('compose');
        isLoggedIn = true;
    } else{
        res.render('sign-in');
    }  
});

app.get('/compose', function(req, res){
    if (isLoggedIn = true){
      res.render('compose')  
    } else {
        res.render('sign-in')
    };  
});

app.post('/compose', function(req, res){
    const post = new Post ({
        title: req.body.postTitle,
        content: req.body.postBody,
    });
    
    post.save(function(err){
        if(!err){
            res.redirect('/');
        }
    });
});

app.get('/sign-out', function(req, res){
    isLoggedIn = false;
    res.redirect('/')
});

app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;
      Post.findOne({_id: requestedPostId}, function(err, post){
        res.render('post', {
          title: post.title,
          content: post.content
        });
      }); 
    });

app.listen(3000, function(){
    log("Server on 3000")
});