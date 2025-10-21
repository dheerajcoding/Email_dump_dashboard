const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelService {
  parseExcelFile(filePath) {
    try {
      console.log(' Parsing:', path.basename(filePath));

      const workbook = XLSX.readFile(filePath);
      
      const sheetIndex = workbook.SheetNames.length > 1 ? 1 : 0;
      const sheetName = workbook.SheetNames[sheetIndex];
      const worksheet = workbook.Sheets[sheetName];

      console.log(' Reading sheet:', sheetName);

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: ''
      });

      console.log(' Parsed ' + jsonData.length + ' rows');

      this.deleteFile(filePath);

      return jsonData;
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
