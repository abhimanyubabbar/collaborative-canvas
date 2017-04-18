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
      width: 3
    };
  }

  handleCanvasProperties(data) {

    this.setState({
      color: data.color,
      width: data.width
    });
  }


  render() {

    return (
      <div className="container-fluid">
        <div className="row">

          <div className="col-md-1">
            <ProjectState />
          </div>


          <div className="col-md-9">
            <Canvas 
              color={this.state.color} 
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

