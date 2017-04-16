'use strict';

var express = require('express');
var router = express.Router();
var storage = require('../utils/storage');


router.get('/session/:name', (req, res) => {
  console.log(res);
});

router.post('/session/:name', (req, res) => {

  console.log(`Received a request to create user session: ${req.params.name}`);

  try {
    storage.createNameSpace(req.params.name);
    res.send({});
  } 
  catch(err) {
    console.log(err);
    res.status(500).send({err: "Unable to create session"});
  }

});

router.get('/session', (req, res) => {
  console.log(res);
});



module.exports = router;
