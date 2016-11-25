var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var path = require('path');

var app = express();
var port = process.env.PORT || 3000;

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
}

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.username, // Your email id
            pass: process.env.password  // Your password
        }
    }); // handle the route at yourdomain.com/sayHello

/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/send', function(req, res, next) {
    let mailOptions = {
        to : req.query.to,
        subject : req.query.subject,
        text : req.query.text
    };

    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            return next(err);
        } else {
            console.log('Message sent: ' + info.response);
            res.json({ 
                reply: info.response
            });
        };
    });
});

/*--------------------Routing Over----------------------------*/

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`)
});