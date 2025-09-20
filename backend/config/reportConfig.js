// backend/config/reportConfig.js
const reportConfig = {
    "as_hr_02": {
      sections: [
        {
          name: "Key Body Vitals",
          fields: [
            { 
              label: "Heart Rate", 
              path: "vitalsMap.vitals.heart_rate", 
              unit: "bpm" 
            },
            { 
              label: "Blood Pressure", 
              path: ["vitalsMap.vitals.bp_sys", "vitalsMap.vitals.bp_dia"], 
              format: (sys, dia) => `${sys}/${dia} mmHg` 
            },
            { 
              label: "Oxygen Saturation", 
              path: "vitalsMap.vitals.oxy_sat_prcnt", 
              unit: "%" 
            },
            { 
              label: "Respiratory Rate", 
              path: "vitalsMap.vitals.resp_rate", 
              unit: "breaths/min" 
            }
          ]
        },
        {
          name: "Body Composition",
          fields: [
            { 
              label: "BMI", 
              path: "bodyCompositionData.BMI", 
              classification: [
                { range: [0, 18.5], status: "Underweight" },
                { range: [18.5, 25], status: "Normal" },
                { range: [25, 30], status: "Overweight" },
                { range: [30, 100], status: "Obese" }
              ]
            },
            { 
              label: "Body Fat Percentage", 
              path: "bodyCompositionData.BFC", 
              unit: "%" 
            },
            { 
              label: "Waist-to-Hip Ratio", 
              path: "bodyCompositionData.WHR" 
            }
          ]
        },
        {
          name: "Fitness Levels",
          fields: [
            { 
              label: "VO2 Max", 
              path: "vitalsMap.metadata.physiological_scores.vo2max" 
            },
            { 
              label: "Cardiovascular Endurance", 
              path: "exercises[?id==235].setList[0].time", 
              unit: "seconds" 
            }
          ]
        }
      ]
    },
    "as_card_01": {
      sections: [
        {
          name: "Key Body Vitals",
          fields: [
            { 
              label: "Heart Rate", 
              path: "vitalsMap.vitals.heart_rate", 
              unit: "bpm" 
            },
            { 
              label: "Blood Pressure", 
              path: ["vitalsMap.vitals.bp_sys", "vitalsMap.vitals.bp_dia"], 
              format: (sys, dia) => `${sys}/${dia} mmHg` 
            }
          ]
        },
        {
          name: "Cardiovascular Endurance",
          fields: [
            { 
              label: "Cardiac Output", 
              path: "vitalsMap.metadata.cardiovascular.cardiac_out", 
              unit: "L/min" 
            },
            { 
              label: "Mean Arterial Pressure", 
              path: "vitalsMap.metadata.cardiovascular.map", 
              unit: "mmHg" 
            }
          ]
        },
        {
          name: "Body Composition",
          fields: [
            { 
              label: "BMI", 
              path: "bodyCompositionData.BMI" 
            }
          ]
        }
      ]
    }
  };
  
  module.exports = reportConfig;