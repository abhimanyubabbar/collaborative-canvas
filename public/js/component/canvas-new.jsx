import React from 'react';
import 'fabric';
import api from '../utils/api';


class Canvas extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      color: props.color,
      width: props.width,
      project: {name: 'default', identifier: 'uuid'},
      canvas: null
    };

    this.socket = io();
    this.socket.room = null;
  }

  /**
   * loadCanvas requests for the canvas object
   * from the server for the project which the user
   * wants to view.
   *
   * Once the canvas has been loaded, we hook the socket handlers
   * and canvas handlers and reset the state.
   **/
  loadCanvas() {

    api.getCanvasJSON(this.state.project.name)
      .then((json)=> {

        var canvas = new fabric.Canvas('c', {
          isDrawingMode: true,
        });

        canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
        canvas.freeDrawingBrush.color = this.state.color;
        canvas.freeDrawingBrush.width = this.state.width;


        this.canvasEventHandlers(canvas);
        this.socketEventHandlers(canvas);

        this.socket.emit('join', {from: this.socket.room, to: this.state.project.identifier});
        this.socket.room = this.state.project.identifier;

        this.setState({
          canvas: canvas
        });
      })
      .catch((err)=> {
        //TODO: Build proper error handling here.
        // Maybe we can display a default unconnected canvas here.
        console.log(`Unable to load canvas: ${err}`);
      });
  }

  /**
   * socketEventHandlers wire up the socket 
   * events to the changes that needs to be done to 
   * the existing canvas.
   **/
  socketEventHandlers(canvas) {

    if (canvas == null ) {
      console.log(`Canvas not loaded, not wiring any event handlers`);
      return;
    }

    console.log(`Received a request to wire up the socket handlers`);

    /**
     * EVENT: `object:added` 
     * This event is emitted by the server socket when
     * a new object is added to the canvas. Upon receiving
     * the object we augment the local canvas with the object also.
     **/
    this.socket.on('path:created', (rawObjects) => {

      const canvas = this.state.canvas;

      fabric.util.enlivenObjects([rawObjects], (objects)=> {
        objects.forEach((o)=> {
          canvas.add(o);
        });
      });

      this.setState({canvas: canvas});
    });
  }


  /**
   * canvasEventHandlers add handlers to the 
   * events from the canvas. This is done to emit out
   * the operations done by the user to the canvas.
   *
   **/
  canvasEventHandlers(canvas) {

    if (canvas == null) {
      return;
    }

    console.log(`Received a request to wire up the canvas event handlers`);

    canvas.on('path:created', (e) => {
      this.socket.emit('path:created', e.path.toJSON());
    });
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

  componentDidMount() {
    this.loadCanvas();
  }

  render(){

    const basic = {
      border: '1px solid black',
    };

    return (
      <div>
        <canvas id="c" style={basic}> </canvas>
      </div>
    );
  }
}


module.exports = Canvas;
