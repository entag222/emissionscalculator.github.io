// Generates and displays the entire user interface 
// using the React components from the other Javascript files
// and contains the default user input values in the initial state

import React, { Component } from 'react';
import BuildingInputField from './building_field';
import InputField from './input_field';
import ECMField from './ecm_field';
import LimitsField from './limits';
import ChartContent from './charts';
import {defaults_2020, carbon_limits} from '../defaults'

class UI extends Component {
  constructor(props) {
    super(props);

    // Set initial state
    this.state = {
        // building inputs
        building: 'B_norm',
        area: 180000, // square feet

        // utility inputs
        electricityUse: 3357600, // kWh (blended rate accounts for both energy and demand)
        gasUse: 224449, // therms
        electricityRate: 0.19, // $/kWh
        gasRate: 0.9, // $/therm

        // LL97 inputs
        // carbon coefficients
        electricityCoeff: 0.000288962, // tons CO2e/kWh
        gasCoeff: 0.00005311, // tons CO2e/kBtu
        
        // carbon limits (kg CO2e/sf/year)
        limits: {
          limit24: 8.46,
          limit30: 4.53,
          limit35: 1.4,
        },
        penalty: 268, // $/tCO2e

        ecms: [{
          name: '',
          electricity: 0,
          gas: 0
        }],

        totalFlag: true,
        btnTotal: 'btn-clicked',
        btnNet: 'btn-unclicked'
    };

    // Binding this keyword
      this.onChange = this.onChange.bind(this);
      this.onTextChange = this.onTextChange.bind(this);
      this.onLimitsChange = this.onLimitsChange.bind(this);
      this.onECMChange = this.onECMChange.bind(this);
      this.setDefaults = this.setDefaults.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.setTotal = this.setTotal.bind(this);
      this.setNet = this.setNet.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: Number(e.target.value) });
  }

  onLimitsChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({ limits: carbon_limits[e.target.value] });
  }
  onECMChange(ecms) {
    this.setState({ ecms: ecms });
  }

  onTextChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  setDefaults() {
    this.setState(defaults_2020);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  setTotal() {
    this.setState({ totalFlag: true });
    this.setState({ btnTotal: 'btn-clicked' });
    this.setState({ btnNet: 'btn-unclicked' });
  }
  
  setNet() {
    this.setState({ totalFlag: false });
    this.setState({ btnTotal: 'btn-unclicked' });
    this.setState({ btnNet: 'btn-clicked' });
  }

  render() {
    return (
      <div>
        <div className="sidebar">
          <div className="sidebar-main-container">
            <form onSubmit={this.onSubmit}>
              <div className="head-text-2">Building Inputs</div>
              <BuildingInputField building={this.state.building} name="area" value={this.state.area} onTextChange={this.onLimitsChange} onChange={this.onChange} />
              
              <div className="head-text-2">Utility Inputs</div>
              <InputField leftText="Electricity (kWh)" leftVar="electricityUse" leftValue={this.state.electricityUse} rightText="$/kWh (Blended)" rightVar="electricityRate" rightValue={this.state.electricityRate} onChange={this.onChange}/>
              <InputField leftText="Natural Gas (therms)" leftVar="gasUse" leftValue={this.state.gasUse} rightText="$/therm" rightVar="gasRate" rightValue={this.state.gasRate} onChange={this.onChange}/>
              
              <div className="head-text-2">Carbon Coefficients</div>
              <InputField leftText="Electricity (tCO2e/kWh)" leftVar="electricityCoeff" leftValue={this.state.electricityCoeff} rightText="Gas (tCO2e/kBtu)" rightVar="gasCoeff" rightValue={this.state.gasCoeff} onChange={this.onChange}/>
              <div className="head-text-2">LL97 Carbon Limits</div>
              <LimitsField limit24={this.state.limits.limit24} limit30={this.state.limits.limit30} limit35={this.state.limits.limit35} />
              
              <div className="head-text-2">ECM Savings</div>
              <ECMField ecms={this.state.ecms} addECM={this.addECM} onChange={this.onECMChange}/>
              <button onClick={this.setDefaults}>Restore 2020 41CS Defaults</button>
            </form>
          </div>
        </div>
        
        <div>
          <ChartContent 
            area={this.state.area}
            electricityUse={this.state.electricityUse}
            gasUse={this.state.gasUse}
            electricityCoeff={this.state.electricityCoeff}
            gasCoeff={this.state.gasCoeff}
            electricityRate={this.state.electricityRate}
            gasRate={this.state.gasRate}
            ecms={this.state.ecms}
            limits={this.state.limits}
            penalty={this.state.penalty}
            totalFlag={this.state.totalFlag}
            btnTotal={this.state.btnTotal}
            btnNet={this.state.btnNet}
            setTotal={this.setTotal}
            setNet={this.setNet}
          />
        </div>
      </div>
    );
  }
}

export default UI;