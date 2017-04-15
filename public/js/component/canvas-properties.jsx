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

    this.state = {
      color: props.color,
      width: props.width   
    };
  }

  handleColorChange(color) {

    console.log(`Color Selected: ${color.hex}`);
    this.setState({
      color: color.hex
    });

    this.props.onChangeComplete(this.state);
  }

  handleNumberChange(number) {

    console.log(`Number Selected: ${number}`);
    this.setState({
      width: parseInt(number)
    });

    this.props.onChangeComplete(this.state);

  }

  render() {

    return (
      <div>
        <CompactPicker color={this.state.color} onChangeComplete={this.handleColorChange.bind(this)}/>
        <NumberPicker thickness={this.state.width} onChangeComplete={this.handleNumberChange.bind(this)}/>
      </div>
    );

  }

}

export default Properties;
