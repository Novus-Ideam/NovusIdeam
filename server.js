'use strict';
// ===== packages ===== //
const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
// const methodOverride = require('method-override');
// const pg = require('pg');

// ===== setup the app ===== //
const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.static('./public'));
// const DATABASE_URL = process.env.DATABASE_URL;
// const client = new pg.Client(process.env.DATABASE_URL);

// ===== other global variables ===== //
const PORT = process.env.PORT || 3111;

// ===== routes ===== //

app.get('/', getHomeData);

// ===== helper functions ===== //

function getHomeData(req, res){
  res.render('./pages/index.ejs');
}

// ===== other functions ===== //

// ===== start the server ===== //
app.listen(PORT, () => console.log(`up on PORT ${PORT}`));
