const puppeteer = require('puppeteer');
const variables = require('./variables.js');
const Spot = require('./Spot/main.js');

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: variables.wsChromeEndpointUrl,
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  const spot = new Spot(page, variables.instances);

})();