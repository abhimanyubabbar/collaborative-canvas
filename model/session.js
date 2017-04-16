'use strict';

const uuid4 = require('uuid/v4');

class Project {

  constructor(name) {

    this.name = name;
    this.identifier = uuid4();
  }
}


module.exports = Project;
