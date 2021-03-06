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
<<<<<<< HEAD
            console.log("Redirect: ", req.session.redirectTo);
            var redirectTo = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            console.log("Redirect: ", req.session.redirectTo);
            res.redirect(redirectTo);
=======
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
>>>>>>> 726a29724d010d3a6f76727b87be8883e0178fdf
        }else{
            res.redirect("back");
        }
    }

<<<<<<< HEAD
=======
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

>>>>>>> 726a29724d010d3a6f76727b87be8883e0178fdf
    logout(req, res, next){
        res.clearCookie('remember_me');
        req.logout();
        res.redirect('/');
    }

}

module.exports = new AccountController;