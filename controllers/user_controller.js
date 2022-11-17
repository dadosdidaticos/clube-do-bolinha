require('dotenv')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt')
const UserSchema = require('../models/user')
const { body, validationResult } = require('express-validator');

passport.use(new LocalStrategy (
    (username,password,done)=>{
        UserSchema.findOne({username:username},(err, user)=>{
            if (err){
                return done(err)
            }
            if (!user){
                return done(null,false,{message:"Usuário não encontrado"})
            }
            bcrypt.compare(password,user.password,(err,res)=>{
                if (res) {
                    return done(null, user)
                }
                return done(null, false,{message:"Senha incorreta"})
            })
        })
    })
)
passport.serializeUser(function(user, done) {
    done(null, user.id);
  }),
  passport.deserializeUser(function(id, done) {
    UserSchema.findById(id, function(err, user) {
        done(err, user);
    });
  }),

exports.local_authentication = [
        passport.authenticate('local',{
            successRedirect:'/home',
            failureRedirect: '/login',
            failureMessage:true
        }),
        (req,res,next) => {
            return res.render('index',{
                user:req.user,
                title:"Clube do Bolinha"
            })
        }
]

exports.user_logout = (req,res,next)=>{
    req.logout((err)=>{
        if (err) {
            return next(err)
        }
        res.render('login',{
            title:'Entrar no Clube',
            messages:'Você foi deslogado com sucesso.'
        })
    })
}

exports.login_get = (req,res,next)=>{
    if (!req.user && req.session.messages){
        return res.render('login', {
            title: 'Entre no Clube',
            messages:req.session.messages ? req.session.messages[req.session.messages.length-1] : undefined,
            user:req.user
        })
    }
    if (!req.user){
        return res.render('login', {
            title: 'Entre no Clube',
        }) 
    }
}
exports.root_get = (req,res,next)=>{
    res.render('index', {
        title: 'Clube do Bolinha', 
        user:req.user
    })
}

exports.membership = (req,res,next)=>{
    if(req.body.password === process.env.CLUB_PASS){
        UserSchema.findByIdAndUpdate(
            req.user._id,
            {membership_status:true}, (err)=>{
                if(err){
                    return next(err);
                };
                res.redirect('/home')
            }
        )
    }else{
        res.render('home_hero',{
            title:'Início',
            user:req.user,
            msg:'A senha está incorreta. Tente novamente.'
        })
    }
}

exports.home_get = (req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/')
    }
    UserSchema.findById(req.user._id,(err,user)=>{
        if(req.isAuthenticated() && user.membership_status===false){
            return res.render('home_hero',{
                title:'Início',
                user:req.user,
            })
        }
        if(req.isAuthenticated() && user.membership_status===true){
            //carregar mensagens aqui depois
            return res.render('home_hero',{
                title:'Início',
                user:req.user,
            })
        }
    })
}

exports.create_user = [
    body(['first_name','last_name','username','password','password_confirm'])
        .exists({checkFalsy:true})
        .withMessage('Preencha os campos em branco'),
    body('password')
        .isStrongPassword()
        .withMessage('As senhas devem ter mínimo de 8 caracteres, devem conter pelo menos 1 caracter maiúsculo e 1 minúsculo e devem conter pelo menos 1 símbolo')
        .bail()
        .custom((value,{req})=>{
            if (value !== req.body.password_confirm) {
                throw new Error('As senhas devem ser iguais')
            }
            return true
        }),
    body('username')
        .escape()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('E-mail inválido'),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('register',{
                title:'Entre no Clube',
                success:false,
                errors:errors.array()
            })
        }
        bcrypt.hash(req.body.password,10,(err,hashedPassword)=>{
            if(err){
                return next(err)
            }
            User = new UserSchema({
                username: req.body.username,
                password: hashedPassword,
                first_name:req.body.first_name,
                last_name:req.body.last_name
            })
            User.save((err)=>{
                if (err){
                    return next(err);
                }
                //MUDAR DEPOIS PARA REDIRECIONAR PARA RENDERIZAR A PÁG DE LOGIN COM A MSG DE VALIDAÇÃO
                res.render('register',{
                    title:'Entre no Clube',
                    success:true,
                    errors:[]})
            })
        })
    }
]