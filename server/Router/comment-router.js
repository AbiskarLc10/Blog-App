const express = require('express');
const router = express.Router();
const commentController = require("../Controllers/comment-controller")
const verifyToken = require("../utils/verifyUser");

router.post("/postComment",verifyToken,commentController.postComment);
router.get("/getComments/:postId",commentController.getComments);
router.put("/likeComment/:commentId",verifyToken,commentController.likeComment);
router.delete("/deleteComment/:commentId",verifyToken,commentController.deleteComment);
router.put("/editComment/:commentId",verifyToken,commentController.editComment);
router.get("/getAllComments",verifyToken,commentController.getAllComments);


module.exports = router;