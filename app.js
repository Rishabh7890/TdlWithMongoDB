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
  const itemName = req.body.newItem;

  // create a document for item from req.body to store in db
  const addedItem = new Item ({
    name: itemName
  });
  
  // save the added item into db
  addedItem.save();

  // after saving the new item, redirect back to home route to display new list
  res.redirect("/");
});

// create post route for deleting items when checkbox is hit
app.post("/delete", function(req, res){
  // create const for what we get back as the value of req.body.checkbox
  // without value in form in list.ejs we would simply get back "on". Since we set value to item._id we get back _id
  const checkedItemId = req.body.checkbox;

  // remove checked item by using findByIdAndDelete()
  Item.findByIdAndDelete(checkedItemId, function(err){
    if(err){
      console.log(err);
    } else {
      console.log(`Successfully deleted item with id ${checkedItemId}`);
      // redirect back to home route after deleting item from db
      res.redirect("/");
    }
  });
});

// app listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
