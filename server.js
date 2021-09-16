const express = require('express');
const app = express();
const path = require(`path`);
const bodyParser = require('body-parser');

//SendGridの設定
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Imports the Google Cloud client library
const {Datastore} = require('@google-cloud/datastore');
// Creates a client
const datastore = new Datastore();
// The kind for the new entity
const kind = 'Dat1';
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
      year: req.body.year,
      mail: req.body.mail
    },
  };
    // Saves the entity
  datastore.save(task);

  console.log({
    name: req.body.name,
    school: req.body.school,
    year: req.body.year,
    mail: req.body.mail
  });

  //メール内容
  const msg = {
    to: req.body.mail, // Change to your recipient
    from: process.env.SENDGRID_SENDER, // Change to your verified sender
    subject: '西沢立衛講演会仮登録完了',
    html: '<p>この度は、11/19(木)西沢立衛講演会にお申し込みいただき、誠にありがとうございます。</p><p>まだ予約は完了していません。以下のURLよりzoomウェビナー参加のご登録をお願い致します。</p><p>https://us02web.zoom.us/webinar/register/WN_FHHecRn9QA2m2lUWpjLm9A</p><p>※定員が1000名と制限があるため、事前登録をお願いします。</p><p>どうか、みなさまのご協力をお願い致します。</p><p>当日お会いできることを楽しみにしております。</p><p>自動返信メールにて送信しております。本メールに返信なされないようお願い致します。</p><p>--------------------------------------------------------------------------------------------------</p><p>主催：plustic</br>協賛：総合資格学院｜シービーリサーチ｜生和コーポレーション</p>',
  }

  //メール送信
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

  res.render('done.ejs', {mail: req.body.mail});
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});