const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const escapeRegex = require('../utils/escapeRegex');
const buildSort = require('../utils/buildSort');

const isManager = (user) => user.role === 'manager';

// نتأكدو كان اليوزر يقدر يبدل/يشوف التاسك :
// manager، ولا صاحب المشروع، ولا اليوزر المعيّن للتاسك
const canAccessTask = async (task, user) => {
  if (isManager(user)) return true;
  if (task.assigneA && task.assigneA.toString() === user._id.toString()) return true;
  const project = await Project.findById(task.projet);
  return !!project && project.proprietaire.toString() === user._id.toString();
};

// نتأكدو إلي اليوزر المعيّن موجود
const checkAssignee = async (userId) => {
  if (userId === null || userId === '') return null; // باش نقدرو نفسخو التعيين
  const u = await User.findById(userId);
  if (!u) {
    const err = new Error('Utilisateur a assigner introuvable');
    err.statusCode = 404;
    throw err;
  }
  return u._id;
};

// POST /api/projects/:projectId/tasks : أي يوزر يعمل task
exports.createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: 'Projet introuvable' });

  const { titre, description, statut, deadline, assigneA } = req.body;

  // التعيين للمانجر برك
  let assignee = null;
  if (assigneA !== undefined && assigneA !== null) {
    if (!isManager(req.user)) {
      return res.status(403).json({ message: 'Seul le manager peut affecter une tache' });
    }
    assignee = await checkAssignee(assigneA);
  }

  const task = await Task.create({
    titre, description, statut, deadline,
    projet: project._id,
    assigneA: assignee,
  });
  res.status(201).json(task);
});

// GET /api/tasks?projet=&statut=&assigneA=&search=&deadlineAvant=&sort=
// GET /api/projects/:projectId/tasks  (نفس الشي بس مفلتر على المشروع)
exports.getTasks = asyncHandler(async (req, res) => {
  const filter = {};
  const projet = req.params.projectId || req.query.projet;
  if (projet) filter.projet = projet;
  if (req.query.statut) filter.statut = req.query.statut;
  if (req.query.assigneA && isManager(req.user)) filter.assigneA = req.query.assigneA;

  // بحث بالعنوان ولا الوصف
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ titre: rx }, { description: rx }];
  }

  // فلترة بالـ deadline
  if (req.query.deadlineAvant || req.query.deadlineApres) {
    filter.deadline = {};
    if (req.query.deadlineAvant) filter.deadline.$lte = new Date(req.query.deadlineAvant);
    if (req.query.deadlineApres) filter.deadline.$gte = new Date(req.query.deadlineApres);
  }

  // اليوزر العادي يشوف برك تاسكات مشاريعو + التاسكات المعيّنة ليه
  if (!isManager(req.user)) {
    const myProjects = await Project.find({ proprietaire: req.user._id }).distinct('_id');
    filter.$and = [
      { $or: [{ projet: { $in: myProjects } }, { assigneA: req.user._id }] },
    ];
  }

  const sort = buildSort(req.query.sort, ['titre', 'statut', 'deadline', 'dateCreation', 'createdAt']);
  if (sort.createdAt) { sort.dateCreation = sort.createdAt; delete sort.createdAt; }

  const tasks = await Task.find(filter)
    .sort(sort)
    .populate('projet', 'nom')
    .populate('assigneA', 'nom login');

  res.json({ count: tasks.length, tasks });
});
