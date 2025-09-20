// backend/utils/pdfGenerator.js
const puppeteer = require('puppeteer');

// Generate PDF as buffer instead of saving to file
const generatePDFBuffer = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  // Generate PDF buffer instead of saving to file
  const pdfBuffer = await page.pdf({ 
    format: 'A4',
    printBackground: true
  });
  
  await browser.close();
  return pdfBuffer;
};

// Keep the HTML generation function (same as before)
const generateHTMLReport = (assessmentData, config) => {
  const { getValueByPath, classifyValue } = require('./dataUtils');
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Assessment Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .field { margin-bottom: 8px; }
        .field-label { font-weight: bold; display: inline-block; width: 200px; }
        .field-value { display: inline-block; }
        .classification { font-style: italic; color: #666; margin-left: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Assessment Report</h1>
        <p>Session ID: ${assessmentData.session_id}</p>
        <p>Assessment ID: ${assessmentData.assessment_id}</p>
      </div>
  `;
  
  // Generate sections based on config
  config.sections.forEach(section => {
    html += `<div class="section"><div class="section-title">${section.name}</div>`;
    
    section.fields.forEach(field => {
      let value;
      
      if (Array.isArray(field.path)) {
        const values = getValueByPath(assessmentData, field.path);
        value = field.format ? field.format(...values) : values.join(', ');
      } else {
        value = getValueByPath(assessmentData, field.path);
      }
      
      if (value !== undefined) {
        html += `<div class="field">`;
        html += `<span class="field-label">${field.label}:</span>`;
        html += `<span class="field-value">${value} ${field.unit || ''}</span>`;
        
        // Add classification if available
        if (field.classification) {
          const classification = classifyValue(parseFloat(value), field.classification);
          if (classification) {
            html += `<span class="classification">(${classification})</span>`;
          }
        }
        
        html += `</div>`;
      }
    });
    
    html += `</div>`;
  });
  
  html += `</body></html>`;
  return html;
};

module.exports = {
  generatePDFBuffer,
  generateHTMLReport
};