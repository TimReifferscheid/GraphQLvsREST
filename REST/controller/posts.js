// own packages
const Post = require("./../models/post");
const User = require("./../models/user");

// GET /posts
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: "fetched posts",
        posts: posts.map(post => {
          return post.set("href", "http://localhost:8080/posts/" + post._id);
        })
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
// POST /posts
exports.createPost = (req, res, next) => {
  User.findById(req.userId).then(user => {
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 401;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
      title: title,
      content: content,
      creator: { _id: req.body.userId, name: user.name }
    });
    post
      .save()
      .then(result => {
        return User.findById(req.userId);
      })
      .then(user => {
        creator = user;
        user.posts.push(post);
        return user.save();
      })
      .then(result => {
        res.status(201).json({
          message: "Post created successfully!",
          post: post,
          actions: {
            read: {
              href: "http://localhost:8080/posts/" + post._id,
              rel: "read",
              method: "GET",
              description: "Read existing post"
            },
            update: {
              href: "http://localhost:8080/posts/" + post._id,
              rel: "update",
              method: "PUT",
              description: "Update existing post"
            },
            delete: {
              href: "http://localhost:8080/posts/" + post._id,
              rel: "delete",
              method: "DELETE",
              description: "Delete existing post"
            },
            getPosts: {
              href: "http://localhost:8080/posts",
              rel: "read",
              method: "GET",
              description: "Get all posts"
            }
          }
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

// GET /post/{postId}
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "post fetched",
        post: post,
        actions: {
          create: {
            href: "http://localhost:8080/posts/",
            rel: "create",
            method: "POST",
            description: "Create a new post"
          },
          update: {
            href: "http://localhost:8080/posts/" + post._id,
            rel: "update",
            method: "PUT",
            description: "Update existing post"
          },
          delete: {
            href: "http://localhost:8080/posts/" + post._id,
            rel: "delete",
            method: "DELETE",
            description: "Delete existing post"
          },
          getPosts: {
            href: "http://localhost:8080/posts",
            rel: "read",
            method: "GET",
            description: "Get all posts"
          }
        }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// PUT /post/{postId}
exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      post.title = title;
      post.content = content;
      post.updatedAt = Date.now();
      return post.save();
    })
    .then(result => {
      res.status(200).json({
        message: "post updated",
        post: result,
        actions: {
          create: {
            href: "http://localhost:8080/posts/",
            rel: "create",
            method: "POST",
            description: "Create a new post"
          },
          read: {
            href: "http://localhost:8080/posts/" + postId,
            rel: "read",
            method: "GET",
            description: "Read existing post"
          },
          delete: {
            href: "http://localhost:8080/posts/" + postId,
            rel: "delete",
            method: "DELETE",
            description: "Delete existing post"
          },
          getPosts: {
            href: "http://localhost:8080/posts",
            rel: "read",
            method: "GET",
            description: "Get all posts"
          }
        }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// DELETE /post/{postId}
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      console.log("Post deleted!");
      res.status(200).json({
        message: "post deleted",
        actions: {
          create: {
            href: "http://localhost:8080/posts/",
            rel: "create",
            method: "POST",
            description: "Create a new post"
          },
          getPosts: {
            href: "http://localhost:8080/posts",
            rel: "read",
            method: "GET",
            description: "Get all posts"
          }
        }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
