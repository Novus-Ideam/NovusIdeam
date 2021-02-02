'use strict';
// ===== packages ===== //
const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const methodOverride = require('method-override');
const pg = require('pg');

// ===== setup the app ===== //
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(process.env.DATABASE_URL);

// ===== other global variables ===== //
const PORT = process.env.PORT || 3111;

// ===== routes ===== //

app.get('/', getHomeData);
app.get('/search', getSearch);
app.get('/about', getAbout);
app.get('/saved-results', getSavedResults);
app.post('/search', save);
app.delete('/search', deleteSaved);

// ===== helper functions ===== //

function getHomeData(req, res) {
  //rendering all the search information
  res.render('./pages/index.ejs');
}

function getSearch(req, res) {
  //getting the results from the search
  //index.ejs
}

function getAbout(req, res) {
  //sending the user to the about page
  // about.ejs
}

function save(req, res) {
  //saving the the search results to the DB
  //saved.ejs
}

function deleteSaved(req, res) {
  //delete saved 
  //saved.ejs

}

function getSavedResults(req, res) {
  //take the user to the saved results page. 
  //saved.ejs
}

// ===== other functions ===== //

// ===== start the server ===== //
app.listen(PORT, () => console.log(`up on PORT ${PORT}`));
