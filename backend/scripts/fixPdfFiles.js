const fs = require('fs');
const path = require('path');

// A minimal valid PDF structure
const minimalPdfContent = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
    >>
  >>
  /Contents 4 0 R
>>
endobj
4 0 obj
<<
  /Length 54
>>
stream
BT
/F1 24 Tf
100 700 Td
(This is a demo PDF file) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000283 00000 n 
trailer
<<
  /Root 1 0 R
  /Size 5
>>
startxref
386
%%EOF`;

const booksDir = path.join(__dirname, '../uploads/books');

if (fs.existsSync(booksDir)) {
    const files = fs.readdirSync(booksDir);
    let count = 0;

    files.forEach(file => {
        if (file.endsWith('.pdf')) {
            const filePath = path.join(booksDir, file);
            fs.writeFileSync(filePath, minimalPdfContent);
            console.log(`✅ Fixed: ${file}`);
            count++;
        }
    });

    console.log(`\nSuccessfully converted ${count} dummy files to valid PDFs.`);
} else {
    console.log('Books directory not found.');
}
