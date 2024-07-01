
const express = require('express')
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/',auth.verifyToken,userController.userDetails);
router.post('/login',userController.login);
router.post('/register',userController.createUser);
router.post('/logout',auth.verifyToken,userController.logout);
router.put('/update/:id',auth.verifyToken,userController.updateUser);
router.delete('/delete/:id',auth.verifyToken,userController.deleteUser);

module.exports = router;