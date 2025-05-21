const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

const generateQuotation = async (customer, product, extrafield) => {
  return new Promise((resolve, reject) => {
    const templatePath = path.join(__dirname, '../views/quotation.ejs');

    ejs.renderFile(templatePath, { 
      customer, 
      product, 
      basementArr: product.basementArr || [],
      ground_floorArr: product.ground_floorArr || [],
      floorArr: product.floorArr || [],
      extrafield: extrafield || {}
    }, (err, html) => {
      if (err) { 
        return reject(err);
      }

      const pdfPath = path.join(__dirname, `../public/quotations/quotation_${customer.id || Date.now()}.pdf`);
      const options = { format: 'A4' };

      pdf.create(html, options).toFile(pdfPath, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(pdfPath);
      });
    });
  });
};

module.exports = { generateQuotation };
