const { sequelize } = require('../db/database.js');
const AdminModel = require('../models/admin.model.js')(sequelize);
const { generateCodename } = require('../utils/generateCodename.js');
const { generateProbability } = require('../utils/generateProbability.js');
const jwt = require('jsonwebtoken');

// Create an admin
exports.createAdmin = async (req, res) => {
  try {
    const adminData = {
      codename: generateCodename(),
      password: Math.random().toString(36).substring(2, 10)
    };

    const admin = await AdminModel.create(adminData);

    res.status(201).json(admin);
  } catch (error) {
    console.error('Full error:', error); // More detailed error logging
    res.status(400).json({ message: 'Error creating admin', error: error.message });
  }
};

// Authenticate an admin
exports.authenticate = async (req, res) => {
  try {
    const { codename, password } = req.body;
    console.log('Codename:', codename);
    console.log('Password:', password);
    const admin = await AdminModel.findOne({ where: { codename, password } });
    console.log('Admin:', admin);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid codename or password' });
    }


    const token = jwt.sign(
      { codename: codename }, 
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    
    res.json({ message: 'Authentication successful', token: token });
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating', error: error.message });
  }
};


// const jwt = require('jsonwebtoken');

// exports.authenticate = async (req, res) => {
//   try {
//     const { codename, password } = req.body;
    
//     // Input validation
//     if (!codename || !password) {
//       return res.status(400).json({ message: 'Codename and password are required' });
//     }

//     console.log('Codename:', codename);
//     console.log('Password:', password);

//     // Find admin by codename only (not by password)
//     const admin = await AdminModel.findOne({ 
//       where: { codename }
//     });

//     if (!admin) {
//       // Use a generic message for security
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Compare plain text password with hashed password
//     const isValidPassword = password === admin.password;
    
//     if (!isValidPassword) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { 
//         adminId: admin.id,  // Use ID instead of codename in token
//         codename: admin.codename 
//       }, 
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRATION }
//     );
    
//     res.json({ 
//       message: 'Authentication successful', 
//       token: token 
//     });

//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(500).json({ 
//       message: 'Error authenticating',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };