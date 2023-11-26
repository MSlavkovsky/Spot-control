const express = require('express');
const puppeteer = require('puppeteer');
const WebSocket = require('ws');
const { main } = require('./main');

const app = express();
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
var instances = [];
var inputURL = "";

const wss = new WebSocket.Server({ noServer: true });
app.server = server;

// Get an input from client side
app.get('/runPuppeteer', (req, res) => {
  instances = JSON.parse(decodeURIComponent(req.query.instances));
  inputURL = decodeURIComponent(req.query.inputURL);
  res.send('WebSocket connection established. Puppeteer execution will start shortly.'); 
});

// Run puppeteer with listeners
wss.on('connection', (webSocket) => {
  console.log('WebSocket connected'); 

  main(webSocket, inputURL, instances)
    .then(() => {
      webSocket.send(JSON.stringify({ progress: 'Puppeteer execution completed successfully.' }));
      webSocket.close();
    })
    .catch((error) => {
      webSocket.send(JSON.stringify({ progress: `Error during Puppeteer execution: ${error.message}` }));
      webSocket.close();
    });
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (webSocket) => {
    wss.emit('connection', webSocket, request);
  });
});

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
