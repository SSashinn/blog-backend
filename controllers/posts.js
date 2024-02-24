const Posts = require('../models/post');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// GET /posts - Get all published posts
exports.posts_get = asyncHandler(async (req, res) => {
    const posts = await Posts.find().select('title _id published').exec();
    // const publishedOnly = posts.filter((val) => val.published === true).map((val) => {
    //     const title = val.title;
    //     const id = val._id;
    //     return { id, title };
    // });
    const publishedOnly = await Posts.find({published: true}).select('title _id').exec();
    // const allPosts = posts.map(val => {
    //     const title = val.title;
    //     const id = val._id;
    //     const published = val.published;
    //     return { id, title, published };
    // });
    if (!req.user)
        res.json({ posts: publishedOnly, });
    else {
        res.json({ posts });
    }
});

// POST /posts - Create a new post
exports.posts_post = [
    body("title",)
        .trim()
        .isLength({ min: 1, max: 1000 })
        .escape()
        .withMessage("Title should not be empty or more than 1,000 letters"),

    body("body")
        .trim()
        .isLength({ min: 1, max: 10000 })
        .escape()
        .withMessage("Content should not be empty or more than 10,000 letters"),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const post = new Posts({
            title: req.body.title,
            body: req.body.body,
            published: req.body.published,
        });
        if (!errors.isEmpty()) {
            res.status(400).json({ post, errors: errors.array() });
        } else {
            await post.save();
            res.status(201).json(post);
        };
    }),
];

// GET /posts/:postId - Get a single post by ID
exports.singlePost_get = asyncHandler(async (req, res) => {
    const post = await Posts.findById(req.params.postid).exec();
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (!req.user && post.published===false)
        res.sendStatus(401);
    else
        res.json({ post });
});

// PUT /posts/:postId - Update a post by ID
exports.post_put = [
    body("title",)
        .trim()
        .isLength({ min: 1, max: 1000 })
        .escape()
        .withMessage("Title should not be empty or more than 1,000 letters"),

    body("body")
        .trim()
        .isLength({ min: 1, max: 10000 })
        .escape()
        .withMessage("Content should not be empty or more than 10,000 letters"),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const post = new Posts({
            title: req.body.title,
            body: req.body.body,
            published: req.body.published,
            _id: req.params.postid,
        });
        if (!errors.isEmpty()) 
            res.status(400).json({ post, errors: errors.array() });

        const postUpdate = await Posts.findByIdAndUpdate(req.params.postid, post, {});
        if (!postUpdate)
            res.sendStatus(404).json({message: 'Page not found!'});
        res.status(200).json(post);
    }),
];


exports.post_delete = asyncHandler(async(req,res) => {
    if (req.user){
        const post = await Posts.findByIdAndDelete(req.params.postid);
        if (!post)
            return res.sendStatus(404)
        return res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }

})