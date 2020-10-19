const express = require('express');
const app = express();
const path = require(`path`);
const bodyParser = require('body-parser');

// Imports the Google Cloud client library
const {Datastore} = require('@google-cloud/datastore');
// Creates a client
const datastore = new Datastore();
// The kind for the new entity
const kind = 'Test1';
// The name/ID for the new entity
const name = null;
// The Cloud Datastore key for the new entity
const taskKey = datastore.key([kind, name]);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('form.html')
});

app.post('/submit', (req, res) => {

    // Prepares the new entity
    const task = {
      key: taskKey,
      data: {
        name: req.body.name,
        school: req.body.school,
        email: req.body.email
      },
    };
    // Saves the entity
    datastore.save(task);

  console.log({
    name: req.body.name,
    school: req.body.school,
    email: req.body.email
  });

  res.render('done.ejs', {email: req.body.email});
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});