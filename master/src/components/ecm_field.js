// Generates the user input fields for energy conservation measures (ECMs)

import React, { Component } from "react";
import { default_ecms } from "../defaults";

class ECMField extends Component {
    
    addECM = e => {
        if (this.props.ecms.length < 10){
            var ecms = [...this.props.ecms, {
                name: '',
                electricity: 0,
                gas: 0
            }];
            this.props.onChange(ecms);
        }
    }

    removeECM = i => {
        var ecms = [...this.props.ecms];
        ecms.splice(i, 1);
        // setInputList(list);
        this.props.onChange(ecms);
    }

    setDefaultECMs = () => {
        var ecms = JSON.parse(JSON.stringify(default_ecms));
        this.props.onChange(ecms);
    }

    clearECMs = () => {
        var ecms = [{
            name: '',
            electricity: 0,
            gas: 0
          }];
          this.props.onChange(ecms);
    }

    // update the property (name, electricity, gas) of the corresponding ecm in the array
    onChange = (e, i, prop) => {
        var ecms = [...this.props.ecms];
        if (prop === 'name'){
            ecms[i][prop] = e.target.value;
        } else {
            ecms[i][prop] = Number(e.target.value);
        }
        this.props.onChange(ecms);
    }
    
    render() {
        return (
            <div className="input-header-left">
                {this.props.ecms.map( (ecm, i) => (
                    <div key={i.toString()} className="input-container">
                        <div className="input-container-ecm">
                            <div className="left-container">
                                <div className="head-text-4">ECM Name:</div>
                            </div>
                            <div className="name-container">
                                <input type="text" value={ecm.name} onChange={e => this.onChange(e, i, "name")}></input>
                                <button className="type-remove-btn" onClick={() => this.removeECM(i)}>X</button>
                            </div>
                        </div>
                        <div className="input-container-ecm">
                            <div className="left-container">
                                <div className="head-text-4">Electricity (kBtu)</div>
                                <input type="number" value={ecm.electricity} onChange={e => this.onChange(e, i, "electricity")}></input>
                            </div>
                            <div className="right-container">
                                <div className="head-text-4">Gas (kBtu)</div>
                                <input type="number" value={ecm.gas} onChange={e => this.onChange(e, i, "gas")}></input>
                            </div>
                        </div>
                    <div className="input-border"></div>
                    </div>
                ))}
            {/* <div className="ecm-btn-group"> */}
            <button className="btn-1" onClick={this.addECM}>{" "}Add ECM{" "}</button>
            <button onClick={this.clearECMs}>{" "}Clear ECMs{" "}</button>
            <button onClick={this.setDefaultECMs}>{" "}Set Default ECMs{" "}</button>
            {/* </div> */}
            


            {/* npx browserslist@latest --update-db */}
            </div>
        );
    }
}

export default ECMField;