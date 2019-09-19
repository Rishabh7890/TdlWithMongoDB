// jshint esversion:6

// require modules
const express = require("express");
const moment = require("moment");
const app = express();
const mongoose = require("mongoose");
let PORT = process.env.PORT || 3000;

// set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// tell app to use ejs.
app.set("view engine", "ejs");

// create new mongo db and connection. // set useNewUrlParser to true to get rid of deprication warning
mongoose.connect("mongodb://localhost:27017/tdlDB", { useNewUrlParser: true });

// create schema for items in db
const itemsSchema = new mongoose.Schema({
  name: String
});

// create model for db
const Item = mongoose.model("Item", itemsSchema);

// create a default document to be entered in Items collection
const defItem = new Item({
  name: "I had an awesome day today! 😁"
});

// put default item 'defItem' into array
const defItems = [defItem];

// create const for day using momentjs
const day = moment().format("dddd MMMM Do YYYY");

// get method. Be sure to create a views folder so we can use ejs
app.get("/", function(req, res) {
  // use find() on model to retrieve items from db
  // empty {} means we want all results back
  Item.find({}, function(err, results) {
    // if results come back as empty, insert defItems array into db using insertMany()
    if (results.length === 0) {
      // insert defItems array into db using insertMany()
      Item.insertMany(defItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted default items to db!");
        }
      });
      // redirect back to root route after adding defItems to db
      // once it redirects the app will actually go to else block below and render our page with items added to our list
      res.redirect("/");
    } else {
      // res.render() goes within else block if results !== 0.
      // correlate listTitle with day const
      // correlate newListItems with the results we have in our db
      res.render("list", { listTitle: day, newListItems: results });
    }
  });
});

// post route to add new item to list
app.post("/", function(req, res) {
  const newItem = req.body.newItem;
  console.log(newItem);
  // console log body of request to see what is getting back when we hit submit button and base if statement off of that
  console.log(req.body);

  // use dddd part of moment because the value will only be the characters before a space, not whole day const
  if (req.body.add === moment().format("dddd")) {
    // push newItem to newItems array
    newItems.push(newItem);

    // redirect back to home route since we added newItem to render above
    res.redirect("/");
  } else if (req.body.add === "Work") {
    workItems.push(newItem);

    res.redirect("work");
  }
});

// app listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
