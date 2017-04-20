import React from 'react';
import {CompactPicker} from 'react-color';

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


class Properties extends React.Component {

  constructor(props) {

    super(props);
    this.color = props.color;
    this.width = props.width;
    this.drawingMode = props.drawingMode;
  }

  handleColorChange(color) {

    console.log(`COLORCHANGE called`);

    this.color = color.hex;
    this.props.onChangeComplete({
      color: this.color,
      width: this.width,
      drawingMode: this.drawingMode,
    });
  }

  handleNumberChange(number) {

    console.log(`NUMBERCHANGE called`);

    this.width = parseInt(number);
    this.props.onChangeComplete({
      color: this.color,
      width: this.width,
      drawingMode: this.drawingMode,
    });

  }

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
