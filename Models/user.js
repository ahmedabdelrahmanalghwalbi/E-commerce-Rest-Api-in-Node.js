const mongoose = require("mongoose");
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required:true
    },
    password: {
        type: String,
        required:true
    }
}));

function validateUser(user) {
    
    const schema = Joi.object({ 
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validateAsync(user);
}

exports.User =User;
exports.validate = validateUser;