const express = require('express');
const { registerUser, loginUser, getMe, logoutUser } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', getMe);
router.post('/logout', logoutUser);

module.exports = router;
