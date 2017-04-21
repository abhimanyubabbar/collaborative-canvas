import React from 'react';
import CreateProject from './createProject.jsx';
import LoadProject from './loadProject.jsx';
import UndoRedo from './undo-redo.jsx';



class ProjectState extends React.Component {

  render() {

    return (
      <div>

        <div className="spacer-top-md">
          <CreateProject
            onProjectChangeSuccess={this.props.onProjectChangeSuccess}
            onProjectChangeFailure={this.props.onProjectChangeFailure}/>
        </div>

        <div className="spacer-top-sm">
          <LoadProject
            onChangeComplete={this.props.onProjectChangeSuccess}/>
        </div>

        <hr/>

        <div className="spacer-top-lg">
          <UndoRedo
            project={this.props.project}
            objectEvent={this.props.objectEvent}
            onChangeComplete={this.props.handleUndoRedoObjectEvent}/>
        </div>

      </div>
    );
  }
};

export default ProjectState;
