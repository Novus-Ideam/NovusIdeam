'use strict';


// ===== packages ===== //
const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const methodOverride = require('method-override');
const pg = require('pg');
const googleTrends = require('google-trends-api');
const puppeteer = require('puppeteer');


// ===== setup the app ===== //
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);


// ===== other global variables ===== //
const PORT = process.env.PORT || 3111;


// ===== routes ===== //
app.get('/', getHomeData);
app.post('/search', getSearch);
app.get('/about', getAbout);
app.get('/saved-results', getSavedResults);
app.post('/save', save);
app.delete('/save/:id', deleteSaved);


// ===== callback functions ===== //
function getHomeData(req, res) {
  // rendering all the search information
  res.render('./pages/index.ejs', { novusIdeam: [] });
}

async function getSearch(req, res) {
  // getsresults from the search
  // -> index.ejs

  //  TODO: add loading page to index.ejs
  const keyword = req.body.searchQuery;
  let resultNums = [];

  const googleTrendArray = await googleTrendsData(keyword);
  const valueMapArray = googleTrendArray.map(value => value.query);

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  const domainSuggestions = await domain(keyword);
  //const domainMapArray = domainSuggestions.map(suggestion => suggestion.domain)
  console.log(domainSuggestions.domains[0].domain);
  //console.log(domainSuggestions.domain);
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  //===================================================================//
  //  for (let index = 0; index < 5; index++) {
  //  let math = await scraper(valueMapArray[index])
  //  resultNums.push(math);
  //  }
  resultNums = await scraper(valueMapArray);
  console.log(resultNums);
  //===================================================================//


  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  let newArr = googleTrendArray.slice(0, 5).map((trendQuery, index) => {
    return new NovusIdeam(keyword, resultNums[index], trendQuery);
  });

  res.render('./pages/index.ejs', { novusIdeam: newArr });
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
function getAbout(req, res) {
  // send the user to the about page
  res.render('./pages/about.ejs');
}

function save(req, res) {
  // saving the the search results to the DB
  // redirect to /saved-results?

  // takes an 'ideam' object via POST on /search
  const ideam = req.body
  const sqlQuery = `INSERT INTO searches (keyword, google_results_count, niche_score) VALUES ($1, $2, $3) RETURNING id;`;
  const sqlArray = [ideam.googleTrendQuery, ideam.scraperNum, ideam.nicheScore]
  return client.query(sqlQuery, sqlArray).then(() => {
    console.log(`added ${ideam.googleTrendQuery} to database`);
    // TODO: notify user that ideam has been addedto database (using js to turn item blue?)
    res.redirect('/saved-results');

  }).catch(error => {
    res.status(500).render('pages/error.ejs');
    console.log(error.message);
  });
}

function deleteSaved(req, res) {
  // delete saved query
  // -> saved.ejs

  // takes DELETE on route /saved/:id 
  const id = req.params.id;
  console.log(id);
  // query db to delete item
  const sqlQuery = `DELETE FROM searches WHERE id = $1;`;
  const sqlArray = [id];
  return client.query(sqlQuery, sqlArray).then(() => {
    console.log(`deleted row ${id}`);
    res.redirect('/saved-results');
  }).catch(error => {
    res.status(500).render('pages/error.ejs');
    console.log(error.message);
  });
}

function getSavedResults(req, res) {
  // take the user to the saved results page. 
  // -> saved.ejs

  // Query SQL db for all saved searches
  const sqlQuery = `SELECT * FROM searches ORDER BY niche_score;`;
  return client.query(sqlQuery).then(result => {
    console.log(result.rows);
    res.render('pages/saved.ejs', { results: result.rows }); // Passes 'results' to saved.ejs
  }).catch(error => {
    res.status(500).render('pages/error.ejs');
    console.log(error.message);
  });
}

// ===== Helper Functions ===== // 
async function domain(keyword) {
  const domainUrl = `https://api.domainsdb.info/v1/domains/search?&limit=5&country=us&domain=${keyword}`;
  return superagent.get(domainUrl).then(search => {
    return search.body;
  }).catch(error => {
    res.status(500).render('pages/error.ejs');
    console.log(error.message);
  });
}

async function googleTrendsData(keyword) {
  return await googleTrends.relatedQueries({ keyword: keyword })
    .then(results => {
      const parsedResults = JSON.parse(results);
      //possible creat a toggle button that switches from 0 to 1 based on what the user is looking for.
      const relatedKeyword = parsedResults.default.rankedList[0].rankedKeyword;
      return relatedKeyword;
    }).catch(error => {
      res.status(500).render('pages/error.ejs');
      console.log(error.message);
    });
}

// ***Chance Harmon wrote most of the below function with reference to https://www.youtube.com/watch?v=4q9CNtwdawA ***
async function scraper(array) {
  const resultCountInts = [];
  let browser = await puppeteer.launch();
  // loop over array here 
  for (let i = 0; i < array.length; i++){
    const q = array[i];
    const url = `https://www.google.com/search?q=${q}`;
    let page = await browser.newPage();
    await page.goto(url, { waitIntil: 'networkidle2' });
    let data = await page.evaluate( () => {
      const resultCount = document.querySelector('#result-stats').textContent;
      return { resultCount }
    }).catch(error => {
      res.status(500).render('pages/error.ejs');
      console.log(error.message);
    });
    const string = data.resultCount;
    const regex = /[0-9,]+/;
    const resultCountInt = parseInt(regex.exec(string)[0].replace(/,/g, ''));
    resultCountInts.push(resultCountInt);
    // await page.close();
  }
  // end loop
  await browser.close();
  return resultCountInts;
}

// async function scrapeAll(array) {
//   let countArray = array;
//   for (let item of countArray) {
//     const totalResults = await scraper(item);
//     item = totalResults;
//   };
//   return countArray;
// }

// ===== other functions ===== //
function NovusIdeam(keyword, scraperNum, googleTrendQuery, suggestedDomain) {
  this.keyword = keyword,
    this.googleTrendQuery = googleTrendQuery.query,
    this.scraperNum = scraperNum,
    this.nicheScore = scraperNum / googleTrendQuery.value,
    this.suggestedDomain = suggestedDomain
}

// TODO: refactor error functions
// function errorFn(error) {
//   console.error('Oh no there was an error', error);
// }

// ===== start the server ===== //
client.connect() // Starts connection to postgres 
  .then(() => {
    app.listen(PORT, () => console.log(`up on PORT ${PORT}`));
  });