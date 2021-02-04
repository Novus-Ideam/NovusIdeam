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
<!-- TODO -->
## Change Log
<!-- TODO -->
* 1.0.1 
* 1.0.2
* 1.0.3
* 1.0.4
* 1.0.5
* 1.0.6
* 1.0.7
* 1.0.8
* 1.0.9
* 1.1.0
* 1.1.1
* 1.1.2
* 1.1.3
* 1.1.4
* 1.1.5
* 1.1.6
* 1.1.7
* 1.1.8
* 1.1.9
* 1.2.0
* 1.2.1
* 1.2.2
* 1.2.3
* 1.2.4
* 1.2.5
* 1.2.6 


## Credits and Collaborations
- Chance Harmon (TA)
- Skyler Burger (TA)
- Nico Ryan (TA)
- Regex101.com
- https://www.youtube.com/watch?v=4q9CNtwdawA
- https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop#37576787
- magnifying glass made by https://www.freepik.com  from https://www.flaticon.com/

## Domain Model
![Domain Model](public/assets/NoIdeamDomainModel.png)
## Database ERD
![DB-ERD](public/assets/db.png)