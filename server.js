/**
 *
 **/

'use strict';

var express = require('express');
var app = express();
var router = require('./route/routes');
var http = require('http').Server(app);
require('./utils/socket')(http);

app.use('/static', express.static('public'));

app.get('/', (req, res)=> {
  res.sendFile(__dirname+"/public/index.html");
});

app.use('/', router);

http.listen(3000, ()=> {
  console.log('Listening on port: 3000');
});
