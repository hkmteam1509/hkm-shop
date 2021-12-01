const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.post("/login",  
    passport.authenticate('local'),
    function(req, res) {
        if(req.user){
            res.redirect("/");
        }else{
            res.redirect("/account/login");
        }
    });
router.get('/register-login', AccountController.registerLogin);
router.get('/forgot-password', AccountController.forgotPassword);
router.get('/verification-code', AccountController.verificationCode);
router.get('/new-password', AccountController.newPassword);
router.get('/register-success', AccountController.registerSuccess);
module.exports = router;
