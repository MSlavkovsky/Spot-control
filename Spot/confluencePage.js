const puppeteer = require('puppeteer');
const variables = require('./variables.js');

class ConfluencePage {
    constructor() {

    }

    async execute(page, URL) {
        var fullInstanceName = null;
        await page.goto(URL, {timeout: 120000});
        await page.waitForSelector("#comments-section-fabric", { setTimeout: 10000 }) 
      
        console.log("Start of action")
      
        fullInstanceName = await page.evaluate(() => {
      
          const table = instalFilesTable();
          
          function instalFilesTable(){
            const tables = document.querySelectorAll('table')
            var table = null;
        
            for (let i = 0; tables.length > i; i++){
              if (tables[i].innerText.includes("Inventory file")){
                table = tables[i];
              }
            }
            return table
          }

          const tableRow = Array.from(table.rows).find(row => row.innerText.includes("Inventory file"));
          const rowCell = tableRow.cells[2].innerText
          
          const wholeString = document.querySelector('#main-content').innerText
          const lastSlashIndex = wholeString.lastIndexOf("/");
          const secondLastSlashIndex = wholeString.lastIndexOf("/", lastSlashIndex - 1);
          const instanceFullName = `${rowCell.substring(rowCell.lastIndexOf("-") + 1, rowCell.length)}-${wholeString.substring(secondLastSlashIndex + 1, lastSlashIndex)}`
      
          return instanceFullName
        })

        return fullInstanceName
    }
}

module.exports = ConfluencePage;