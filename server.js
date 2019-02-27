const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the paris review website
app.get("/", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get(`https://www.theparisreview.org/poetry`).then(function (response) {
        // console.log(response.data);
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Now, we grab every a tag inside an article tag iterate through the elements to find the ones we are looking for and save them into the result object and then save it to mongoDB
        $('article a').each(function (i, element) {
            // Save an empty result object
            let result = {};

            result.title = $(this)
                .find('header')
                .find('section')
                .find('h1')
                .text();

            result.link = $(this)
                .attr('href');

            result.author = $(this)
                .find('header')
                .find('section')
                .find('address')
                .text();

            result.time = $(this)
                .find('header')
                .find('section')
                .find('time')
                .text();

            result.excerpt = $(this)
                .find('header')
                .find('section')
                .find('div')
                .text();

            console.log(`This is your .each POEM object building function: `, result);

            // Create a new Article using the `result` object built from scraping
            db.Poem.create(result)
                .then(function (dbPoem) {
                    // View the added result in the console
                    console.log(dbPoem);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        res.redner('index');
    });
});

// Route for getting all Articles from the db
app.get("/poems", function (req, res) {
    // Grab every document in the Articles collection
    db.Poem.find({})
        .then(function (dbPoem) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbPoem);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});kjh

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function (req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//         // ..and populate all of the notes associated with it
//         .populate("note")
//         .then(function (dbArticle) {
//             // If we were able to successfully find an Article with the given id, send it back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function (req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//         .then(function (dbNote) {
//             // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//             // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//             // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//             return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//         })
//         .then(function (dbArticle) {
//             // If we were able to successfully update an Article, send it back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// Start the server
app.listen(PORT, function () {
    console.log(`🐬 🐬 🐬 🐬 🐬 DATABASE CONNECTION SUCCESSFUL ON PORT: ${PORT}! 🐬 🐬 🐬 🐬 🐬`);
});