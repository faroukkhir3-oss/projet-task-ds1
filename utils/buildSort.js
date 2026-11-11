// نحوّلو ?sort=-createdAt,titre  إلى object يفهمو mongoose
// الحقول المسموحة فقط (باش ما يعمل حد sort على حاجة ما يلزمش)
module.exports = (sortParam, allowedFields, defaultSort = '-createdAt') => {
  const raw = sortParam || defaultSort;
  const result = {};
  raw.split(',').forEach((f) => {
    const field = f.trim().replace(/^-/, '');
    if (allowedFields.includes(field)) {
      result[field] = f.trim().startsWith('-') ? -1 : 1;
    }
  });
  // إذا ما لقينا حتى حقل صحيح نرجعو للـ default
  return Object.keys(result).length ? result : { createdAt: -1 };
};
