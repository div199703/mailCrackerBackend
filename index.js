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
    host: "localhost",
    user: "root",
    password: "",
    database: "mailtracker"
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

app.route('/recipients').get((req, res) => {
    conn.query('SELECT * FROM recipients', (err, rows) => {
      if (err) throw err;
      console.log(req.url+":"+res.statusCode);
      res.send(rows)
    });
})

app.route('/sendmail').post((req, res) => {
    let Sender = req.body['Sender'];
    let Recipient = req.body['Recipient'];
    let MessageBody = req.body['MessageBody'];
    let Subject = req.body['Subject'];

    let htmlBody = '<p>'+MessageBody+'</p>'+'<img src = "http://localhost:3000/recipients" hidden>'

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
        }
      });
    // connection.query('INSERT INTO shops (shop_name,shop_value,shop_details,shop_website) VALUES(?,?,?,?)', [shopName, shopValue, shopDetails, shopWebsite],
    //   (err, rows) => {
    //     if (err) {
    //       throw err,
    //       console.log("failed");
    //     };
    //     console.log('Data Inserted:');
    //     res.send('data inserted')
    //   });
  })