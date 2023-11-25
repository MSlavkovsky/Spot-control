const express = require('express');
const puppeteer = require('puppeteer');
const { main } = require('./main');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/run-puppeteer', async (req, res) => {
  const inputValue = JSON.parse(decodeURIComponent(req.query.inputValue));

  try {
    console.log('Server - inputValue:', inputValue);
    await main(inputValue);
    res.send('Puppeteer completed successfully!');
  } catch (error) {
    console.error('Error running Puppeteer:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});