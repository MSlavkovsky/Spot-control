const puppeteer = require('puppeteer');
const variables = require('./variables.js');
const Traffic = require('./traffic.js');

class Navigation {
    constructor(page, envInstances) {
        this.execute(page, envInstances);
    }

    async execute(page, envInstances) {
        await page.goto(variables.spotPage);
        await page.waitForSelector(variables.signInSSO_Btn, { timeout: 60000 });
        await (await page.$(variables.signIn_Btn)).click();

        // Login with SSO
        await page.waitForSelector('#input_2', { timeout: 60000 });
        await page.type('#input_2', variables.account);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
/*
        // Microsoft Login Page
        await page.evaluate(async (variables) => {
            const optionsTable = document.querySelector(variables.accountOptions)
            const optionsArray = Array.from(optionsTable.children).filter(child => child.tagName.toLowerCase() === 'div');
            
            try {
                for (let i = 1; optionsArray.length >= i; i++){
                    const element = document.querySelector(`#tilesHolder > div:nth-child(${i}) > div > div.table`)
                    if (element.innerText.includes(variables.account)) { 
                        element.click()
                        break;
                    }
                }
            } catch(error){
                console.log(error)
            }

        }, variables)
*/
        await page.waitForSelector(variables.mainScreenDiagram, { timeout: 60000 })

        // Account change
        await page.evaluate((variables) => {
            console.log("Change account menu")
            const shadowRoot = document.querySelector(variables.headerShadowRoot).shadowRoot
            const targetElement = shadowRoot.querySelector(variables.accountMenu_Btn)
            targetElement.click();

            setTimeout(function () {
                const shadowRoot = document.querySelector(variables.headerShadowRoot).shadowRoot
                const menuOptions = shadowRoot.querySelector(variables.accountMenuOptions)
                const targetElement = Array.from(menuOptions.children).filter(child => child.innerText === ` ${variables.awsAccount}`)
                targetElement[0].children[0].children[0].children[0].click();
            }, 1000);
        }, variables);

        // Navigation bar -> Elasti Group
        await page.waitForTimeout(2000);
        await page.evaluate((variables) => {
            console.log("Side menu")
            const shadowRoot = document.querySelector(variables.headerShadowRoot).shadowRoot
            const targetElement = shadowRoot.querySelector(variables.navBar_Btn)
            targetElement.click();

            setTimeout(function () {
                const shadowRoot = document.querySelector(variables.navBarShadowRoot).shadowRoot
                const targetElement = shadowRoot.querySelector(variables.navBarOption_Btn)
                targetElement.click();
            }, 1000);
        }, variables);

        // Side menu -> Groups
        await page.waitForSelector(variables.runningSpotNumber, { timeout: 60000 })
        await page.evaluate((variables) => {
            console.log("Groups select");
            const shadowRoot = document.querySelector(variables.navBarShadowRoot).shadowRoot;
            const targetElement = shadowRoot.querySelector(variables.sideMenuGroups_Btn);
            targetElement.click();
        }, variables);

        await page.waitForSelector(variables.instanceSearchBar, { visible: true }, { timeout: 60000 });

        const traffic = new Traffic(page, envInstances)


    }
}
module.exports = Navigation;