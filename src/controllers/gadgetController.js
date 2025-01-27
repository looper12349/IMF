const { sequelize } = require('../db/database.js');
const Gadget = require('../models/gadget.model.js')(sequelize);
const { generateCodename } = require('../utils/generateCodename.js');
const { generateProbability } = require('../utils/generateProbability.js');
const jwt = require('jsonwebtoken');




//  Get all gadgets
exports.getAllGadgets = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = status ? { status } : { status: 'Available' };
    const probability = generateProbability();
    const gadgets = await Gadget.findAll({ where: whereClause });
    
    res.json(gadgets);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving gadgets', error: error.message });
  }
};

//  Create a gadget
exports.createGadget = async (req, res) => {
  let gadgetDataStatus = {};
  try {
    let uniqueCodename;
    let existingGadget;
    
    // Retry logic for codename uniqueness
    do {
      uniqueCodename = generateCodename(); // Generate a new codename
      console.log("Generated codename:", uniqueCodename);
      
      // Check if codename already exists in the database
      existingGadget = await Gadget.findOne({ where: { codename: uniqueCodename } });
    } while (existingGadget); // Retry if codename already exists

    const gadgetData = {
      ...req.body,
      name: req.body.name || `Gadget ${Math.random().toString(36).substring(2, 10)}`,
      codename: uniqueCodename, // Assign the unique codename
      missionSuccessProbability: generateProbability()
    };
    
    gadgetDataStatus = gadgetData;

    // Create the gadget
    const gadget = await Gadget.create(gadgetData);

    res.status(201).json(gadget);
  } catch (error) {
    res.status(400).json({ message: 'Error creating gadget', error: error.message, gadget: gadgetDataStatus });
  }
};


//  Update a gadget
exports.updateGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Gadget.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Gadget not found' });
    }
    
    const updatedGadget = await Gadget.findByPk(id);
    res.json(updatedGadget);
  } catch (error) {
    res.status(400).json({ message: 'Error updating gadget', error: error.message });
  }
};

//  Decommission a gadget
exports.decommissionGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Gadget.update({
      status: 'Decommissioned',
      decommissionedAt: new Date()
    }, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Gadget not found' });
    }
    
    res.json({ message: 'Gadget decommissioned successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error decommissioning gadget', error: error.message });
  }
};

//  Self-destruct a gadget
exports.selfDestruct = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmationCode = Math.random().toString(36).substring(2, 10);
    
    
    const [updated] = await Gadget.update({
      status: 'Destroyed'
    }, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Gadget not found' });
    }
    
    res.json({ 
      message: 'Self-destruct sequence initiated', 
      confirmationCode 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error initiating self-destruct', error: error.message });
  }
}