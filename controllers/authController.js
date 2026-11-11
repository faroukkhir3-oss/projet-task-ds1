const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// نصنعو التوكن
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { nom, login, motDePasse, role } = req.body;

  // ملاحظة : في مشروع حقيقي ما نخليوش اليوزر يختار role manager بروحو
  // هنا خليناها باش نسهلو التجربة في الـ DS
  const user = await User.create({ nom, login, motDePasse, role });

  res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, nom: user.nom, login: user.login, role: user.role },
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { login, motDePasse } = req.body;
  if (!login || !motDePasse) {
    return res.status(400).json({ message: 'Login et mot de passe requis' });
  }

  // نطلبو الـ password صراحة خاطرو select:false
  const user = await User.findOne({ login: login.toLowerCase() }).select('+motDePasse');
  if (!user || !(await user.comparePassword(motDePasse))) {
    return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
  }

  res.json({
    token: signToken(user._id),
    user: { id: user._id, nom: user.nom, login: user.login, role: user.role },
  });
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  res.json(req.user);
});
