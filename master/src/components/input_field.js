// Generates user input field templates for 
// utility information and carbon coefficients

import React, { Component } from "react";

class InputField extends Component {
    
  render() {
    return (
        <div className="input-container">
            <div className="left-container">
                <div className="head-text-4">{this.props.leftText}</div>
                <input name={this.props.leftVar} type="number" value={this.props.leftValue} onChange={this.props.onChange}></input>
            </div>
            <div className="right-container">
                <div className="head-text-4">{this.props.rightText}</div>
                <input name={this.props.rightVar} type="number" value={this.props.rightValue} onChange={this.props.onChange}></input>
            </div>
        </div>
    );
  }
}

export default InputField;