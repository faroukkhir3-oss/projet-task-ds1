const router = require('express').Router();
const c = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', c.getTasks);

module.exports = router;
