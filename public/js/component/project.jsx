import React from 'react';

/**
 **/
class ProjectState extends React.Component {


  render() {

    var btnclassName = 'btn' + ' ' + 'btn-block';

    return (
      <div>
        <button type="button" className={btnclassName}>Create New</button>
        <button type="button" className={btnclassName}>Load</button>
      </div>
    );
  }
};

export default ProjectState;
