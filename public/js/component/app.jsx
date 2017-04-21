'use strict';

import React from 'react';
import Canvas from './canvas/canvas.jsx';
import CanvasProperties from './properties/canvas-properties.jsx';
import ProjectState from './project/project.jsx';

class App extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      color: "#000000",
      width: 3,
      drawingMode: true,
      currentProject: null,
      objectEvent: null,
      undoRedoEvent: null
    };
  }

  handleUndoRedoObjectEvent(event) {
    console.log(`Received UndoRedo Event to be applied to the canvas, 
      type: ${event.type}, event: ${JSON.stringify(event.objectEvent)}`);
    this.setState({
      undoRedoEvent: event
    });
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

  handleCanvasObjectEvent(objectEvent) {

    console.log(`Received object event from the canvas layer`);
    console.log(objectEvent.id);

    this.setState({
      objectEvent: objectEvent
    });
  }


  render() {

    return (
      <div className="container-fluid">
        <div className="row">

          <div className="col-md-1">

            <ProjectState 
              project={this.state.currentProject}
              objectEvent={this.state.objectEvent}
              handleUndoRedoObjectEvent={this.handleUndoRedoObjectEvent.bind(this)}
              onProjectChangeSuccess={this.handleProjectChangeSuccess.bind(this)}
              onProjectChangeFailure={this.handleProjectChangeFailure.bind(this)}/>
          </div>


          <div className="col-md-9">
            <Canvas 
              project={this.state.currentProject}
              color={this.state.color}
              drawingMode={this.state.drawingMode}
              undoRedoEvent={this.state.undoRedoEvent}
              handleCanvasObjectEvent={this.handleCanvasObjectEvent.bind(this)}
              width={this.state.width}/>
          </div>

          <div className="col-md-2">
            <CanvasProperties 
              color={this.state.color} 
              width={this.state.width}
              drawingMode={this.state.drawingMode}
              onChangeComplete={this.handleCanvasProperties.bind(this)}/>
          </div>

        </div>
      </div>
    );
  }

}

export default App;

