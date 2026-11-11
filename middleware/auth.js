const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// middleware 1 : نتأكدو إلي اليوزر مْعَرِّف روحو (عندو token صحيح)
exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  // التوكن يجي هكا : Authorization: Bearer xxxxx
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non authentifie : token manquant' });
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // يرمي خطأ كان التوكن غالط

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: 'Utilisateur introuvable' });
  }

  // نخزنو اليوزر في req باش نستعملوه في الـ controllers
  req.user = user;
  next();
});

// middleware 2 : نتأكدو من الـ role (مثلا manager فقط)
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acces refuse : role insuffisant' });
  }
  next();
};
