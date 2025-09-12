const fs = require('fs');
const path = require('path');

console.log('Testing ETL script...');

// Check if source_docs directory exists
const sourceDocsPath = path.join(__dirname, '../../source_docs');
console.log('Source docs path:', sourceDocsPath);
console.log('Directory exists:', fs.existsSync(sourceDocsPath));

if (fs.existsSync(sourceDocsPath)) {
  const files = fs.readdirSync(sourceDocsPath);
  console.log('Files in source_docs:', files);
}

console.log('Test complete');
