const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/UserService');


passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        UserService.findAccount(username, password)
        .then((user)=>{
            console.log(user);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!validPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
        .catch(err=>{
            return done(err); 
        })
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.f_ID);
});
  
passport.deserializeUser(function(id, done) {
    UserService.findByID(id)
    .then(user=>{
        done(null ,user);
    })
    .catch(err=>{
        done(err);
    })
});
function validPassword(user, password){
    return user.f_password === password;
}

module.exports = passport;