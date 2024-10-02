const express = require('express');
const router = express.Router();
const adminController = require("../Controllers/post-controller");
const verifyToken = require("../utils/verifyUser")

router.route("/post").post(verifyToken,adminController.adminPost);
router.route("/getposts").get(adminController.getPosts);
router.route("/deletepost/:postId").delete(verifyToken,adminController.deletePost);
router.route("/updatepost/:postId/:userId").put(verifyToken,adminController.updatePost);


module.exports = router;