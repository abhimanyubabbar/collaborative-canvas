'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);

// Initialize the handling of data over sockets.
require('./utils/socket')(http);

// Expose the public folder
app.use('/static', express.static('public'));

app.get('/', (req, res)=> {
  console.log(__dirname);
  res.sendFile(__dirname+"/public/index.html");
});

http.listen(3000, ()=> {
  console.log('Listening on port: 3000');
});
