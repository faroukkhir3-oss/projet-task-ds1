const Project = require('../models/Project');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const escapeRegex = require('../utils/escapeRegex');
const buildSort = require('../utils/buildSort');

// فنكسيون تشوف كان اليوزر عندو الحق في المشروع (صاحبو ولا manager)
const canAccess = (project, user) =>
  user.role === 'manager' || project.proprietaire.toString() === user._id.toString();

// POST /api/projects  : أي يوزر مْعَرِّف يعمل مشروع
exports.createProject = asyncHandler(async (req, res) => {
  const { nom, description, statut } = req.body;
  // الـ owner ناخوه من التوكن موش من الـ body (أمان)
  const project = await Project.create({ nom, description, statut, proprietaire: req.user._id });
  res.status(201).json(project);
});

// GET /api/projects?search=xx&statut=en cours&sort=-dateCreation
exports.getProjects = asyncHandler(async (req, res) => {
  const filter = {};

  // اليوزر العادي يشوف مشاريعو برك، المانجر يشوف الكل
  if (req.user.role !== 'manager') filter.proprietaire = req.user._id;

  // فلترة بالستاتي
  if (req.query.statut) filter.statut = req.query.statut;

  // بحث بالاسم ولا الوصف
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ nom: rx }, { description: rx }];
  }

  const sort = buildSort(req.query.sort, ['nom', 'statut', 'dateCreation', 'createdAt']);
  // createdAt موش موجود في الـ schema، نستعملو dateCreation
  if (sort.createdAt) { sort.dateCreation = sort.createdAt; delete sort.createdAt; }

  const projects = await Project.find(filter)
    .sort(sort)
    .populate('proprietaire', 'nom login');

  res.json({ count: projects.length, projects });
});
