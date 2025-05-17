const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateQuotationPDF = (customer, product) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, '../public/quotations');
    const filePath = path.join(dir, `quotation_${customer.id}.pdf`);

    fs.mkdirSync(dir, { recursive: true });

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Title Section
    doc
      .fontSize(20)
      .text('Quotation of Home Elevator', { align: 'center', underline: true })
      .moveDown(1.5);

    // Company Info
    doc
      .fontSize(10)
      .text('Seller: Your Company Name Pvt. Ltd.', { continued: true })
      .text(`     Date: ${new Date().toLocaleDateString()}`)
      .moveDown(0.5);

    doc
      .text(`Buyer: ${customer.firstName}`, { continued: true })
      .text(`     Project Name: ${customer.siteName}`)
      .moveDown(1);

    // Section: Product & Price (Table)
    doc.fontSize(12).text('1. Product & Price', { underline: true }).moveDown(0.5);

    // Table Header
    const tableTop = doc.y;
    const item = {
      productName: product.liftType,
      floors: product.floor,
      speed: '0.4', // sample value
      load: '320',  // sample value
      quantity: 1,
      price: '',    // add if needed
    };

    const tableData = [
      ['Product Name', 'Floors', 'Speed (m/s)', 'Load (kg)', 'Quantity', 'Price (USD)'],
      [item.productName, item.floors, item.speed, item.load, item.quantity.toString(), item.price]
    ];

    const columnWidths = [140, 60, 80, 80, 80, 80];
    const startX = doc.x;

    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, i) => {
        const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        const y = tableTop + rowIndex * 25;

        doc.rect(x, y, columnWidths[i], 25).stroke();
        doc.text(cell, x + 5, y + 8);
      });
    });

    // Total
    doc.moveDown(2).fontSize(12).fillColor('black');
    doc.text('Total Amount: 1', { align: 'left' }).moveDown(1);

    // Container info & notes
    doc
      .fontSize(10)
      .fillColor('black')
      .text('Container No.: 1*20GP')
      .moveDown(0.5)
      .text(
        'Note: The quotation bases on equipment price terms, excluding installation and training charges. On-site guidance fee is:\n - $1200/unit\n - $180/person/day\n - Flight, hotel, board fee, Visa (as applicable)',
        { lineGap: 2 }
      );

    // Other Sections
    const sections = [
      ['2. Packing', 'Export packing gluing wooden box'],
      ['3. Payment terms', '30% T/T in advance & 70% T/T before shipment'],
      ['4. Delivery time', '45 days after T/T receipt & drawing confirmation'],
      ['5. Warranty', '12 months after delivery (excl. natural disaster/manual damage)'],
      ['6. Valid period', '60 days'],
      ['7. Documents with shipment', 'Installation guide, electric/manuals, packing list (in English)']
    ];

    doc.moveDown(2);
    sections.forEach(([title, desc]) => {
      doc.fontSize(12).fillColor('black').text(title, { underline: true }).moveDown(0.2);
      doc.fontSize(10).fillColor('gray').text(desc).moveDown(1);
    });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = generateQuotationPDF;
