require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const handlebars  = require('express-handlebars');
const route = require('./routes');
const session = require('express-session');
const passport = require('./auth/passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();
const port = 3000;


// view engine setup
app.engine('.hbs', 
	handlebars({
		extname: '.hbs',
		helpers:{
			isInArr: function(item, arr, options) {
				if(arr.includes(item)) {
					console.log("helper:",true)
				  return options.fn(this);
				}
				return options.inverse(this);
			},
			isBigger: function(v1, v2, options) {
				if(v1 > v2) {
				  return options.fn(this);
				}
				return options.inverse(this);
			},
			isEqual: function(v1, v2, options) {
				if(v1 === v2) {
				  return options.fn(this);
				}
				return options.inverse(this);
			}
		}
	
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Middleware

//Dùng để in mấy cái connect lên terminal 
//app.use(logger('dev'));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SECRET_SESSION, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
	res.locals.user = req.user
	next();
})
route(app);


app.listen(process.env.PORT || port, () => {
	console.log(`Example app listening at http://localhost:${process.env.PORT || port}`);
});
