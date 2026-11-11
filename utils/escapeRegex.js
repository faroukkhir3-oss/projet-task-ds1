// نهربو الرموز الخاصة في الـ regex باش البحث يكون آمن
module.exports = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
