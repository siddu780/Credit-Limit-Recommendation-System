const { sequelize } = require('./config/database');
const User = require('./models/User');
const UserCreditProfile = require('./models/UserCreditProfile');

const setupDatabase = async () => {
  try {
    console.log('Starting database setup...');
    
    // Sync all models with the database
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Database tables created successfully!');
    console.log('✅ User table is ready');
    console.log('✅ UserCreditProfile table is ready');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();
