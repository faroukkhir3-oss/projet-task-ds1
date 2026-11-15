const router = require('express').Router();
const c = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// كل روتات المشاريع تحتاج authentification
router.use(protect);

router.route('/').post(c.createProject).get(c.getProjects);
router.route('/:id').get(c.getProject).put(c.updateProject).delete(c.deleteProject);

module.exports = router;
