const puppeteer = require('puppeteer');
const variables = require('./variables.js');
const Spot = require('./Spot/main.js');

async function main(inputValue) {

  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: null
  });

  const page = await browser.newPage();
  const spot = new Spot(page, variables.instances, inputValue);

}

module.exports = { main };