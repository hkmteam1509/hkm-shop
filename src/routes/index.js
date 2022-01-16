const accountRouter = require('./account');
const siteRouter = require('./site');
// const productsRouter = require('./products');
const meRouter = require('./me');
const shopRouter = require('./shop');
const BrandService = require('../services/BrandService');
const CateService = require('../services/CateService');

function route(app){
    app.use('/me',function(req, res, next){
        if(req.user){
            next();
        }
        else{
<<<<<<< HEAD
            if(!req.session.redirectTo){
=======
            if(!req.session.redirectTo && req.method === 'GET' && req.originalUrl.indexOf("api") < 0 && req.originalUrl.indexOf("filter") < 0){
>>>>>>> 726a29724d010d3a6f76727b87be8883e0178fdf
                req.session.redirectTo = req.originalUrl;
            }
            res.redirect('/account/register-login')
        }
    }, meRouter);
    app.use('/shop',function(req,res,next){
        if(req.user){
            next();
        }
        else{
            req.session.redirectTo = req.originalUrl;
            next();
        }
    }, shopRouter);
    app.use('/account', accountRouter);
    app.use('/', siteRouter);
    app.use(function (req, res, next) {
        res.status(404);
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('404', {
                navBrands,
                navCates
            });
        })
    });
}

module.exports = route;
