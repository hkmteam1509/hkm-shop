const express = require("express");
const IsEmail = require("isemail");
const BrandService = require("../services/BrandService");
const CateService = require("../services/CateService");
const UserService = require("../services/UserService");
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");

class AccountController{
    //[GET] /register-login
    registerLogin(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),
        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('register-login', {
                navBrands,
                navCates,
                message: req.flash('error'),
            });
        })
    }

    //[GET] /forgot-password
    forgotPassword(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('forgot-password', {
                navBrands,
                navCates
            });
        })
    }

      //[GET] /verification-code
    verificationCode(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('verification-code', {
                navBrands,
                navCates
            });
        })
    }


     //[GET] /new-password
     newPassword(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('new-password', {
                navBrands,
                navCates
            });
        })
    }

     //[GET] /register-success
     registerSuccess(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('register-success', {
                navBrands,
                navCates
            });
        })
    }

    //[POST] /register
    register(req, res, next){
        // res.send(req.body);
        if(req.body){
            const {firstname, lastname, username, email, password, confirmPassword} = req.body;
            UserService.findAccount(username)
            .then(result=>{
                if(result){
                    res.render("register-login",{
                        errorCode: 1,
                        lastname,
                        firstname,
                        username,
                        email,
                        password,
                        confirmPassword,
                    })
                }
                else{
                    if(IsEmail.validate(email)){
                    bcrypt.hash(password, SALT_BCRYPT)
                        .then(hashResult=>{
                            UserService.createUser({firstname, lastname, username, email, password: hashResult})
                            .then(result=>{
                                //res.redirect('/me/profile');
                                req.login(result, function(err) {
                                    if (err) { return next(err); }
                                    return res.redirect('/me/profile');
                                });
                            })
                            .catch(err=>{
                                console.log(err);
                                next();
                            })
                        })
                        .catch(err=>{
                            console.log(err);
                            next();
                        })
                        
                    }else{
                        res.render("register-login",{
                            lastname,
                            firstname,
                            username,
                            email,
                            password,
                            confirmPassword,
                            errorCode: 2
                        })
                    }
                }
            })
            .catch(err=>{
                console.log(err);
                next();
            })
        }else{
            next();
        }
    }

    login(req, res, next){
        if(req.user){
            let permission = req.user.f_permission;
            if (permission === -1)
            {
                req.logout();
                res.redirect("blocked");
            }
            else
            {
                var redirectTo = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                res.redirect(redirectTo);
            }
        }else{
            res.redirect("back");
        }
    }

    blockedGuest(req, res, next){
        if(req.user){
            next();
            return;
        }
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),
        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('blocked', {
                navBrands,
                navCates
            });
        })
    }

    logout(req, res, next){
        res.clearCookie('remember_me');
        req.session.redirectTo = null;
        req.logout();
        res.redirect('/');
    }

    checkUsername(req, res, next){
        const {username, email} = req.body;
        UserService.findAccount(username)
        .then(result=>{
            if(IsEmail.validate(email)){
                if(result){
                    res.status(200).json({isExisted: true, isInvalidEmail: false});
                }else{
                    res.status(200).json({isExisted: false, isInvalidEmail: false});
                }
            }else{
                if(result){
                    res.status(200).json({isExisted: true, isInvalidEmail: true});
                }else{
                    res.status(200).json({isExisted: false, isInvalidEmail: true});
                }
            }
            
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({msg: err.message});
        })
    }
}

module.exports = new AccountController;