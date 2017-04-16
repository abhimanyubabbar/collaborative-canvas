/**
 * This module encapsulates a small json database which
 * is used to store and retrieve events relating to canvas on
 * which the users are making changes.
 *
 * The retrieval of the events makes it easy to replay those events on 
 * an actual canvas to which the user is connected and therefore helps in
 * restoring the state.
 *
 **/

'use strict';

var low = require('lowdb');

function initialize() {

  const db = low('db.json');

  return {

    createNameSpace: function() {

      if (db.has(namespace).value()) {
        return;
      }

      return db.set(namespace, [])
        .write();
    },

    addEvent: function(namespace, event) {

      console.log(`namespace: ${namespace}, event: ${event}`);

      db.get(namespace)
        .push(event)
        .write();
    },

    removeEventById: function(namespace, id) {

      db.get(namespace)
        .remove({id: id})
        .write();
    },

    getEvents: function(namespace) {

      return db.get(namespace)
        .value();
    },

    getEventById: function(namespace, id) {

      return db.get(namespace)
        .find({id: id})
        .value();
    }
  };

}


module.exports = initialize();
