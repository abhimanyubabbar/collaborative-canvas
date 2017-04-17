import React from 'react';
import 'fabric';

const api = require('../utils/api');

class CanvasComponent extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      color: this.props.color,
      width: this.props.width,
      project: null,
      identifier: null,
      canvas: null};

    // Connect to the socket
    // and join a default room.
    this.socket = io();
    console.log('Emitting a join event over the socket to join default room');
    this.socket.emit('join', {from: null, to: "default"});
  }

  componentWillReceiveProps(nextProps) {

    var canvas = this.state.canvas;
    canvas.freeDrawingBrush.width = nextProps.width;
    canvas.freeDrawingBrush.color = nextProps.color;

    this.setState({
      color: nextProps.color,
      width: nextProps.width,
      canvas: canvas
    });
  }

  setupCanvas() {

    var c = new fabric.Canvas('c', {
      isDrawingMode: true,
    });

    c.freeDrawingBrush.color = this.state.color;
    c.freeDrawingBrush.width = this.state.width;

    c.on('path:created',(e) => {
      this.handlePathCreated(e.path);
    });

    this.setState({
      canvas: c,
      project: project.name,
      identifier: project.identifier
    });

    this.socketHandler();
  }

  componentDidMount() {

    api.createProject('default')

      .then(function(project) {
        this.setupCanvas(project);
      }.bind(this))

      .catch(function(err) {
        console.log(err);
      });

  }

  // socketHandler handles the data being
  // received by the component over the socket from
  // the server.
  socketHandler() {

    this.socket.on('load:canvas', function() {
    }.bind(this));

    this.socket.on('path:created', function(path) {

      console.log(path);

      // Fetch the canvas object from the
      // state of the component.
      var canvas = this.state.canvas;

      console.log(canvas);

      // Make the changes in the existing canvas 
      // object with the information carried in the update.
      fabric.util.enlivenObjects([path], (objects)=> {
        objects.forEach((o)=> {
          canvas.add(o);
        });
      });

      // Update the state with the new canvas object.
      this.setState({canvas: canvas});

    }.bind(this));

  };

  handlePathCreated(path) {
    this.socket.emit('path:created', path.toJSON());
  }

  render()  {

    const basic = {
      border: '1px solid black',
    };

    return (
      <div>
        <canvas id="c" style={basic}> </canvas>
      </div>);
  }
}

export default CanvasComponent;
