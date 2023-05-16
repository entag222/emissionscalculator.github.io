// Generates the user input fields for the building type and floor area

import React, { Component } from "react";

class BuildingInputField extends Component {
    
  render() {
    return (
        <div className="input-container">
            <div className="left-container">
              <div className="head-text-4">Building Type</div>
                <select className="bldg-type-select" name='building' value={this.props.building} onChange={this.props.onTextChange}>
                  <option value="A">A (Assembly)</option>
                  <option value="B_norm">B (Business)</option>
                  <option value="B_health">B (Healthcare)</option>
                  <option value="E">E (Educational)</option>
                  <option value="F">F (Factory/Industrial)</option>
                  <option value="H">H (High Hazard)</option>
                  <option value="I1">I-1 (Institutional)</option>
                  <option value="I2">I-2 (Institutional)</option>
                  <option value="I3">I-3 (Institutional)</option>
                  <option value="I4">I-4 (Institutional)</option>
                  <option value="M">M (Mercantile)</option>
                  <option value="R1">R-1 (Residential)</option>
                  <option value="R2">R-2 (Residential)</option>
                  <option value="U">U (Utility/Misc)</option>
                </select>

            </div>
            <div className="right-container bldg">
                <div className="head-text-4">Area (SF)</div>
                <input name={this.props.name} type="number" value={this.props.value} onChange={this.props.onChange}></input>
            </div>
        </div>
        
    );
  }
}

export default BuildingInputField;