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

    <select value={this.state.thickness} onChange={this.handleChange.bind(this)}>
      <option value="1">1</option>
      <option value="3">3</option>
      <option value="5">5</option>
      <option value="7">7</option>
      <option value="9">9</option>
      <option value="11">11</option>
    </select>
    );
  };
}


class Properties extends React.Component {

  constructor(props) {

    super(props);
    this.color = props.color;
    this.width = props.width;
  }

  handleColorChange(color) {

    this.color = color.hex;
    this.props.onChangeComplete({
      color: this.color,
      width: this.width
    });
  }

  handleNumberChange(number) {

    this.width = parseInt(number);
    this.props.onChangeComplete({
      color: this.color,
      width: this.width
    });

  }

  render() {

    return (
      <div>
        <CompactPicker color={this.color} onChangeComplete={this.handleColorChange.bind(this)}/>
        <NumberPicker thickness={this.width} onChangeComplete={this.handleNumberChange.bind(this)}/>
      </div>
    );

  }

}

export default Properties;
