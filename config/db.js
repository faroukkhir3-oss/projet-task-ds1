const mongoose = require('mongoose');

// فنكسيون تعمل الاتصال بقاعدة بيانات MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecte');
  } catch (err) {
    // كان صار مشكل في الاتصال نوقفو التطبيق
    console.error('Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
