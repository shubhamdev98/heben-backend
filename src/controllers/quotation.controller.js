const {generateQuotation} = require('../helper/pdfGen.helper');
const db = require('../models');
const Customer = db.Customer;
const Product = db.Product;


exports.createQuotation = async (req, res) => {
  const { customer, product, extrafield } = req.body;

  try {
    const newCustomer = await db.Customer.create({
      clientName: customer.clientName,
      companyName: customer.companyName,
      siteName: customer.siteName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      products: [{
        ...product,
        floorDetails: [
          ...(product.basementArr || []).map(item => ({ type: 'basement', height: item.height })),
          ...(product.ground_floorArr || []).map(item => ({ type: 'ground_floor', height: item.height })),
          ...(product.floorArr || []).map(item => ({ type: 'floor', height: item.height }))
        ],
        selectedExtras: (product.selectedExtras || []).map(extra => ({ name: extra })),
        extraField: {
          harness: extrafield.harness || '',
          c2c: extrafield.c2c || '',
          machineBase: extrafield.machineBase || '',
          overloadSensor: extrafield.overloadSensor || '',
          ARD: extrafield.ARD || '',
          UPS: extrafield.UPS || ''
        }
      }]
    }, {
      include: [{
        model: db.Product,
        as: 'products',
        include: [
          { model: db.FloorDetail, as: 'floorDetails' },
          { model: db.SelectedExtra, as: 'selectedExtras' },
          { model: db.ExtraField, as: 'extraField' }
        ]
      }]
    });

    res.status(201).json({ message: 'Customer and product created successfully!', data: newCustomer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


exports.getAllQuotations = async (req, res) => {
  try {
    const customers = await db.Customer.findAll({
      include: [{
        model: db.Product,
        as: 'products',
        include: [
          { model: db.FloorDetail, as: 'floorDetails' },
          { model: db.SelectedExtra, as: 'selectedExtras' },
          { model: db.ExtraField, as: 'extraField' }
        ]
      }]
    });

    if (!customers.length) {
      return res.status(404).json({ message: 'No customers found' });
    }

    const response = customers.flatMap(customer => {
      return customer.products.map(product => {
        const basementArr = product.floorDetails?.filter(f => f.type === 'basement').map(f => ({ height: f.height })) || [];
        const ground_floorArr = product.floorDetails?.filter(f => f.type === 'ground_floor').map(f => ({ height: f.height })) || [];
        const floorArr = product.floorDetails?.filter(f => f.type === 'floor').map(f => ({ height: f.height })) || [];

        return {
          customer: {
            clientName: customer.clientName,
            companyName: customer.companyName,
            siteName: customer.siteName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address
          },
          product: {
            liftType: product.liftType,
            ml_mr: product.ml_mr,
            shaftSize: product.shaftSize,
            passenger: product.passenger,
            capacity: product.capacity,
            doorOperation: product.doorOperation,
            door_type: product.door_type,
            opening: product.opening,
            machine: product.machine,
            cabin: product.cabin,
            bracket_combination: product.bracket_combination,
            quotation_number: product.quotation_number,
            note: product.note,
            basement: product.basement,
            ground_floor: product.ground_floor,
            floor: product.floor,
            floor_string: product.floor_string,
            total_floor: product.total_floor,
            basementArr,
            ground_floorArr,
            floorArr,
            selectedExtras: product.selectedExtras?.map(extra => extra.name) || []
          },
          extrafield: {
            harness: product.extraField?.harness || '',
            c2c: product.extraField?.c2c || '',
            machineBase: product.extraField?.machineBase || '',
            overloadSensor: product.extraField?.overloadSensor || '',
            ARD: product.extraField?.ARD || '',
            UPS: product.extraField?.UPS || ''
          }
        };
      });
    });

    res.status(200).json({ message: 'Quotations fetched successfully!', data: response });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


exports.updateQuotation = async (req, res) => {
  const { id } = req.params;
  const { customer, product, extrafield } = req.body;

  try {
    // Find existing customer with products and nested associations
    const existingCustomer = await db.Customer.findOne({
      where: { id },
      include: [{
        model: db.Product,
        as: 'products',
        include: [
          { model: db.FloorDetail, as: 'floorDetails' },
          { model: db.SelectedExtra, as: 'selectedExtras' },
          { model: db.ExtraField, as: 'extraField' }
        ]
      }]
    });

    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update customer fields
    await existingCustomer.update({
      clientName: customer.clientName,
      companyName: customer.companyName,
      siteName: customer.siteName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });

    // Get the first product (assuming single product per customer)
    const existingProduct = existingCustomer.products[0];
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found for this customer' });
    }

    // Update product fields
    await existingProduct.update({
      liftType: product.liftType,
      ml_mr: product.ml_mr,
      shaftSize: product.shaftSize,
      passenger: product.passenger,
      capacity: product.capacity,
      doorOperation: product.doorOperation,
      door_type: product.door_type,
      opening: product.opening,
      machine: product.machine,
      cabin: product.cabin,
      bracket_combination: product.bracket_combination,
      quotation_number: product.quotation_number,
      note: product.note,
      basement: product.basement,
      ground_floor: product.ground_floor,
      floor: product.floor,
      floor_string: product.floor_string,
      total_floor: product.total_floor
    });

    // Update FloorDetails:
    // Delete existing floorDetails and recreate based on payload
    await db.FloorDetail.destroy({ where: { productId: existingProduct.id } });

    const newFloorDetails = [
      ...(product.basementArr || []).map(item => ({ type: 'basement', height: item.height, productId: existingProduct.id })),
      ...(product.ground_floorArr || []).map(item => ({ type: 'ground_floor', height: item.height, productId: existingProduct.id })),
      ...(product.floorArr || []).map(item => ({ type: 'floor', height: item.height, productId: existingProduct.id }))
    ];

    if (newFloorDetails.length > 0) {
      await db.FloorDetail.bulkCreate(newFloorDetails);
    }

    // Update SelectedExtras:
    await db.SelectedExtra.destroy({ where: { productId: existingProduct.id } });

    const newSelectedExtras = (product.selectedExtras || []).map(name => ({
      name,
      productId: existingProduct.id
    }));

    if (newSelectedExtras.length > 0) {
      await db.SelectedExtra.bulkCreate(newSelectedExtras);
    }

    // Update or create ExtraField
    if (existingProduct.extraField) {
      await existingProduct.extraField.update({
        harness: extrafield.harness || '',
        c2c: extrafield.c2c || '',
        machineBase: extrafield.machineBase || '',
        overloadSensor: extrafield.overloadSensor || '',
        ARD: extrafield.ARD || '',
        UPS: extrafield.UPS || ''
      });
    } else {
      await db.ExtraField.create({
        harness: extrafield.harness || '',
        c2c: extrafield.c2c || '',
        machineBase: extrafield.machineBase || '',
        overloadSensor: extrafield.overloadSensor || '',
        ARD: extrafield.ARD || '',
        UPS: extrafield.UPS || '',
        productId: existingProduct.id
      });
    }

    // Reload updated customer with nested data to send back fresh data
    const updatedCustomer = await db.Customer.findOne({
      where: { id },
      include: [{
        model: db.Product,
        as: 'products',
        include: [
          { model: db.FloorDetail, as: 'floorDetails' },
          { model: db.SelectedExtra, as: 'selectedExtras' },
          { model: db.ExtraField, as: 'extraField' }
        ]
      }]
    });

    res.status(200).json({ message: 'Quotation updated successfully', data: updatedCustomer });
  } catch (error) {
    console.error('Error updating quotation:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


exports.getQuotationById = async (req, res) => {
   const { id } = req.params;

  try {
    const customer = await db.Customer.findOne({
      where: { id },
      include: [{
        model: db.Product,
        as: 'products',
        include: [
          { model: db.FloorDetail, as: 'floorDetails' },
          { model: db.SelectedExtra, as: 'selectedExtras' },
          { model: db.ExtraField, as: 'extraField' }
        ]
      }]
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const product = customer.products[0];

    // Group floor details
    const basementArr = product.floorDetails.filter(f => f.type === 'basement').map(f => ({ height: f.height }));
    const ground_floorArr = product.floorDetails.filter(f => f.type === 'ground_floor').map(f => ({ height: f.height }));
    const floorArr = product.floorDetails.filter(f => f.type === 'floor').map(f => ({ height: f.height }));

    const response = {
      customer: {
        clientName: customer.clientName,
        companyName: customer.companyName,
        siteName: customer.siteName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      },
      product: {
        liftType: product.liftType,
        ml_mr: product.ml_mr,
        shaftSize: product.shaftSize,
        passenger: product.passenger,
        capacity: product.capacity,
        doorOperation: product.doorOperation,
        door_type: product.door_type,
        opening: product.opening,
        machine: product.machine,
        cabin: product.cabin,
        bracket_combination: product.bracket_combination,
        quotation_number: product.quotation_number,
        note: product.note,
        basement: product.basement,
        ground_floor: product.ground_floor,
        floor: product.floor,
        floor_string: product.floor_string,
        total_floor: product.total_floor,
        basementArr,
        ground_floorArr,
        floorArr,
        selectedExtras: product.selectedExtras.map(extra => extra.name)
      },
      extrafield: {
        harness: product.extraField?.harness || '',
        c2c: product.extraField?.c2c || '',
        machineBase: product.extraField?.machineBase || '',
        overloadSensor: product.extraField?.overloadSensor || '',
        ARD: product.extraField?.ARD || '',
        UPS: product.extraField?.UPS || ''
      }
    };

    res.status(200).json({ message: 'Quotation fetched successfully!', data: response });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


exports.deleteQuotation = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await db.Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    await product.destroy();

    res.status(200).json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


exports.downloadQuotationPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [{ model: Product, as: 'products' }]
    });

    if (!customer || customer.products.length === 0) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const filePath = await generateQuotation(customer, customer.products[0]);

    res.download(filePath, `quotation_${customer.id}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

