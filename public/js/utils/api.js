'use strict';

var request = require('request-promise-native');

function getEnv(envVar, fallback) {

  const data = process.env.envVar;
  if (data == null) {
    return fallback;
  }

  return data;
}

function initialize() {

  const CANVAS_URL = getEnv("CANVAS_URL", "http://localhost:3000");

  /**
   * The library used is promise based and therefore
   * we return a promise which will be handled at the calling end.
   **/
  return {

    createProject: function(projectName) {

      console.log(`CLIENT API: Received a request to create project: ${projectName}`);

      const options = {
        method: 'POST',
        uri: `${CANVAS_URL}/projects`,
        body: {
          name: projectName
        },
        json: true
      };

      return request(options);
    },

    getProjects: function() {
      console.log(`CLIENT API: Received a request to fetch the projects`);
      return request(`${CANVAS_URL}/projects`);
    },

    getCanvasJSON: function(projectName) {
      console.log(`CLIENT API: Received a request to fetch canvas as json`);
      return request(`${CANVAS_URL}/projects/canvas/${projectName}`);
    }
  };
}


export default initialize();
