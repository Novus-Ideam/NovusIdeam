# Software requirements

## Vision
Novus Ideam is a utility for investigating novel web app ideas based on web search query data. While new ideas for web apps are a dime a dozen, we seek to provide a way to easily target keyword searches with a low query volume : result count ratio, allowing for an optimized targeting of subjects with relatively high search popularity and low result count. This product will allow budding entrepreneurs to more effectively target unsaturated niches in the exapnding web-app space, using data-based decision making to optimize their efforts.
## Scope (In/Out)
### Minimum Viable Product
* Our app will allow users to enter a keyword topic and return a suggested list of search terms related to that query
* Using google trends api, the app will return the most popular related search keywords to the user query.
* Our app will then retreive the number of google serach results for each suggested query.
* Search results will display a search volume : search result quotient (niche score). 
* Users will then be able to save these results if wanted, for later review.  
### Stretch
* Users will be able to explore available web domains related to these search results using a domain availability api. 
## Functional Requirements
1. A user can enter a search keyword query
2. A user can browse the results of that keyword search query
3. A user can save their results for later review
4. A user can delete saved results from the database. 
5. Stretch: A user can explore available web domains based on a search result. 
### Data Flow
When a user enters the app, they are presented with a search field. After entering a keyword, google-trends-api will run a 'relatedQueries' api request on the keyword, which returns a promise containing a JSON object. Using the contents of that JSON object, the app will generate an array of objects containing the most popular related keywords and their search popularity. Then, our app will use Cheerio to run a google.com search query for each resulting keyword, and scrape the search results html page for the reported number of search results produced by google. An algorithm comparing the search popularity and number of search results returned by google will then assign a niche score to each result. The results will then be displayed to the user, in ranked order of their niche score. If the user wants to save a search result, the result will be sent to the database using an `INSERT INTO` SQL query. 
When a user clicks on the /saved route, the app queries the sql database to return all saved search objects, and displays them to the user. 
REACH: When the user clicks 'explore domains related to this keyword' on the /saved route, the app will make a call to the domains-index api and return to the user a list of available web domains related to the keyword. 
## Non-Functional Requirements
Our app will store the server database URL, server API keys, and server port parameters in a separate `.env` file. This will prevent security vulnerabilities from exposing these sensitive data to publicly viewable pathways on our app. 

Because of the simple, single-user implementation of our database, any saved searches will be viewable/deletable by any user visiting the app. In the future, we could add session IDs and normalize our database to support private saved results for each user. 

Because we will be deploying on a Heroku server, our reliability and availability will remain dependent upon that third-party platform. 