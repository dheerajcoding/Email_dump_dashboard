const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelService {
  parseExcelFile(filePath) {
    try {
      console.log(' Parsing:', path.basename(filePath));

      const workbook = XLSX.readFile(filePath);
      
      // Use Sheet2 (index 1) if it exists, otherwise use first sheet
      const sheetIndex = workbook.SheetNames.length > 1 ? 1 : 0;
      const sheetName = workbook.SheetNames[sheetIndex];
      const worksheet = workbook.Sheets[sheetName];

      console.log(' Reading sheet:', sheetName);

      // Convert to JSON with header row handling
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: '',
        blankrows: false, // Skip blank rows
        header: 1 // Get array of arrays first
      });

      if (jsonData.length === 0) {
        console.log(' No data found in sheet');
        return [];
      }

      // First row is headers
      const headers = jsonData[0];
      const dataRows = jsonData.slice(1);

      // Convert to objects with proper headers
      const result = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          // Use the actual header name, or fallback to Column_N if empty
          const key = header && header.toString().trim() !== '' 
            ? header.toString().trim() 
            : `Column_${index + 1}`;
          obj[key] = row[index] !== undefined ? row[index] : '';
        });
        return obj;
      });

      console.log(' Parsed ' + result.length + ' rows');

      this.deleteFile(filePath);

      return result;
    } catch (error) {
      console.error(' Error parsing Excel:', error.message);
      throw error;
    }
  }

  parseAllAttachments(attachmentPaths) {
    const allData = [];

    for (const filePath of attachmentPaths) {
      try {
        const data = this.parseExcelFile(filePath);
        allData.push(...data);
      } catch (error) {
        console.error(' Failed to parse:', path.basename(filePath));
      }
    }

    return allData;
  }

  deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('  Deleted:', path.basename(filePath));
      }
    } catch (error) {
      console.error(' Error deleting file:', error.message);
    }
  }

  cleanupTempDirectory() {
    const tempDir = path.join(__dirname, '../temp');
    try {
      if (fs.existsSync(tempDir)) {
        const files = fs.readdirSync(tempDir);
        for (const file of files) {
          fs.unlinkSync(path.join(tempDir, file));
        }
        console.log(' Cleaned temp directory');
      }
    } catch (error) {
      console.error(' Error cleaning temp:', error.message);
    }
  }
}

module.exports = new ExcelService();
