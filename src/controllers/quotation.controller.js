const db = require('../models');
const Customer = db.Customer;
const Product = db.Product;

exports.createQuotation = async (req, res) => {
  try {
    const { customer, product } = req.body;

    const newCustomer = await Customer.create(customer);
    const newProduct = await Product.create({
      ...product,
      customerId: newCustomer.id
    });

    res.status(201).json({ message: 'Quotation created', customer: newCustomer, product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
