const BrandService = require("../services/BrandService");
const CateService = require("../services/CateService");
const ProductService = require("../services/ProductService");
const UserService = require("../services/UserService");
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");

class MeController{
    //[GET] /me/cart
    showCart(req, res, next){
        if(req.user){
            const arr = [
                BrandService.getAll(),
                CateService.getAll(),
            ]
            Promise.all(arr)
            .then(([navBrands, navCates])=>{
                res.render('me/cart', {
                    navBrands,
                    navCates
                });
            })
        }
        else{
            res.redirect("/account/register-login/");
        }
        
    }

    //[GET] /me/checkout
    checkout(req, res, next){
        if(req.user){
            const arr = [
                BrandService.getAll(),
                CateService.getAll(),
    
            ]
            Promise.all(arr)
            .then(([navBrands, navCates])=>{
                res.render('me/checkout', {
                    navBrands,
                    navCates
                });
            })
        }
        else{
            res.redirect("/account/register-login/");
        }
        
    }

    //[GET] /me/profile
    profile(req, res, next){
        if(req.user){
            const arr = [
                BrandService.getAll(),
                CateService.getAll(),
                ProductService.listByFeaturedLimit(4),
                UserService.getShipping(req.user.f_ID)
            ]
            Promise.all(arr)
            .then(([navBrands, navCates, featuredProducts, shipping])=>{
                const productLength=featuredProducts.length;
                let detailPromises=[];
        
                for (let i=0;i<productLength;i++){
                    detailPromises.push(ProductService.getImageLink(featuredProducts[i].proID));
                    detailPromises.push(ProductService.getProductDetail(featuredProducts[i].proID));
                    detailPromises.push(ProductService.getCateName(featuredProducts[i].catID))
                    detailPromises.push(ProductService.getBrandSlug(featuredProducts[i].brandID));
                    detailPromises.push(ProductService.getCateSlug(featuredProducts[i].catID));
                }
                //Chuẩn bị render
                Promise.all(detailPromises)
                .then(result=>{
                
                    for (let i=0;i<productLength;i++){
                        featuredProducts[i].image=result[i*5][0].proImage;
                        featuredProducts[i].detail=result[i*5+1];
                        featuredProducts[i].cate=result[i*5+2].catName;
                        featuredProducts[i].brandslug=result[i*5+3].brandSlug;
                        featuredProducts[i].cateslug=result[i*5+4].catSlug;
                        featuredProducts[i].genderslug=getGenderSlug(featuredProducts[i].sex)
                    }
                    console.log(req.user);

                    res.render('me/profile', {
                        navBrands,
                        navCates,
                        featuredProducts,
                        shipping,
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
        }
        else{
            res.redirect("/account/register-login");
        }
        
    }

    //[GET] /me/change-password
    changePassword(req, res, next){
        if(req.user){
            const arr = [
                BrandService.getAll(),
                CateService.getAll(),
    
            ]
            Promise.all(arr)
            .then(([navBrands, navCates])=>{
                res.render('me/change-password', {
                    navBrands,
                    navCates
                });
            })
        }
        else{
            res.redirect("/account/register-login/");
        }
       
    }
    //[GET] /me/order
    showOrder(req, res, next){
        if(req.user){
            const arr = [
                BrandService.getAll(),
                CateService.getAll(),
    
            ]
            Promise.all(arr)
            .then(([navBrands, navCates])=>{
                res.render('me/order', {
                    navBrands,
                    navCates
                });
            })
        }
        else{
            res.redirect("/account/register-login/");
        }
        
    }

     //[GET] /me/order/:id
    showOrderDetail(req, res, next){
        if(req.user){
            const arr = [
                BrandService.getAll(),
                CateService.getAll(),
            ]
            Promise.all(arr)
            .then(([navBrands, navCates])=>{
                res.render('me/order-detail', {
                    navBrands,
                    navCates
                });
            })
        }
        else{
            res.redirect("/account/register-login/");
        }
        
    }

    //[PUT] /me/updateInfo
    updateInfo(req, res, next){
        const userID = req.user.f_ID;
        const {
            firstname,
            lastname,
            address,
            phone,
            day,
            month,
            year,
            gender,
            shippingFirstname,
            shippingLastname,
            shippingPhone,
            ls_province,
            ls_district,
            ls_ward,
            shippingAddress
        } = req.body;
        Promise.all([
            UserService.updateUser(userID, firstname, lastname, address, phone, day, month, year, gender),
            UserService.getShipping(userID),
            
        ])
        .then(([result1, result2])=>{
            if(result2){
                UserService.updateShipping(userID, shippingFirstname, shippingLastname, shippingPhone, ls_province, ls_district, ls_ward, shippingAddress)
                .then(result=>{
                    res.redirect("back")
                })
                .catch(err=>{
                    console.log(err);
                    next();
                })
            }
            else{
                UserService.createShipping(userID, shippingFirstname, shippingLastname, shippingPhone, ls_province, ls_district, ls_ward, shippingAddress)
                .then(result=>{
                    res.redirect("back")
                }) 
                .catch(err=>{
                    console.log(err);
                    next();
                })
            }            
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }

    //[put] /me/updatePassword
    updatePassword(req, res, next){
        if(req.user){
            const {newPassword} = req.body;
            bcrypt.hash(newPassword, SALT_BCRYPT)
            .then(password=>{
                UserService.updatePassword(req.user.f_ID, password)
                .then(result=>{
                    res.redirect('/');
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
            res.redirect('/account/register-login');
        }
    }
}
function getGenderSlug(sex) {
	let gender="unisex";
	if (sex==1)
		gender="women";
	if (sex==0)
		gender="men";
	return gender;
}
module.exports = new MeController;