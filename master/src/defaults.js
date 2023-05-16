// Stores all default values for the user input based on 41CS in 2020

// default utility data from 41CS in 2020
const defaults_2020 = {
  // building inputs
  building: 'B_norm',
  area: 180000, // square feet

  // utility inputs
  electricityUse: 3357600, // kWh
  electricityDemand: 770, // kW
  gasUse: 224449, // therms
  // electricityRate: 0.03, // $/kWh
  electricityRate: 0.19, // $/kWh
  electricityDemandRate: 25, // $/kW
  gasRate: 0.9, // $/therm

  // LL97 inputs
  // carbon coefficients
  electricityCoeff: 0.000288962, // tons CO2e/kWh
  gasCoeff: 0.00005311, // tons CO2e/kBtu}
  
  // carbon limits (kg CO2e/sf/year)
  limits: {
    limit24: 8.46,
    limit30: 4.53,
    limit35: 1.4,
  }
}

// default ECMS from CU-EnergyMasterPlanPresentationCalculations-20210601.xlsx in Facilities Repository, as of 10/30/21
// and from Oliver Zhang's thesis
// based on assumptions of savings allocated to electricity or natural gas
const default_ecms = [{
    name: 'Lab Heat Recovery',
    electricity: 0,
    gas: 3276219 // 174 tCO2e 3276219*0.00005311
  },
  // {
  //   name: 'Heat Pump',
  //   electricity: 0,
  //   gas: 5554510 // 295 tCO2e 5554510*0.00005311
  // },
  // {
  //   name: 'Improved Cogen Heat Recovery',
  //   electricity: 720275, // 61 tCO2e split or just all gas? 142
  //   gas: 1882885 // 100 tCO2e 1882885*0.00005311
  // },
  {
    name: 'Optimized Controls',
    electricity: 1653089, // 61 tCO2e split or just all gas? 140/0.000288962*3.412
    gas: 37658 // 2 tCO2e 2/0.00005311
  },
  {
    name: 'CW Supply Temp Reset',
    electricity: 429930, // 126,000 kWh/year
    gas: 0
  }];

const carbon_limits = {
  A: {limit24: 10.74, limit30: 4.2, limit35: 1.4},
  B_norm: {limit24: 8.46, limit30: 4.53, limit35: 1.4},
  B_health: {limit24: 23.81, limit30: 11.93, limit35: 1.4},
  E: {limit24: 7.58, limit30: 3.44, limit35: 1.4},
  F: {limit24: 5.74, limit30: 1.67, limit35: 1.4},
  H: {limit24: 23.81, limit30: 11.93, limit35: 1.4},
  I1: {limit24: 11.38, limit30: 5.98, limit35: 1.4},
  I2: {limit24: 23.81, limit30: 11.93, limit35: 1.4},
  I3: {limit24: 23.81, limit30: 11.93, limit35: 1.4},
  I4: {limit24: 7.58, limit30: 3.44, limit35: 1.4},
  M: {limit24: 11.81, limit30: 4.03, limit35: 1.4},
  R1: {limit24: 9.87, limit30: 5.26, limit35: 1.4},
  R2: {limit24: 6.75, limit30: 4.07, limit35: 1.4},
  U: {limit24: 4.26, limit30: 1.1, limit35: 1.4},
}

export {defaults_2020, default_ecms, carbon_limits};