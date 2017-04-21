/**
 *
 **/

'use strict';

var express = require('express');
var app = express();
var router = require('./route/routes');
var http = require('http').Server(app);
require('./utils/socket')(http);

var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'server'});

var bodyParser = require('body-parser'); 

app.use('/public', express.static('public'));

app.get('/', (req, res)=> {
  res.sendFile(__dirname+"/public/build/index.html");
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', router);

http.listen(8080, ()=> {
  log.info({port: 8080},'Server up and running');
});
