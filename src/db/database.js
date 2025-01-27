require('dotenv').config();
const { Sequelize } = require('sequelize');

// Add validation to catch missing database URL early
if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL is not defined in environment variables');
}

const sequelize = new Sequelize(process.env.NEON_DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

module.exports = {
  sequelize,
  connectDatabase: async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: false });
      console.log('Neon PostgreSQL connection established successfully.');
      console.log('Database tables synchronized.');
    } catch (error) {
      console.error('Unable to connect to the Neon database:', error);
      process.exit(1);
    }
  }
};