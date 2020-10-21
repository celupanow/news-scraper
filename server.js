//requiring all our dependencies and the database
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

//assigning the port starting express
var PORT = process.env.PORT || 3000;
var app = express();

//logger and morgan middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//database
var DB_URI = process.env.DB_URI || "mongodb://localhost/news-scraper";

mongoose.connect(DB_URI);

//a route to scrape articles from time.com
app.get("/scrape", function(req, res) {
    axios.get("http://www.time.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            var result = {};

            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        // res.send("Scrape Complete");
        res.sendFile("/", { root: "public" });
    });
});

//a route to display all the articles in the database
app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//a route to display the saved articles
app.get("/savedarticles", function(req, res) {
    db.Article.find({ saved: true })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//a route to display the saved articles page
app.get("/saved", function(req, res) {
    res.sendFile("saved.html", { root: "public" });
});

//a route to populate the notes of a specific article
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//a route to update a specific article with a new note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//a route to save an article
app.post("/save/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true })
  .then(function(dbArticle) {
      res.json(dbArticle);
  })
  .catch(function(err) {
      res.json(err);
  });
});

//a route to remove an article from the saved articles
app.post("/remove/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { new: true })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
  });


//listening for the port
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});