// Generates all charts displayed in the web application
// and performs all calculations associated with the charts 
// based on the user input

import React, { Component } from "react";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

const KBTU_KWH = 3.412;
const KBTU_THERM = 100.067;
const COLORS = [ // colors correspond to a maximum of 10 ECMs
    'rgb(54, 162, 235)', // blue
    'rgb(237,28,36)', //'rgb(255, 99, 132)', // red //rgb(255,207,6)
    '#ff7f0e',  // safety orange
    '#2ca02c',  // cooked asparagus green
    '#9467bd',  // muted purple
    '#8c564b',  // chestnut brown
    '#e377c2',  // raspberry yogurt pink
    '#7f7f7f',  // middle gray
    '#bcbd22',  // curry yellow-green
    '#17becf'   // blue-teal
  ]

class ChartContent extends Component {
    
    pie_energy_use = {};
    pie_co2 = {};
    pie_cost = {};
    pie_ecm = {};
    bar_ll97 = {};
    bar_co2 = {};
    bar_thresholds = {};
    
    valueLabelFunction = context => {
        var label = context.label || '';
        if (label) {
          label += ': ';
        }
        if (context.parsed !== null) {
          label += new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(context.parsed);
        }
        return label;
    }
    
    costLabelFunction = context => {
    var label;
    if (context.parsed.x === undefined) {
        label = context.label || '';
        if (label) {
        label += ': ';
        }
        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed);
    } else {
        label = context.dataset.label || '';
        if (label) {
            label += ': ';
        }
        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.x);
    }
    return label;
    }

    getProps = () => {
        // total energy use
        var electricity_kbtu = this.props.electricityUse*KBTU_KWH; // convert kWh to kBtu
        var gas_kbtu = this.props.gasUse*KBTU_THERM; // convert therms to kBtu
        var total_kbtu = electricity_kbtu + gas_kbtu;

        // total CO2
        var electricity_co2 = this.props.electricityUse * this.props.electricityCoeff; // coeff is tCO2e/kWh
        var gas_co2 = gas_kbtu * this.props.gasCoeff; // coeff is tCO2e/kBtu
        var total_co2 = electricity_co2 + gas_co2;

        // total costs
        var electricity_cost = this.props.electricityUse*this.props.electricityRate;
        var gas_cost = this.props.gasUse*this.props.gasRate;
        var total_cost = electricity_cost + gas_cost;

        // ECM energy, CO2, and cost savings
        var ecm_electricity_kbtu = this.props.ecms.reduce( (x, ecm) => x + ecm.electricity, 0);
        var ecm_gas_kbtu = this.props.ecms.reduce( (x, ecm) => x + ecm.gas, 0);

        // ECM CO2 data for pie chart                 kBtu   *   kWh/kBtu  *  tCO2e/kWh                    kBtu * tCO2e/kBtu
        var ecms_co2 = this.props.ecms.map(ecm => ecm.electricity/KBTU_KWH*this.props.electricityCoeff + ecm.gas*this.props.gasCoeff);

        // net energy, CO2, and costs
        // use maximum to prevent negative values
        var net_electricity_kbtu = Math.max(electricity_kbtu - ecm_electricity_kbtu, 0);
        var net_gas_kbtu = Math.max(gas_kbtu - ecm_gas_kbtu, 0);
        var net_electricity_co2 = net_electricity_kbtu/KBTU_KWH*this.props.electricityCoeff; // coeff is tCO2e/kWh
        var net_gas_co2 = net_gas_kbtu*this.props.gasCoeff; // coeff is tCO2e/kBtu
        var net_electricity_cost = net_electricity_kbtu/KBTU_KWH*this.props.electricityRate; // rate is $/kWh
        var net_gas_cost = net_gas_kbtu/KBTU_THERM*this.props.gasRate; // must covert to therms since rate is $/therm, not $/kBtu

        var net_kbtu = net_electricity_kbtu + net_gas_kbtu;
        var net_co2 = net_electricity_co2 + net_gas_co2;
        var net_cost = net_electricity_cost + net_gas_cost;
        var ecm_co2 = total_co2 - net_co2;
        var ecm_savings =  total_cost - net_cost;

        // LL97 targets
        var target24 = this.props.area*this.props.limits.limit24/1000;
        var target30 = this.props.area*this.props.limits.limit30/1000;
        var target35 = this.props.area*this.props.limits.limit35/1000;

        var penalty24 = Math.max((net_co2 - target24)*this.props.penalty, 0);
        var penalty30 = Math.max((net_co2 - target30)*this.props.penalty, 0);
        var penalty35 = Math.max((net_co2 - target35)*this.props.penalty, 0);

        // pie charts
        var data_energy_use = {
            labels: ['Electricity','Natural Gas',],
            datasets: [{
            data: this.props.totalFlag ? [electricity_kbtu, gas_kbtu] : [net_electricity_kbtu, net_gas_kbtu],
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(237,28,36)',
            ],
            hoverOffset: 4
            }]
        };
        
        var options_energy_use = {
            plugins: {
                title: {
                    display: true,
                    text: this.props.totalFlag ? 'Total Energy Use (kBtu)' : 'Net Energy Use (kBtu)',
                    font: { size: 16} 
                },
                tooltip: {
                callbacks: {
                    label: this.valueLabelFunction
                }
            }
            },
            maintainAspectRatio: false
        };
    
        
        var data_co2 = {
            labels: ['Electricity','Natural Gas',],
            datasets: [{
            data: this.props.totalFlag ? [electricity_co2, gas_co2] : [net_electricity_co2, net_gas_co2],
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(237,28,36)',
            ],
            hoverOffset: 4
            }]
        };
    
        var options_co2 = {
            plugins: {
                title: {
                    display: true,
                    text: this.props.totalFlag ? 'Total CO2 Emissions (tCO2)' : 'Net CO2 Emissions (tCO2)',
                    font: { size: 16}
                },
                tooltip: {
                callbacks: {
                    label: this.valueLabelFunction
                }
            }
            },
            maintainAspectRatio: false
        };
        
        var data_cost = {
            labels: ['Electricity', 'Natural Gas',],
            datasets: [{
            data: this.props.totalFlag ? [electricity_cost, gas_cost]: [net_electricity_cost, net_gas_cost],
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(237,28,36)',
            ],
            hoverOffset: 4
            }]
        };
    
        var options_cost = {
            plugins: {
                title: {
                    display: true,
                    text: this.props.totalFlag ? 'Total Energy Costs ($)' : 'Net Energy Costs ($)',
                    font: { size: 16}
                },
                tooltip: {
                callbacks: {
                    label: this.costLabelFunction
                }
            }
            },
            maintainAspectRatio: false
        };
    
        var data_ecm = {
            labels: this.props.ecms.map(ecm => ecm.name),
            datasets: [{
            data: ecms_co2,
            backgroundColor: COLORS.slice(0, this.props.ecms.length),
            hoverOffset: 4
            }]
        };
    
        var options_ecm = {
            plugins: {
                title: {
                    display: true,
                    text: 'ECM CO2 Savings',
                    font: { size: 16}
                },
                legend: {
                position: 'right'
                }
            },
            maintainAspectRatio: false
        };
    
        // LL97 charts (bottom row)
        var data_ll97_costs ={
            labels: ['2024','2030','2035+'],
            datasets: [
            {
                stack: "stack1",
                label: 'Energy Cost',
                data: [net_cost, net_cost, net_cost],
                backgroundColor: [
                'rgb(54, 162, 235)',
                ],
            },
            {
                stack: "stack1",
                label: 'LL97 Penalty',
                data: [penalty24, penalty30, penalty35],
                backgroundColor: [
                'rgb(237,28,36)',
                ],   
            },
            {
                stack: "stack1",
                label: 'ECM Savings',
                data: [ecm_savings, ecm_savings, ecm_savings],
                backgroundColor: [
                'rgba(0, 145, 77, 0.4)',
                ],   
            }
            ]
        };
    
        var options_ll97_costs = {
            indexAxis: 'y',
            plugins: {
            title: {
                display: true,
                text: 'Energy and LL97 Costs',
                padding: {bottom: 0},
                font: { size: 16}
            },
            tooltip: {
                callbacks: {
                label: this.costLabelFunction
                }
            },
            },
            scales: {
            xAxes: [{
                stacked: true,
            }],
            yAxes: [{
                stacked: true,
            }],
            },
            maintainAspectRatio: false
        }
    
        var data_ll97_targets ={
        labels: [''],
        datasets: [
            {
            stack: "stack1",
            label: 'Net CO2 Emissions',
            data: [net_co2],
            backgroundColor: [
                'rgb(54, 162, 235)',
            ],
            },
            {
            stack: "stack1",
            label: 'ECM Savings',
            data: [ecm_co2],
            backgroundColor: [
                'rgba(0, 145, 77, 0.4)',
            ],   
            }
        ]
        };
    
        var targets = [target24, target30, target35];
        var years = ['2024', '2030', '2035+'];
        var annotations = [];
        targets.forEach( (target, i) => {
        if (target > 0){
            annotations.push({
            label: {
                backgroundColor: ((target <= net_co2) ? 'rgb(237,28,36)' : 'rgba(255, 99, 132, 0.5)'),
                content: [years[i] + ' Target', target.toFixed(0) + ' tCO2e/yr'],
                enabled: true,
                yAdjust: -60,
            },
            type: 'line',
            xMin: target,
            xMax: target,
            borderColor:  ((target <= net_co2) ? 'rgb(237,28,36)' : 'rgba(255, 99, 132, 0.5)'),
            borderWidth: 2,
            })
        }
        });
    
        var options_ll97_targets = {
        indexAxis: 'y',
        plugins: {
            title: {
                display: true,
                text: 'LL97 CO2 Emissions Targets (tCO2e)',
                padding: { bottom: 50},
                font: { size: 16}
            },
            legend: {
            display: false
            },
            annotation: {
            annotations: annotations,
            }
        },
        scales: {
            x: {
            grid: {
                drawBorder: false,
                },
                },
            y: {
            grid: {
                display: false, 
                drawBorder: false,
                },
            },
        },
        maintainAspectRatio: false
        }
        
        var props = {
            total_kbtu: total_kbtu,
            total_co2: total_co2,
            total_cost: total_cost,
            net_kbtu: net_kbtu,
            net_co2: net_co2,
            net_cost: net_cost,
            data_energy_use: data_energy_use,
            options_energy_use: options_energy_use,
            data_co2: data_co2,
            options_co2: options_co2,
            data_cost: data_cost,
            options_cost: options_cost,
            data_ecm: data_ecm,
            options_ecm: options_ecm,
            data_ll97_costs: data_ll97_costs,
            options_ll97_costs: options_ll97_costs,
            data_ll97_targets: data_ll97_targets,
            options_ll97_targets: options_ll97_targets
        };
        return props;
    }

  render() {
        var props = this.getProps();
        return (
            <div className="content-layout">
                <div className="top-row">
                <div className="btn-group">
                <button className = {this.props.btnTotal} onClick={this.props.setTotal}>Total (without ECMs)</button>
                <button className = {this.props.btnNet} onClick={this.props.setNet}>Net (with ECMs)</button>
                </div>
                {/* pie total energy use */}
                <div className="chart-container">
                    <Pie id="energy-use" data={props.data_energy_use} options={props.options_energy_use} ref={(reference) => this.pie_energy_use = reference}  />
                    <div className='total-label'> {Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.props.totalFlag ? props.total_kbtu : props.net_kbtu)} kBtu </div>
                </div>

                {/* pie total CO2 */}
                <div className="chart-container">
                    <Pie id="energy-co2" data={props.data_co2} options={props.options_co2} ref={(reference) => this.pie_co2 = reference}  />
                    <div className='total-label'> {Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.props.totalFlag ? props.total_co2 : props.net_co2)} tCO2e </div>
                </div>

                {/* pie total energy costs */}
                <div className="chart-container">
                    <Pie id="energy-cost" data={props.data_cost} options={props.options_cost} ref={(reference) => this.pie_cost = reference}  />
                    <div className='total-label'> {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(this.props.totalFlag ? props.total_cost : props.net_cost)} </div>
                </div>
                
                {/* pie ECM CO2 breakdown */}
                <div className="chart-container ecm">
                    <Pie id="ecm-co2" data={props.data_ecm} options={props.options_ecm} ref={(reference) => this.pie_ecm = reference}  />
                </div>
                
                </div>
                <div className="bottom-row">
                {/* LL97 costs */}
                <div className="chart-container bar">
                    <Bar id="ll97-cost" data={props.data_ll97_costs} options={props.options_ll97_costs} ref={(reference) => this.bar_ll97 = reference}  />
                    <div className='axis-label'> Total Cost ($) </div>
                </div>
                <div className="chart-container bar-thresholds">
                    <Bar id="thresholds" data={props.data_ll97_targets} options={props.options_ll97_targets} ref={(reference) => this.bar_thresholds = reference} />
                </div>
                </div>
                
            </div>
            
        );
  }
}

export default ChartContent;