// نجيبو متغيرات البيئة من ملف .env
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();

// باش يقرا الـ JSON اللي يجي في الـ body
app.use(express.json());

// روت بسيطة نتأكدو بيها إلي السيرفر يخدم
app.get('/', (req, res) => res.json({ message: 'API Projets & Taches OK' }));

const PORT = process.env.PORT || 5000;

// نتّصلو بالـ DB و بعدها نحلّو السيرفر
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Serveur lance sur le port ${PORT}`));
});
