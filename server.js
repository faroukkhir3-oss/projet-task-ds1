// نجيبو متغيرات البيئة من ملف .env
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// باش يقرا الـ JSON اللي يجي في الـ body
app.use(express.json());

// الروتات متاع التطبيق
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// روت بسيطة نتأكدو بيها إلي السيرفر يخدم
app.get('/', (req, res) => res.json({ message: 'API Projets & Taches OK' }));

// إذا الروت موش موجودة
app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }));

// middleware متاع الأخطاء لازم يكون في الآخر
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// نتّصلو بالـ DB و بعدها نحلّو السيرفر
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Serveur lance sur le port ${PORT}`));
});
