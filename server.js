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
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

// ===== other global variables ===== //
const PORT = process.env.PORT || 3111;

// ===== routes ===== //
app.get('/', getHomeData);
app.post('/search', getSearch);
app.get('/about', getAbout);
app.get('/saved-results', getSavedResults);
//app.post('/search', save);
app.delete('/search', deleteSaved);

// ===== callback functions ===== //
function getHomeData(req, res) {

  // rendering all the search information
  res.render('./pages/index.ejs');
}

async function getSearch(req, res) {
  // getsresults from the search
  // -> index.ejs
  const keyword = req.body.searchQuery;

  let resultNums = [];
  let googleTrendArray = await googleTrendsData(keyword);
  let valueMapArray = googleTrendArray.map(value => value.query);

  for (let index = 0; index < 5; index++) {
    let math = await scraper(valueMapArray[index]) /// googleTrendArray[index].value;
    resultNums.push(math);
  }
  //console.log(resultNums);

  let newArr = googleTrendArray.slice(0, 5).map((trendQuery, index) => {
    return new NovusIdeam(keyword, resultNums[index], trendQuery);
  });
  console.log(newArr);

  res.render('./pages/index.ejs', { novusIdeam: newArr });
}

function getAbout(req, res) {
  // sending the user to the about page
  // -> about.ejs
  res.render('./pages/about.ejs');
}

function save(req, res) {
  // saving the the search results to the DB
  // redirect to /saved-results?

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
  // delete saved query
  // -> saved.ejs

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
  return client.query(sqlQuery).then(result => {
    res.render('pages/saved.ejs', { results: result.rows }); // Passes 'results' to saved.ejs
  })
}
// ===== Helper Functions ===== // 
function domain(keyword) {
  const domainUrl = `https://api.domainsdb.info/v1/domains/search?&limit=5&country=us&domain=${keyword}`;
  superagent.get(domainUrl).then(search => {
    return search.body;
  }).catch(error => {
    console.error('we broke', error)
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
      console.error('Oh no there was an error', error);
    });
}

// ***Chance Harmon wrote most of the below function with reference to https://www.youtube.com/watch?v=4q9CNtwdawA ***
async function scraper(keyword) {
  let q = keyword;
  let url = `https://www.google.com/search?q=${q}`;
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(url, { waitIntil: 'networkidle2' })
  let data = await page.evaluate(() => {
    let resultCount = document.querySelector('#result-stats').textContent;
    return { resultCount }
  }).catch(error => {
    console.error('your scraper scraped the bottom', error);
  });
  await browser.close();
  const string = data.resultCount;
  const regex = /[0-9,]+/;
  const resultCountInt = parseInt(regex.exec(string)[0].replace(/,/g, ''));
  return resultCountInt;
}

async function scrapeAll(array) {
  let countArray = array;
  for (let item of countArray) {
    const totalResults = await scraper(item);
    item = totalResults;
  };
  return countArray;
}

// ===== other functions ===== //
function NovusIdeam(keyword, scraperNum, googleTrendQuery) {
  this.keyword = keyword,
    this.googleTrendQuery = googleTrendQuery.query,
    this.scraperNum = scraperNum,
    this.nicheScore = scraperNum / googleTrendQuery.value
}

// ===== start the server ===== //
client.connect() // Starts connection to postgres 
  .then(() => {
    app.listen(PORT, () => console.log(`up on PORT ${PORT}`));
  });