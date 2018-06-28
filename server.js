require('dotenv').config(); //read .env files
const express = require('express');
const { getRates } = require('./lib/fixer-service.js');

const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Express Error handler
const errorHandler = (err, req, res) => {
   if(err.response) {
      // Request was made and response was not in 2xx
      res.status(403).send({ title: 'Server responded with an error', message: err.message});
   } else if(err.request) {
      // Request was made but no response was received
      res.status(503).send({ title: 'Unable to communicate with server', message: err.message});
   } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).send({title: 'An unexpected error occurred', message: err.message});
   }
};

// Fetch Latest Currency Rates
app.get('/api/rates', async(req, res) => {
   try {
      const data = await getRates();
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
   } catch (error) {
      errorHandler(error, res, req);
   }
});

app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
   console.log('Listening on %d', port);
});

// const test = async() => {
//    const data = await getRates();
//    console.log(data);
// }

// test();