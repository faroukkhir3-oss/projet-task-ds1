const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Le nom est requis'], trim: true },
  login: {
    type: String,
    required: [true, 'Le login est requis'],
    unique: true, // الـ login ما يتعاودش
    trim: true,
    lowercase: true,
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Mot de passe : 6 caracteres minimum'],
    select: false, // ما يطلعش في الـ queries كان نطلبوه بالقوة
  },
  role: { type: String, enum: ['user', 'manager'], default: 'user' },
  dateCreation: { type: Date, default: Date.now },
});

// قبل ما نسجلو اليوزر نكريبتيو الـ password
userSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  next();
});

// نقارنو الـ password اللي دخلو اليوزر مع المكريبتي
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);
