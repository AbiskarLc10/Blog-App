const express = require('express');
const router = express.Router();
const userController = require("../Controllers/user-controller");
const verifyToken = require('../utils/verifyUser');

router.put("/update/:userid", verifyToken ,userController.updateUser);
router.get("/getusers",verifyToken,userController.getAllUsers)
router.get("/getuser/:userId",verifyToken,userController.getuser)
router.delete("/delete/:userid", verifyToken ,userController.deleteUser);



module.exports = router;