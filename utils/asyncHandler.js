// wrapper باش ما نكتبوش try/catch في كل controller
// أي خطأ يتبعث مباشرة لـ errorHandler
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
