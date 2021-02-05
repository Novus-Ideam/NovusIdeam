# Novus Ideam

## Authors:
- Brendan Smith
- Dar-Ci Calhoun
- Jason Dormier
- Glenn Clark

## Overview
The user would like to generate ideas to start a small business but doesn’t know what their idea should be. The user would like to use a website to generate ideas based on the search volume of a given topic and compare it to the number of solutions that are currently provided. 

## Setup Instructions (for local hosting using PostgreSQL)
* `npm install` to install all required packages.
* create `.env` file in your local directory. Set `PORT` variable. 
* Set up psql database:
    * `CREATE DATABASE novus_ideam`
    * `psql novus_ideam -f schema.sql`
    * set `DATABASE_URL` to local database route in `.env`

## Architecture
* superagent
* express
* puppeteer
* dotenv
* ejs
* pg
* method-override
* jquery

## Change Log
* 1.0.1 added requirements and domain model
* 1.0.2 built server and index.ejs
* 1.0.3 DB ERD img update
* 1.0.4 added layout ejs
* 1.0.5 route setup and callback functions
* 1.0.6 imported google font for H1
* 1.0.7  added cheerio and google-trends-api partial complete to render
* 1.0.8 setup instructions, added table searches, added function search save and delete.
* 1.0.9 added initial css, navbar/search/about/index html and ejs
* 1.1.0 cleaned up text display
* 1.1.1 merged from dev to main
* 1.1.2 added jquery and links
* 1.1.3 added css, populated about page
* 1.1.4 added puppeteer, function: domain, googleTrendsData, scraper
* 1.1.5 navbar styling
* 1.1.6 added content and links to about page
* 1.1.7 mapped and slice googleTrendArray, changed index table to ejs
* 1.1.8 added method-override and save function
* 1.1.9 added mobile-first CSS
* 1.2.0 connected and cleaned up ejs
* 1.2.1 added css to about and nav
* 1.2.2 added domains to index.ejs
* 1.2.3 scraper function now takes array instead of individual keywords
* 1.2.4 search bar css, added magnifying glass
* 1.2.5 added domainurl, that grabs suggested domain names
* 1.2.6 refactored scrape function to run via Promise.all 
* 1.2.7 domain add complete
* 1.2.8 added toggle for list of domains
* 1.2.9 added numeric to schema.sql in place of INT
* 1.3.0 css debugging
* 1.3.1 css styling for li in table
* 1.3.2 MVP of novus-ideam
* 1.3.3 puppeteer browser load fix
* 1.3.4 bug fix for puppeteer browser launch on heroku
* 1.3.5 button bug fix
* 1.3.6 user params now wired in to google-trends-api query
* 1.3.7 css polishing
* 1.3.8 added code comments for clarity
* 1.3.9 added data validation, cleaned up results table
* 1.4.0 added css to footer, added content to about
* 1.4.1 domain filtering with regex complete
* 1.4.2 css cleanup
* 1.4.3 added content to about page
* 1.4.4 pre close push
* 1.4.5 added .catch to Promise.all in scrape()
* 1.4.6 heroku fix
* 1.4.7 css cleanup
* 1.4.8 updated changelog and architecture

## Credits and Collaborations
- Chance Harmon (TA)
- Skyler Burger (TA)
- Nico Ryan (TA)
- Nicholas Carignan (Teacher)
- Regex101.com
- https://www.youtube.com/watch?v=4q9CNtwdawA
- https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop#37576787
- magnifying glass made by https://www.freepik.com  from https://www.flaticon.com/
- Heroku Puppeteer buildpack: https://github.com/jontewks/puppeteer-heroku-buildpack

## Domain Model
![Domain Model](public/assets/NoIdeamDomainModel.png)
## Database ERD
![DB-ERD](public/assets/db.png)