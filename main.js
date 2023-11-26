const puppeteer = require('puppeteer');
const variables = require('./variables.js');
const Spot = require('./Spot/main.js');

async function main(webSocket, inputURL, instances) {

  // If connect: chrome.exe --remote-debugging-port=9222 (will not execute headless)
  // If launch: simply run chrome (will execute headless)
  const browser = await puppeteer.launch({
    browserURL: 'http://localhost:9222',
    defaultViewport: null,
    headless: true
  });

  console.log(instances)
  console.log(inputURL)

  webSocket.send(JSON.stringify({ progress: 'Going to google page.' }));
  const page = await browser.newPage();
  await page.goto(inputURL);
  webSocket.send(JSON.stringify({ progress: 'On google page.' }));
  await page.close();
  
  /*
    const spot = new Spot(page, variables.instances, inputValue);
  */

}

module.exports = { main };