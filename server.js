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
