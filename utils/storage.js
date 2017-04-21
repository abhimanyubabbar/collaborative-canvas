/**
 * This module encapsulates a small json database which
 * is used to store and retrieve events relating to canvas on
 * which the users are making changes.
 *
 * The retrieval of the events makes it easy to replay those events on 
 * an actual canvas to which the user is connected and therefore helps in
 * restoring the state.
 *
 * DBModel:
 *
 * project= {projectName: {name: projectName, identifier: sessionIdentifier}}
 * identifier= [events]
 *
 * Each canvas project which the clients work on has a specific session.
 * This is the identifier under which the user sends events to each other.
 *
 *
 **/

'use strict';

var low = require('lowdb');
var bunyan = require('bunyan');

var log = bunyan.createLogger({name: 'storage'});

function initialize() {

  const db = low('db.json');
  const PROJECT = 'project';

  if (!db.has(PROJECT).value()) {
    log.info({'db-name': 'db.json'}, 'Initializing the database');
    db.set(PROJECT, {}).write();
  }

  return {

    createProject: function(projectName, sessionIdentifier) {

      log.info({ 'project-name': projectName, 'session-identifier': sessionIdentifier}, 
        `Received a call to create new project`);

      const idx = PROJECT + "." + projectName;
      if (db.has(idx).value()) {
        return db.get(idx).value();
      }

      db.set(idx, {name: projectName, identifier: sessionIdentifier}).write();
      return db.get(idx).value();
    },

    createSession: function(identifier) {

      log.info({'session-identifier': identifier}, `Received a call to create session identifier`);

      if (db.has(identifier).value()) {
        return;
      }

      db.set(identifier, []).write();
    },

    getProjects: function() {

      log.info(`Received a call to fetch all the projects`);

      return db.get(PROJECT).value();
    },

    getProject: function(name) {

      log.info({'project-name': name}, `Received a call to fetch project`);

      const idx = PROJECT + "." + name;
      return db.get(idx).value();
    },


    addEvent: function(identifier, event) {

      if (!db.has(identifier).value()) {

        log.warning({'session-identifier': identifier, 'event-type': event.type, 'event-id': event.id},
          `No data location for the identfier dropping event`);

        return;
      }

      log.info({'session-identifier': identifier, 'event-type': event.type, 'event-id': event.id},
        `Received a call to add an event`);

      db.get(identifier)
        .push(event)
        .write();
    },

    updateEvent: function(identifier, event) {

      log.info({'session-identifier': identifier, 'event-type': event.type, 'event-id': event.id},
        `Received a call to update the event`);

      if (!db.has(identifier).value()) {
        log.warning({'session-identifier': identifier, 'event-type': event.type, 'event-id': event.id},
          `Unable to locate the identifier, dropping the update`);
        return;
      }

      db.get(identifier)
        .find({id: event.id})
        .assign(event)
        .write();
    },

    removeEventById: function(namespace,  identifier) {

      log.info({'session-identifier': namespace, id: identifier},  `Received call to remove the identifier`);

      db.get(namespace)
        .remove({id: identifier})
        .write();
    },

    getEvents: function(namespace) {

      log.info({'session-identifier': namespace}, `Received a call to fetch all the events`);
      return db.get(namespace)
        .value();
    },

  };

}


module.exports = initialize();
