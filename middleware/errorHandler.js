// middleware مركزي يعالج كل الأخطاء ويرجع رد نظيف
module.exports = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Erreur serveur';

  // خطأ validation متاع mongoose (مثلا statut غالط)
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  // ID موش صحيح
  if (err.name === 'CastError') {
    status = 400;
    message = `Valeur invalide pour ${err.path}`;
  }
  // login مكرر
  if (err.code === 11000) {
    status = 400;
    message = 'Ce login existe deja';
  }
  // مشاكل JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token invalide ou expire';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ message });
};
