'use strict';
// ===== packages ===== //
const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const methodOverride = require('method-override');
const pg = require('pg');
const googleTrends = require('google-trends-api');
const cheerio = require('cheerio');//needed for the google scrape of the results

// ===== setup the app ===== //
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

// ===== other global variables ===== //
const PORT = process.env.PORT || 3111;

// ===== routes ===== //

app.get('/', getHomeData);
app.post('/', getSearch);
app.get('/about', getAbout);
app.get('/saved-results', getSavedResults);
app.post('/search', save);
app.delete('/search', deleteSaved);

// ===== callback functions ===== //

function getHomeData(req, res) {
  //rendering all the search information
  let keyword = 'mucho burrito';

  googleTrends.relatedQueries({ keyword: keyword })
    .then(results => {
      //console.log(`is this working? ${JSON.parse(results.default.rankedList[0].rankedKeyword)}`);
      const parsedResults = JSON.parse(results);
      console.log(parsedResults.default.rankedList[1]);//possible creat a toggle button that switches from 0 to 1 based on what the user is looking for.
      const rankedKeywordList = parsedResults.default.rankedList[1];
    }).catch(error => {
      console.error('Oh no there was an error', error);
    });

  const domainUrl = `https://api.domainsdb.info/v1/domains/search?&limit=5&country=us&domain=${keyword}`;
  superagent.get(domainUrl).then(search => {
    const suggestedDomains = search.body;
    console.log(suggestedDomains);
  });
  res.render('./pages/index.ejs');
}

function getSearch(req, res) {
  //getting the results from the search
  //index.ejs
}

function getAbout(req, res) {
  //sending the user to the about page
  // about.ejs
  res.render('./pages/about.ejs');
}

function save(req, res) {
  //saving the the search results to the DB
  //redirect to /saved-results?

  // takes an 'ideam' object via POST on /search
  const keyword = req.body
  const sqlQuery = `INSERT INTO searches (keyword, google_results_count, niche_score) VALUES ($1, $2, $3) RETURNING id;`;
  const sqlArray = [ideam.keyword, ideam.google_results_count, ideam.niche_score]
  return client.query(sqlQuery, sqlArray).then(() => {
    // notify user that ideam has been addedto database (using js to turn item blue?)
    console.log(`added ${ideam.keyword} to database`);
  })
}

function deleteSaved(req, res) {
  //delete saved 
  //saved.ejs

  // takes DELETE on route /saved-results/:id 
  const id = req.params.id;
  // query db to delete item
  const sqlQuery = `DELETE FROM searches WHERE id = $1;`;
  const sqlArray = [id];
  return client.query(sqlQuery, sqlArray).then(() => {
    console.log(`deleted row ${id}`);
    res.redirect('/saved-results');
  })
}

function getSavedResults(req, res) {
  //take the user to the saved results page. 
  //saved.ejs
  
  // Query SQL db for all saved searches
  const sqlQuery = `SELECT * FROM searches ORDER BY id;`;
  return client.query(sqlQuery).then( result => {
    res.render('pages/saved.ejs', {results : result.rows}); // Passes 'results' to saved.ejs
  })
}
// ===== Helper Functions ===== // 

// ===== other functions ===== //

// ===== start the server ===== //
client.connect() // Starts connection to postgres 
.then ( () => {
  app.listen(PORT, () => console.log(`up on PORT ${PORT}`));
});