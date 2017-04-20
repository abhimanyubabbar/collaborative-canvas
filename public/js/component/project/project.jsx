import React from 'react';
import CreateProject from './createProject.jsx';
import LoadProject from './loadProject.jsx';



class ProjectState extends React.Component {


  render() {

    return (
      <div>

        <div className="spacer-top-md">
          <CreateProject
            onProjectChangeSuccess={this.props.onProjectChangeSuccess}
            onProjectChangeFailure={this.props.onProjectChangeFailure}/>
        </div>

        <div className="spacer-top-md">
          <LoadProject
            onChangeComplete={this.props.onProjectChangeSuccess}/>
        </div>

      </div>
    );
  }
};

export default ProjectState;
