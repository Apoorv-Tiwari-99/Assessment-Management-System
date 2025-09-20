// backend/controllers/reportController.js
const sampleData = require('../data');
const reportConfig = require('../config/reportConfig');
const { generatePDFBuffer, generateHTMLReport } = require('../utils/pdfGenerator');

exports.generateReport = async (req, res) => {
  try {
    const { session_id } = req.body;
    
    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    // Get assessment data
    const assessmentData = sampleData[session_id];
    
    if (!assessmentData) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Get report configuration based on assessment_id
    const config = reportConfig[assessmentData.assessment_id];
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: `No configuration found for assessment type: ${assessmentData.assessment_id}`
      });
    }
    
    // Return session data and configuration for frontend
    res.status(200).json({
      success: true,
      message: 'Report data retrieved successfully',
      data: {
        sessionData: assessmentData,
        config: config
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// New endpoint to generate and download PDF directly
exports.downloadReport = async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    // Get assessment data
    const assessmentData = sampleData[session_id];
    
    if (!assessmentData) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Get report configuration based on assessment_id
    const config = reportConfig[assessmentData.assessment_id];
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: `No configuration found for assessment type: ${assessmentData.assessment_id}`
      });
    }
    
    // Generate HTML report
    const htmlContent = generateHTMLReport(assessmentData, config);
    
    // Generate PDF buffer (no file storage)
    const pdfBuffer = await generatePDFBuffer(htmlContent);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report_${session_id}_${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send the PDF buffer
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};