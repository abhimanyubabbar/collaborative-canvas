'use strict';

var express = require('express');
var router = express.Router();
var storage = require('../utils/storage');
var Project = require('../model/session');


router.get('/projects/:name', (req, res) => {

  console.log(`ROUTER: Received a request to fetch project by name: ${req.params.name}`);

  const project = storage.getProject(req.params.name);
  if (project == null) {
    res.status(404).send({error: "Project Not Found", name: req.params.name});
    return;
  }
  res.send({project: project});
});

router.post('/projects', (req, res) => {

  const name = req.body.name;
  console.log(`ROUTER: Received a request to create user session: ${name}`);

  try {
    var project = new Project(name);
    project = storage.createProject(project.name, project.identifier);
    storage.createSession(project.identifier);
    res.send({project: project});
  } 
  catch(err) {
    console.log(`Unable to create session: ${err}, for project: ${name}`);
    res.status(500).send({err: "Unable to create session", name: name});
  }

});

router.get('/projects', (req, res) => {
  
  console.log(`ROUTER: Received a request to fetch all the available projects`);

  const projects = storage.getProjects();

  const response = [];
  for (var key in projects) {
    response.push(projects[key]);
  }

  res.send({projects: response});
});

router.get('/ping', (req, res) => {
  res.send({service: "canvas-collaborator", response: "pong"});
});



module.exports = router;
