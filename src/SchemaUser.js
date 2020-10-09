const Joi = require('joi')

const userSchema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().required(),
    repeat_password: Joi.ref('password'),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).
        required(),
    address: Joi.string().required()
})



module.exports = { userSchema }