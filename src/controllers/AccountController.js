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
                    console.log(password);
                   bcrypt.hash(password, SALT_BCRYPT)
                    .then(hashResult=>{
                        console.log(hashResult);
                        UserService.createUser({firstname, lastname, username, email, password: hashResult})
                        .then(result=>{
                            res.redirect('/me/profile');
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
    }

    login(req, res, next){
        if(req.user){
            res.redirect("/me/change-password");
        }else{
            res.redirect("back");
        }
    }

    logout(req, res, next){
        res.clearCookie('remember_me');
        req.logout();
        res.redirect('/');
    }

}

module.exports = new AccountController;