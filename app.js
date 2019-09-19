// jshint esversion:6

// require modules
const express = require("express");
const moment = require("moment");
const app = express();
let PORT = process.env.PORT || 3000;

// set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// tell app to use ejs.
app.set("view engine", "ejs");

// create arrays to be added to later in post requests
var newItems = [];
var workItems = [];

// create var for day using momentjs
var day = moment().format('dddd MMMM Do YYYY');

// get method. Be sure to create a views folder so we can use ejs
app.get("/", function(req, res) {

  // add each new created ejs marker to original render. On posts we just need to redirect back to home route.
  res.render("list", { listTitle: day, newListItems: newItems });
});

app.get("/work", function(req, res) {

  res.render("list", { listTitle: "Work List", newListItems: workItems});
});

// post route to add new item to list
app.post("/", function(req, res){

  var newItem = req.body.newItem;
  console.log(newItem);
  // console log body of request to see what is getting back when we hit submit button and base if statement off of that
  console.log(req.body);

  // use dddd part of moment because the value will only be the characters before a space, not whole day variable
  if(req.body.add === moment().format('dddd')){
    // push newItem to newItems array
    newItems.push(newItem);

  // redirect back to home route since we added newItem to render above
    res.redirect("/");
  }
  else if(req.body.add === "Work"){

    workItems.push(newItem);

    res.redirect("work");
  }

  
});

// app listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});