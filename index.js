const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const keys = require('./environment/keys');
var cors = require('cors');

const Server = keys.OWN_SERVER;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(cors())

var conn = mysql.createConnection({
    host: keys.DB_HOST,
    user: keys.DB_USER,
    password: keys.DB_PASSWORD,
    database: keys.DB_DATABASE
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.CONFIG_EMAIL,
      pass: keys.CONFIG_EMAIL_PASS
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is listening...url: "+Server);
});

app.get('/', (req, res) => {
    res.json({"message": "Hi this is mail tracker node server"});
});

app.route('/recipients/:recipient').get((req, res) => {
  var Recipient = req.params['recipient'];
  var date_ob = new Date().toISOString().slice(0, 19).replace('T', ' ');
  conn.query('UPDATE recipients SET opened = true, lastseen= ? WHERE email=?', [date_ob,Recipient],
  (err, rows) => {
    if (err) {
      console.log(err);
    }else{
      console.log('Data Inserted:');
      res.send('data inserted')
    }
  });
})

app.route('/sendmail').post((req, res) => {
    let Sender = req.body['Sender'];
    let Recipient = req.body['Recipient'];
    let MessageBody = req.body['MessageBody'];
    let Subject = req.body['Subject'];

    let htmlBody = '<p>'+MessageBody+'</p>'+'<img src = "'+Server+'/recipients/'+Recipient+'" style="display:none">';

    var mailOptions = {
        from: Sender,
        to: Recipient,
        subject: Subject,
        html: htmlBody
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          conn.query('INSERT INTO recipients(email) VALUES(?)', [Recipient],
          (err, rows) => {
            if (err) {
              throw err,
              console.log(err);
            }else{
              res.send({"message": "success"});
            }
          });
        }
      });
  })