const Comments = require('../models/comments');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.comments_get = asyncHandler(async (req,res) => {
    const comments = await Comments.find({post: req.params.postid}).exec();
    res.json({comments});
});

exports.comments_post = [
    body('body', 'Type a comment')
    .trim()
    .isLength({min:1})
    .escape(),

    asyncHandler(async(req,res) => {
        const errors = validationResult(req);

        const comment = new Comments({
            body: req.body.body,
            date: Date.now(),
            post: req.params.postid,
        });
        if (!errors.isEmpty()){
            res.status(400).json({comment, errors: errors.array()});
            return;
        } else{
            await comment.save();
            res.json(comment);
        };
    }),
];

exports.comments_delete = asyncHandler(async(req,res) => {
    if (!req.user)
        res.sendStatus(401);
    else{
        const comment = await Comments.findByIdAndDelete(req.params.commentid);
        if (!comment)
            res.sendStatus(404);
        else    
            res.sendStatus(200);
    };
});