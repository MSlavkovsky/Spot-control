* To install web server with puppeteer run command:
    1. navigate to SPOT-CONTROL folder
    2. run: npm init -y
    3. run: npm install express puppeteer

* To run app you must run Chrome instance with with listener:
    1. run cmd and navigate to Chrome.exe folder (Ussualyly: C:\Program Files\Google\Chrome\Application)
    2. run: chrome.exe --remote-debugging-port=9222
    3. navigate to SPOT-CONTROL folder
    4. run: node server.js
    5. click on link to web
