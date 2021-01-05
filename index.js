const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
var cors = require('cors')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(cors()) // Use this after the variable declaration

var conn = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    user: "sql9385123",
    password: "sYgy78DbJc",
    database: "sql9385123"
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sendercracker@gmail.com',
      pass: 'Sool@670qw'
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is listening on port ");
});

app.get('/', (req, res) => {
    res.json({"message": "Hi this is mail tracker node server"});
});

app.route('/recipients/:recipient').get((req, res) => {
  const Recipient = req.params['recipient'];
  var datetime = "LastSync: " + new Date().today() + " @ " + new Date().timeNow();
  connection.query('UPDATE recipients SET opened = true, lastseen= ? WHERE email=?', [datetime,Recipient],
  (err, rows) => {
    if (err) {
      throw err,
      console.log("failed");
    };
    console.log('Data Inserted:');
    res.send('data inserted')
  });
})

app.route('/sendmail').post((req, res) => {
    let Sender = req.body['Sender'];
    let Recipient = req.body['Recipient'];
    let MessageBody = req.body['MessageBody'];
    let Subject = req.body['Subject'];

    let htmlBody = '<p>'+MessageBody+'</p>'+'<img src = "https://mailtracker10.herokuapp.com/recipients/'+Recipient+' hidden>';

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
          console.log('Email sent: ' + info.response);
          res.send({"message": "success"});
          connection.query('INSERT INTO recipients(email) VALUES(?)', [Recipient],
          (err, rows) => {
            if (err) {
              throw err,
              console.log("failed");
            };
            console.log('Data Inserted:');
            res.send('data inserted')
          });
        }
      });
  })