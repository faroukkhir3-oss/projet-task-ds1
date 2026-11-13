const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: [true, 'Le titre est requis'], trim: true },
  description: { type: String, trim: true },
  // الـ status لازم يكون وحدة من 3 قيم فقط
  statut: {
    type: String,
    enum: { values: ['todo', 'doing', 'done'], message: 'Statut invalide (todo, doing, done)' },
    default: 'todo',
  },
  deadline: { type: Date },
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  // اليوزر اللي تتعيّنلو التاسك (المانجر وحدو يعيّن)
  assigneA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
