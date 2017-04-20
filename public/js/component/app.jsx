'use strict';

import React from 'react';
import Canvas from './canvas.jsx';
import CanvasProperties from './canvas-properties.jsx';
import ProjectState from './project.jsx';

class App extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      color: "#000000",
      width: 3,
      drawingMode: true,
      currentProject: {name: 'default', identifier: 'uuid'},
    };
  }

  handleCanvasProperties(data) {

    this.setState({
      color: data.color,
      width: data.width,
      drawingMode: data.drawingMode,
    });
  }

  handleProjectChangeSuccess(project) {

    console.log(`APP: ${JSON.stringify(project)}`);

    this.setState({
      currentProject: {
        name:project.name,
        identifier: project.identifier
      }
    });

  }

  handleProjectChangeFailure(error) {
    console.log(`Failed: ${error}`);
  }


  render() {

    return (
      <div className="container-fluid">
        <div className="row">

          <div className="col-md-1">

            <ProjectState 
              onProjectChangeSuccess={this.handleProjectChangeSuccess.bind(this)}
              onProjectChangeFailure={this.handleProjectChangeFailure.bind(this)}/>

          </div>


          <div className="col-md-9">
            <Canvas 
              project={this.state.currentProject}
              color={this.state.color}
              drawingMode={this.state.drawingMode}
              width={this.state.width}/>
          </div>

          <div className="col-md-2">
            <CanvasProperties 
              color={this.state.color} 
              width={this.state.width}
              onChangeComplete={this.handleCanvasProperties.bind(this)}/>
          </div>

        </div>
      </div>
    );
  }

}

export default App;

