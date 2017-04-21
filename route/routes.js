'use strict';

var express = require('express');
var router = express.Router();
var storage = require('../utils/storage');
var Project = require('../model/session');
var fabric = require('fabric').fabric;

var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'router'});


router.get('/projects/:name', (req, res) => {

  log.info({'project-name': req.params.name}, `Received a request to fetch project information`);

  const project = storage.getProject(req.params.name);
  if (project == null) {
    res.status(404).send({error: "Project Not Found", name: req.params.name});
    return;
  }
  res.send({project: project});
});

router.get('/projects/canvas/:name', (req, res) => {

  log.info({'project-name': req.params.name}, `Received a request to fetch canvas information`);

  const project = storage.getProject(req.params.name);
  if (project == null) {
    res.send({});
  }

  const events = storage.getEvents(project.identifier);
  const canvas = new fabric.createCanvasForNode();

  fabric.util.enlivenObjects(events, (objects)=> {
    objects.forEach((o)=> {
      canvas.add(o);
    });
  });

  // id is an additional property and therefore included.
  res.send(canvas.toJSON(['id']));
});

router.post('/projects', (req, res) => {

  const name = req.body.name;
  log.info({'project-name': name}, `ROUTER: Received a request to create user project`);

  try {
    var project = new Project(name);
    project = storage.createProject(project.name, project.identifier);
    storage.createSession(project.identifier);
    res.send({project: project});
  } 
  catch(err) {
    log.error({err: err, 'project-name': name}, `Unable to create project`);
    res.status(500).send({err: "Unable to create session", name: name});
  }

});

router.get('/projects', (req, res) => {
  
 log.info(`Received a request to fetch all the available projects`);

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
