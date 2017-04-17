'use strict';

import React from 'react';
import Canvas from './canvas-new.jsx';
import CanvasProperties from './canvas-properties.jsx';

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
      <div>

        <CanvasProperties color={this.state.color} width={this.state.width} onChangeComplete={this.handleCanvasProperties.bind(this)}/>
        <Canvas color={this.state.color} width={this.state.width}/>

      </div>
    );
  }

}

export default App;

