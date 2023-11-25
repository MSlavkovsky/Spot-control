const puppeteer = require('puppeteer');
const variables = require('./variables.js');
const variables1 = require('../variables.js');
const ConfluencePage = require('./confluencePage.js');
const Navigation = require('./navigation.js');

class Spot {
  constructor(page, envInstances, inputValue) {
    this.execute(page, envInstances, inputValue)
    this.test = 1
  }

  async execute(page, envInstances, inputValue) {
    const confluencePage = new ConfluencePage()

    for (const instance of variables1.instances) {
      if (instance.name.includes("https://") && instance.action !== '') {
        instance.name = await confluencePage.execute(page, instance.name)
      }
    }

    await page.goto(variables.spotPage, { timeout: 120000 });
    await page.waitForTimeout(1000);

    const navigation = new Navigation(page, envInstances);

  }

}

module.exports = Spot;