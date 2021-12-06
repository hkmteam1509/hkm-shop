const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.get("/logout", AccountController.logout);
router.post("/login", passport.authenticate('local',
    { 
        successRedirect: '/',
        failureRedirect: '/account/register-login',
        failureFlash: true 
    }),function(req, res, next) {
        if (!req.body.remember_me) { return next(); }
        var token = utils.generateToken(64);
        Token.save(token, { userId: req.user.id }, function(err) {
          if (err) { return done(err); }
          res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
          return next();
        });
      }, AccountController.login);
router.post("/register", AccountController.register)
router.get('/register-login', AccountController.registerLogin);
router.get('/forgot-password', AccountController.forgotPassword);
router.get('/verification-code', AccountController.verificationCode);
router.get('/new-password', AccountController.newPassword);
router.get('/register-success', AccountController.registerSuccess);
module.exports = router;
