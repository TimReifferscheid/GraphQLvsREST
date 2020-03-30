// third party packages
const express = require("express");

// include existing pahts
const postController = require("../controller/posts");
const isAuth = require("./../middleware/is-auth");

const router = express.Router();

// GET /posts
router.get("/", isAuth, postController.getPosts);

// POST /posts
router.post("/", isAuth, postController.createPost);

// GET /post/{postId}
router.get("/:postId", isAuth, postController.getPost);

// PUT /post/{postId}
router.put("/:postId", isAuth, postController.updatePost);

// DELETE /post/{postId}
 router.delete("/:postId", isAuth, postController.deletePost);

module.exports = router;
