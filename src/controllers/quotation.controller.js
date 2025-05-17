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


exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Customer.findAll({
      include: [{ model: Product, as: 'products' }] // use correct alias here
    });
    res.status(200).json(quotations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quotations' });
  }
};



exports.getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id, {
      include: [{ model: Product, as: 'products' }]
    });

    if (!customer) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quotation' });
  }
};


exports.updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, product } = req.body;

    const existingCustomer = await Customer.findByPk(id);
    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await existingCustomer.update(customer);

    const existingProduct = await Product.findOne({ where: { customerId: id } });
    if (existingProduct) {
      await existingProduct.update(product);
    }

    res.status(200).json({ message: 'Quotation updated', customer: existingCustomer, product: existingProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update quotation' });
  }
};


exports.deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Delete associated product first
    await Product.destroy({ where: { customerId: id } });

    // Then delete customer
    await customer.destroy();

    res.status(200).json({ message: 'Quotation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete quotation' });
  }
};
