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

function initialize() {

  const db = low('db.json');

  const PROJECT = 'project';

  if (!db.has(PROJECT).value()) {
    db.set(PROJECT, {}).write();
  }

  return {

    createProject: function(projectName, sessionIdentifier) {

      console.log(`DB: Received a call to create new project, name: ${projectName}, identifier: ${sessionIdentifier}`);

      const idx = PROJECT + "." + projectName;
      if (db.has(idx).value()) {
        return db.get(idx).value();
      }

      db.set(idx, {name: projectName, identifier: sessionIdentifier}).write();
      return db.get(idx).value();
    },

    createSession: function(identifier) {

      console.log(`DB: Received a call to create session: ${identifier}`);

      if (db.has(identifier).value()) {
        return;
      }

      db.set(identifier, []).write();
    },

    getProjects: function() {

      console.log(`DB: Received a call to fetch all the projects`);

      return db.get(PROJECT).value();
    },

    getProject: function(name) {

      console.log(`DB: Received a call to get project by name: ${name}`);

      const idx = PROJECT + "." + name;
      return db.get(idx).value();
    },


    addEvent: function(identifier, event) {

      if (!db.has(identifier).value()) {
        console.log(`DB: No data location for the identfier: ${identifier}, dropping.`);
        return;
      }

      console.log(`DB: Received a call to add an event, identifier: ${identifier}, event: ${event}`);
      db.get(identifier)
        .push(event)
        .write();
    },

    removeEventById: function(identifier, id) {

      db.get(identifier)
        .remove({id: id})
        .write();
    },

    getEvents: function(identifier) {

      console.log(`DB: Received a call to fetch events by identifier: ${identifier}`);
      return db.get(identifier)
        .value();
    },

    getEventById: function(identifier, id) {

      return db.get(namespace)
        .find({id: id})
        .value();
    }
  };

}


module.exports = initialize();
