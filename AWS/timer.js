const puppeteer = require('puppeteer');
const variables = require('./variables.js');

class WebScraper {
    constructor(page) {
        this.test();
        this.startCountdown(3, page);

    }

    async test() {
        console.log("Ahoj")
    };

    async startCountdown(durationInSeconds, page) {
        let timeRemaining = durationInSeconds;
      
        function updateCountdown() {
          if (timeRemaining <= 0) {
            console.log('Countdown completed!');
            console.log(variables.test);
            clearInterval(intervalId); 

            page.evaluate(( variables ) => {
              const instanceMenu = document.querySelector(variables.test)
              instanceMenu.click()
            }, variables)

          } else {
            console.log(`Time remaining: ${timeRemaining} seconds`);
            timeRemaining--;
          }
        }
        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);

      }
}

module.exports = WebScraper;