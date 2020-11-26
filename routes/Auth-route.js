const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { User, validate } = require('../Models/user');
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");

//Register router
router.post('/register', async(req, res, next) => {
    try {
        //joi validation.
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //ensure that user has been register before or not.
        let doseUserExist = await User.findOne({ "email": req.body.email });
        if (doseUserExist) return res.status(400).send(`this Email has been registered`);
        //register the user after the validation
        const newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        const savedUser = await newUser.save();
        const SECRET_Key = "jwbsecretkey";
        const token = Jwt.sign({
            _id: newUser.id,
        },
            SECRET_Key,
            {
             expiresIn:"1h",
         }
        )
        res.send(token);
    } catch (error) {
        next(error);
    }
});

//Login router
router.post('/login', async (req, res, next) => {
    try {
        //joi validation.
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //ensure that user's email is valid or not.
        let validUser = await User.findOne({ "email": req.body.email });
        if (!validUser) return res.status(400).send(`Invalid email or password`);
        //ensure that user's password is valid or not.
        const validUserPassword = await bcrypt.compare(req.body.password, validUser.password);
        if (!validUserPassword) return res.status(400).send("Invalid email or password");
        const SECRET_Key = "jwbsecretkey";
        const token = Jwt.sign({
            _id: validUser.id,
        },
            SECRET_Key,
            {
             expiresIn:"1h",
         }
        )
        res.send(token);
    } catch (error) {
        next(error);
    } 
});


module.exports = router;