const router = require('express').Router();
const c = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// كل روتات المشاريع تحتاج authentification
router.use(protect);

router.route('/').post(c.createProject).get(c.getProjects);

module.exports = router;
