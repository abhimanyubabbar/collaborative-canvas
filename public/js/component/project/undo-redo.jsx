import React from 'react';


/**
 **/
class UndoRedo extends React.Component {

  constructor(props) {

    super(props);

    this.maxLength = 100;
    this.undo = [];
    this.redo = [];

    this.lastSeenComponentID = null;
  }


  /**
   * Whenever a new object is added or
   * existing modified, the canvas sends this component
   * an updateEvent which is of the following format:
   *
   * {from: event, to: event}
   *
   * In case of addition of a new object, `from` is null and `to` is
   * set to the final object.
   *
   * In case of updation of an existing object, `from` is the previous state and
   * `to` is the new state.
   *
   * In any case, add this event to the `undo` list in case
   * future undo's are required.
   *
   * objectEvent = {type: 'modified/added', payload: event}
   **/
  componentWillReceiveProps(nextProps) {


    /**
     * Keep track of the project change in the system
     * Clean the whole undo redo list as we encounter a project change
     **/
    if (nextProps.project) {

      // If we encounter a switch in the project name
      // clear the undo and redo list
      if (!this.props.project || this.props.project.name != nextProps.project.name) {

        this.undo = [];
        this.redo = [];

      }
    }

    if (nextProps.objectEvent) {

      /**
       * As each new component added by the user is added
       * with a unique identifier, we filter multiple componentWillReceiveProps
       * call for a single change through the check with the lastSeenComponentID.
       **/
      if (!this.props.objectEvent || this.props.objectEvent.id != nextProps.objectEvent.id) {

        this.undo.push(nextProps.objectEvent);
        this.redo = [];
      }
    }

  }


  handleUndoTask() {

    console.log('Executed undo task');

    if (this.undo.length  == 0) {
      return;
    }

    // Add the undo task to the redo list.
    const lastEvent= this.undo.pop();

    console.log(`UNDO Item popped  ${JSON.stringify(lastEvent)}`);
    console.log(lastEvent.id);

    this.redo.push(lastEvent);
    this.props.onChangeComplete({type: 'undo', objectEvent: lastEvent});
  }


  handleRedoTask() {

    console.log('Executing redo task');
    if (this.redo.length == 0) {
      return;
    }

    const lastEvent = this.redo.pop();
    this.undo.push(lastEvent);
    this.props.onChangeComplete({type: 'redo', objectEvent: lastEvent});
  }

  render() {

    return (
      <div>
        <button 
          onClick={this.handleUndoTask.bind(this)} 
          className="btn btn-block">Undo</button>
        <button 
          onClick={this.handleRedoTask.bind(this)} 
          className="btn btn-block">Redo</button>
      </div>
    );
  }
};


export default UndoRedo;
