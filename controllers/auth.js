const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

exports.signUp_get = (req, res) => {
    res.sendStatus(200);
};

exports.signUp_post = [
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Enter a username")
        // Creating a custom validator to check whether username is already taken
        .custom(async (value, req, next) => {
            const username = await User.exists({ username: value });
            // if username is already taken, throw error
            if (username) {
                throw new Error("User already exists");
            };
        }),

    body("password")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Enter a Password"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const user = new User({
            username: req.body.username,
            password: '',
        });

        // Hashing the password with salt using bcrypt library
        bcrypt.hash(req.body.password, 15, async (err, hashedPassword) => {
            if (err)
                next(err);
            else {
                try {
                    if (!errors.isEmpty()) {
                        // If there are errors in input, send status 422 along with the correct input and list of errors
                        res.status(422).json({ user, errors: errors.array() });
                        return;
                    } else {
                        user.password = hashedPassword;
                        // If no errors, save the user in the database
                        await user.save();
                        res.json(user).redirect('/signup')
                    }
                } catch (err) {
                    return next(err);
                };
            };
        });
    }),
];

exports.login_post = [
    body("username", "Enter a username")
    .trim().isLength({min:1})
    .escape(),
    body("password").escape(),

    asyncHandler(async (req, res) => {
        //  Authenticate user 
        // Checking whether username is correct
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            throw new Error(`Username not found`);
        };
        // Checking whether password is correct
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match){
            throw new Error(`Incorrect Password`);
        };

        // After authenticating user, we generate a token and send it as a json file
        const jwtUser = {name: req.body.username};
        const token = jwt.sign(jwtUser, secretKey);
        res.json({token});
    }),
];