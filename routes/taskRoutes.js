const router = require('express').Router();
const c = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', c.getTasks);
router.route('/:id').get(c.getTask).put(c.updateTask).delete(c.deleteTask);

module.exports = router;
