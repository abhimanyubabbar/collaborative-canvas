import React from 'react';
import 'fabric';
import api from '../../utils/api';
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

    console.log(`Received a request to loadCanvas, name: ${projectName}, ${sessionIdentifier}`);

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

    console.log(`Received a request to wire up the socket handlers`);

    if (canvas == null ) {
      console.log(`Canvas not loaded, not wiring any event handlers`);
      return;
    }

    /**
     * EVENT: `object:removed` is fired by the server sockets
     * when the client is connected to a room in which the other collaborator
     * wants to undo an event which is currently only `object:added`
     **/
    this.socket.on('object:removed', (identifier)=> {

      console.log(`RECEIVED event for object removal finalllyy`);

      var objects = canvas.getObjects();

      for(var i=0; i < objects.length; i++) {

        if(objects[i].id == identifier) {
          canvas.remove(objects[i]);
          break;
        }
      }

      this.setState({canvas: canvas});
    });

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


    /**
     * EVENT: `object:modified` is fired by the server socket 
     * when an earlier object created is modified in terms of shape, position
     * size etc. At this moment, only images are allowed to be modified and therefore
     * this event is fired for the changes in the image.
     **/
    this.socket.on('object:modified', (modObj) => {

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

    /**
     *
     **/
    canvas.on('object:added', (e) => {

      if (e.target.id != null) {
        return;
      }

      e.target.id = uuid4();

      /**
       * Path objects created by the user are not modifiable,
       * only the images uploaded are the ones which could
       * be updated/modified by the user.
       **/
      if (e.target.type == 'path') {

        e.target.hasControls = false;
        e.target.lockMovementX = true;
        e.target.lockMovementY = true;
      }
      
      /**
       * Inform the server socket about the changes that are made
       * by the client by firing  `object:added` events to the server.
       *
       * In addition to this, execute the `handleCanvasObjectEvent` handler
       * which captures the object added to the canvas and update the
       * history of the events. The history in turn is used when the user
       * wants to perform the undo-redo task.
       *
       * WARNING: Here we are storing the canvas as the object and not a json format.
       * This means that we have to inflate the object when running the redo event.
       **/
      this.props.handleCanvasObjectEvent(e.target);
      this.socket.emit('object:added', e.target.toJSON(['id']));
    });

    canvas.on('object:modified', (e)=> {

      if (e.target.id == null) {
        console.log(`Received a modiied event for the object which is missing unique identifier, dropping`);
        return;
      }

      this.socket.emit('object:modified', e.target.toJSON(['id']));
    });
  }

  /**
   * The canvas object interacts with a lot of
   * external components through props. Therefore whenever the data from
   * the external components will change, this function will be fired. Therefore, we
   * have to check which prop got updated and act accordingly.
   **/
  componentWillReceiveProps(nextProps) {

    /**
     * CHECK 1: In case the user decides to update the project, the canvas component
     * needs to wipe the state and load the new state by the project which the user needs to load.
     **/
    if (!this.props.project || (this.props.project.name != nextProps.project.name)) {

      this.loadCanvas(
        nextProps.project.name, 
        nextProps.project.identifier);

      return;
    }

    /**
     * CHECK 2: Below conditional execution is done to provide handling for
     * undo and redo events fired by the user.
     *
     * Each event contains the type of the event and object associated with the
     * event. Therefore, we have the below format of the event that will be sent to this 
     * component {type: redo/undo,  objectEvent: event}
     **/
    if ((nextProps.undoRedoEvent) && (!this.props.undoRedoEvent ||
      this.props.undoRedoEvent.type != nextProps.undoRedoEvent.type ||
      this.props.undoRedoEvent.objectEvent.id != nextProps.undoRedoEvent.objectEvent.id)) {

      const undoRedoEvent = nextProps.undoRedoEvent;
      const canvas = this.state.canvas;

      /**
       * If the type is undo, remove the object 
       * added earlier to the canvas to be now removed
       * from the canvas.
       **/
      if (undoRedoEvent.type == 'undo') {

        const objects = canvas.getObjects();
        var matchedObj = null;
        for(var i = 0; i < objects.length ; i++) {

          if (objects[i].id == undoRedoEvent.objectEvent.id) {
            matchedObj = objects[i];
            break;
          }
        }

        if (matchedObj) {

          canvas.remove(matchedObj);
          // Inform the socket layer that the object has been removed.
          this.socket.emit('object:removed', undoRedoEvent.objectEvent.id);
        }

      }

      /**
       * If the type of event is redo, ask the canvas
       * to redraw the whole event received from the history over and
       * onto the canvas.
       **/
      if (undoRedoEvent.type == 'redo') {

        // Inflate the object again as when we added to the history
        // in which in a different format.
        const event = undoRedoEvent.objectEvent.toJSON(['id']);

        fabric.util.enlivenObjects([event], (objects)=> {
          objects.forEach((o)=> {
            canvas.add(o);
          });
        });

        //Inform the server sockets that new object has been drawn onto the canvas.
        this.socket.emit('object:added', undoRedoEvent.objectEvent.toJSON(['id']));
      }


      this.setState({
        canvas: canvas
      });

    }

    /**
     * CHECK 3: In case of canvas properties like the color of the brush and the
     * width of the strokes to be used needs to be updated, we need to
     * update the properties of the current canvas and reload the state.
     **/
    if (this.props.width != nextProps.width || 
      this.props.color != nextProps.color || 
      this.props.isDrawingMode != nextProps.isDrawingMode) {

      var canvas = this.state.canvas;
      canvas.freeDrawingBrush.width = nextProps.width;
      canvas.freeDrawingBrush.color = nextProps.color;
      canvas.isDrawingMode = nextProps.drawingMode;

      this.setState({
        canvas: canvas
      });
    }
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

        this.setState({canvas: canvas});
      });
    };

    reader.readAsDataURL(file);
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
