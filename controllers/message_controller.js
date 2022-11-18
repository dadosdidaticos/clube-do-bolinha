require('dotenv')
const UserSchema = require('../models/user')
const MessageSchema = require('../models/message')
const { body, validationResult } = require('express-validator');
const async = require('async')

exports.message_post = [
    body('message')
    .isLength({min:5,max:500})
    .withMessage('Verifique a quantidade de caracteres na mensagem (entre 5 e 500 caracteres)'),
    function (req,res,next) {
        const errors = validationResult(req)
        if (errors.array().length==0 && req.isAuthenticated()){
            console.log(errors)
            Message = new MessageSchema({
                user:req.user._id,
                title:req.body.title,
                message:req.body.message
            })
            Message.save((err)=>{
                if (err){
                    return next(err)
                }
                return res.render('home_hero',{
                    user:req.user,
                    msg:'Mensagem enviada com sucesso',
                    title:'Clube do Bolinha'
                })
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