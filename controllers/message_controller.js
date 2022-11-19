require('dotenv')
const UserSchema = require('../models/user')
const MessageSchema = require('../models/message')
const { body, validationResult } = require('express-validator');
const async = require('async')

exports.message_post = [
    body('message')
    .escape()
    .isLength({min:5,max:500})
    .withMessage('Verifique a quantidade de caracteres na mensagem (entre 5 e 500 caracteres)'),
    function (req,res,next) {
        const errors = validationResult(req)
        if (errors.array().length==0 && req.isAuthenticated()){
            Message = new MessageSchema({
                user:req.user._id,
                title:req.body.title,
                message:req.body.message
            })
            Message.save((err)=>{
                if (err){
                    return next(err)
                }
                return res.redirect('/home')
            })
        } else if (req.isAuthenticated()){
            return res.render('home_hero',{
                user:req.user,
                errors:errors.array(),
                title:'Clube do Bolinhaaa'
            })
        }else{
            return res.redirect('/login')
        }
    }
]

exports.message_delete = (req,res,next)=>{
    MessageSchema.findByIdAndDelete(req.params.messageId,(err)=>{
        if (err){
            return next(err)
        }
        res.redirect('/home')
    })
}