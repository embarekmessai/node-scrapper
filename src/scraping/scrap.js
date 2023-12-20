const browserObject = require('./browser');
const scraperController = require('./pageController');


const scrap = async (url) => {
    // return console.log('scrap ', url);
  return new Promise((resolve, reject) => {
      //Start the browser and create a browser instance
      let browserInstance = browserObject.startBrowser();
  
      // Pass the browser instance to the scraper controller
      console.log('scrap ', url);
      resolve(scraperController(browserInstance, url));        
  
    // resolve( console.log('scrap ', url))

  });
}

module.exports = scrap;