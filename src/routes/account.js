const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.get("/logout", AccountController.logout);
router.post("/login", passport.authenticate('local',
    { 
        failureRedirect: '/account/register-login',
        failureFlash: true 
    }), AccountController.login);
router.post("/register", AccountController.register)
router.get('/register-login', AccountController.registerLogin);
router.get('/forgot-password', AccountController.forgotPassword);
router.get('/verification-code', AccountController.verificationCode);
router.get('/new-password', AccountController.newPassword);
router.get('/register-success', AccountController.registerSuccess);
router.get('/blocked', AccountController.blockedGuest);
module.exports = router;
