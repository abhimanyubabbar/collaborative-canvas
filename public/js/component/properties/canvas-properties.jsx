import React from 'react';
import {CompactPicker} from 'react-color';


/**
 * NumberPicker component is basically a select drop down
 * box which provides the user choices regarding the width
 * of the brush.
 **/
class NumberPicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {thickness: props.thickness};
  }

  handleChange(e) {
    this.setState({thickness: e.target.value});
    this.props.onChangeComplete(e.target.value);
  }

  render() {

    return (

      <div className="form-group">

        <label htmlFor="sel"> Brush Width</label>
        <select id="sel" className="form-control" value={this.state.thickness} 
          onChange={this.handleChange.bind(this)}>
          <option value="1">1</option>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="7">7</option>
          <option value="9">9</option>
          <option value="11">11</option>
        </select>
      </div>

    );
  };
}


/**
 * Properties Component represents encapsulation of the
 * combination of the components used to set the properties of the
 * main canvas.
 **/
class Properties extends React.Component {

  constructor(props) {

    super(props);
    this.color = props.color;
    this.width = props.width;
    this.drawingMode = props.drawingMode;
  }

  /**
   * Handle the change in the color of the brush
   * stroke used currently on the canvas.
   **/
  handleColorChange(color) {

    this.color = color.hex;
    this.props.onChangeComplete({
      color: this.color,
      width: this.width,
      drawingMode: this.drawingMode,
    });
  }

  /**
   * Handle the change in number representing the
   * brush stroke width of pencil on the canvas.
   **/
  handleNumberChange(number) {

    this.width = parseInt(number);

    this.props.onChangeComplete({
      color: this.color,
      width: this.width,
      drawingMode: this.drawingMode,
    });

  }

  /**
   * Handle the user request to toggle the drawing mode.
   * Toggling the drawing mode allows the user to switch the
   * canvas to the state in which the objects can be selected and 
   * resized in the system.
   **/
  handleDrawingModeToggle() {

    console.log(`CHECKBOX reset called`);

    this.drawingMode = !this.drawingMode;

    this.props.onChangeComplete({
      color: this.color,
      width: this.width,
      drawingMode: this.drawingMode,
    });
  }

  render() {

    return (

      <div>

        <div>
          <p><b>Brush Color</b></p>
          <CompactPicker 
            color={this.color} 
            onChangeComplete={this.handleColorChange.bind(this)}/>
        </div>

        <hr/>

        <div className="spacer-top-md">
          <NumberPicker 
            thickness={this.width} 
            onChangeComplete={this.handleNumberChange.bind(this)}/>
        </div>

        <hr/>

        <div className="spacer-top-md checkbox">
          <label>
            <input type="checkbox" 
              checked={this.drawingMode} 
              onChange={this.handleDrawingModeToggle.bind(this)}/><b>Drawing Mode</b>
          </label>
        </div>

      </div>

    );

  }

}

export default Properties;
