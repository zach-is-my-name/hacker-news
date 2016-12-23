
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const DATABASE_URL = process.env.DATABASE_URL ||
                     global.DATABASE_URL ||
                     'mongodb://localhost/hn-api';
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());

const {NewsPost} = require('./models');

//API Endpoints Below

app.post('/stories', (req, res) => {
const requiredFields = ['title', 'url'];
requiredFields.forEach(field => {
        if (!field in req.body) {
        res.status(400).json({
            error: `Missing '$(field)' in request body`});

}});

  NewsPost
    .create({
      title: req.body.title,
      url: req.body.url
    })
   .then(storyPost => res.status(201).json(storyPost.apiRepr()))
   .catch(err => {
       console.error(err);
       res.status(500).json({error: 'Something went wrong'});
    });

});

// Server Connections Below

let server;
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
