
const express = require('express');
const authController = require('../Controllers/auth-controller');
const router = express.Router();

router.post("/signup",authController.createUser);
router.post("/login",authController.loginUser);
router.post("/google",authController.googleLogin);
router.post("/signout",authController.signOutUser);


module.exports = router;