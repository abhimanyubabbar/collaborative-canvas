import React from 'react';
import 'fabric';
import api from '../utils/api';
import uuid4 from 'uuid/v4';


class Canvas extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
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
  loadCanvas(projectName, sessionIdentifier) {

    console.log(`CANVAS: Received a request to loadCanvas, name: ${projectName}, ${sessionIdentifier}`);

    api.getCanvasJSON(projectName)
      .then((json)=> {

        var canvas = this.state.canvas;

        if (canvas == null) {
          canvas = new fabric.Canvas('c', {
            width: 1240,
            height: 740
          });
        } else {
          canvas.clear();
        }

        console.log(JSON.stringify(json));
        canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
        canvas.freeDrawingBrush.color = this.props.color;
        canvas.freeDrawingBrush.width = this.props.width;
        canvas.isDrawingMode = this.props.drawingMode;

        this.canvasEventHandlers(canvas);
        this.socketEventHandlers(canvas);

        this.socket.emit('join', {from: this.socket.room, to: sessionIdentifier});
        this.socket.room = sessionIdentifier;

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
    this.socket.on('object:added', (rawObjects) => {

      fabric.util.enlivenObjects([rawObjects], (objects)=> {
        objects.forEach((o)=> {
          canvas.add(o);
        });
      });

      this.setState({canvas: canvas});
    });


    this.socket.on('object:modified', (modObj) => {

      console.log(`CLIENT SOCKET: Received object:modified event from server`);

      var objs = canvas.getObjects();
      var matchObj = null;

      for(var i=0; i < objs.length; i++) {
        if (objs[i].id == modObj.id) {
          matchObj = objs[i];
          break;
        }
      }

      if (matchObj == null) {
        return;
      }

      console.log(`Successfully removed the object`);
      canvas.remove(matchObj);

      fabric.util.enlivenObjects([modObj], (objects)=> {
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

    // See what get fires back to the image.
    canvas.on('object:added', (e) => {

      if (e.target.id != null) {
        return;
      }

      e.target.id = uuid4();
      this.socket.emit('object:added', e.target.toJSON(['id']));
    });

    canvas.on('object:modified', (e)=> {

      console.log(`CANVAS: Fired an object modified event`);

      if (e.target.id == null) {
        console.log(`===== WARNING: target identifier should be set =====`);
        return;
      }

      this.socket.emit('object:modified', e.target.toJSON(['id']));
    });
  }

  componentWillReceiveProps(nextProps) {

    // In case we have only seen a change in the project
    // identifier, we will reload the whole canvas from the api.
    if (!this.props.project || (this.props.project.name != nextProps.project.name)) {

      this.loadCanvas(
        nextProps.project.name, 
        nextProps.project.identifier);

      return;
    }

    var canvas = this.state.canvas;
    canvas.freeDrawingBrush.width = nextProps.width;
    canvas.freeDrawingBrush.color = nextProps.color;
    canvas.isDrawingMode = nextProps.drawingMode;

    this.setState({
      canvas: canvas
    });
  }

  /**
   * Attach events with the file selector.
   * Handle event to add the image object to the canvas.
   **/
  handleFileChosen(e) {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (f) => {

      var data = f.target.result;
      fabric.Image.fromURL(data, (img) => {

        const canvas = this.state.canvas;

        var oImg = img.set({left: 10, 
          top: 10, angle: 0}).scale(0.8);
        canvas.add(oImg).renderAll();

        //Render the new canvas after the image upload
        this.setState({canvas: canvas});
      });
    };

    reader.readAsDataURL(file);
  }

  componentDidMount() {
    console.log(`EXECUTING COMPONENT DID MOUNT`);
  }

  renderCanvas() {

      const canvasStyle = {
        border: '1px solid grey',
        'borderRadius': '2px'
      };

      return (

        <div>

          <div>
            <canvas id="c" style={canvasStyle}> </canvas>
          </div>

          <hr/>

          <div className="spacer-top-md spacer-bottom-md" style={{'textAlign': 'center'}}>
            <label className="btn btn-default btn-file">
              Image Upload<input type="file" style={{display: 'none'}} 
                onChange={this.handleFileChosen.bind(this)}/>
            </label>
          </div>

        </div>
      );
  }

  renderLoader() {

    return (
      <div>
        <h1 style={{'textAlign': 
          'center', 
          'fontSize': '7em', 
          'color': 'lightgrey'}}>NO CANVAS SELECTED</h1>
      </div>
    );
  }

  render(){

    const project= this.props.project;
    return project ? this.renderCanvas() : this.renderLoader();

  }
}


module.exports = Canvas;
