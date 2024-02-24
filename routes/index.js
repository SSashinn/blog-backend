const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts');
const commentsController = require('../controllers/comments');

router.get('/v1/posts', postsController.posts_get);

router.post('/v1/posts', postsController.posts_post);

router.get('/v1/posts/:postid', postsController.singlePost_get);

router.put('/v1/posts/:postid', postsController.post_put);

router.delete('/v1/posts/:postid', postsController.post_delete);

router.get('/v1/posts/:postid/comments', commentsController.comments_get);

router.post('/v1/posts/:postid/comments', commentsController.comments_post);

router.delete('/v1/posts/:postid/comments/:commentid', commentsController.comments_delete);




module.exports = router;