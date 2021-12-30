const BrandService = require("../services/BrandService");
const CateService = require("../services/CateService");
const ProductService = require("../services/ProductService");
const UserService = require("../services/UserService");
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");
const Utility = require("../util/Utility");


class MeController{
    //[GET] /me/cart
    showCart(req, res, next){
        if(req.user){
            const arr = [
                BrandService.getAll(),
                CateService.getAll(),
                UserService.getUserCart(req.user.f_ID)
            ]
            Promise.all(arr)
            .then(([navBrands, navCates, cart])=>{
                let productPromises = cart.map((item)=>{
                    return ProductService.findProduct(item.proID)
                })
                Promise.all(productPromises)
                .then(products=>{
                    let productLength = products.length;
                    let detailPromises=[];
                    for (let i=0;i<productLength;i++){
                        detailPromises.push(ProductService.getImageLink(products[i].proID));
                        detailPromises.push(ProductService.getDetail(cart[i].detailID));
                        detailPromises.push(ProductService.getCateName(products[i].catID))
                        detailPromises.push(ProductService.getBrandSlug(products[i].brandID));
                        detailPromises.push(ProductService.getCateSlug(products[i].catID));
                        detailPromises.push(ProductService.countRatingProduct(products[i].proID));
                        detailPromises.push(ProductService.sumRatingProduct(products[i].proID));
                    }
                    Promise.all(detailPromises)
                    .then((result)=>{
                        for (let i=0;i<productLength;i++){
                            products[i].cartID = cart[i].cartID;
                            products[i].quantity = cart[i].quantity;
                            products[i].image=result[i*7][0].proImage;
                            products[i].detail=result[i*7+1];
                            products[i].cate=result[i*7+2].catName;
                            products[i].brandslug=result[i*7+3].brandSlug;
                            products[i].cateslug=result[i*7+4].catSlug;
                            products[i].star=Math.floor(result[i*7+6]/result[i*7+5]);
                            products[i].starLeft=5 - Math.floor(result[i*7+6]/result[i*7+5]);
                            products[i].genderslug=getGenderSlug(products[i].sex)
                        }
                        res.render('me/cart', {
                            navBrands,
                            navCates,
                            products
                        });
                    }).catch(err=>{
                        console.log(err);
                        next();
                    })
                }).catch(err=>{
                    console.log(err);
                    next();
                })
            }).catch(err=>{
                console.log(err);
                next();
            })
        }
        else{
            res.redirect("/account/register-login/");
        }
        
    }

    //[get] /me/checkout
    checkout(req, res, next){
        if(req.user){
            let {products} = req.query;
            if(products){
                const arr = products.map(cartID=>{
                    return UserService.getCart(cartID);
                })
                Promise.all(arr)
                .then(carts=>{
                    const proID = carts.map(cart=>{
                        return cart.proID;
                    })
                    const detailID = carts.map(cart=>{
                        return cart.detailID;
                    })
                    const quantity = carts.map(cart=>{
                        return cart.quantity;
                    })
                    const n = proID.length;
                    const productPromise = [];
                    const detailPromise = [];
                    for(let i = 0 ; i < n ;i++){
                        productPromise.push(ProductService.itemProduct(proID[i]));
                        detailPromise.push(ProductService.getDetail(detailID[i]));
                    }
                    const arr = [
                        BrandService.getAll(),
                        CateService.getAll(),
                        Promise.all(productPromise),
                        Promise.all(detailPromise)
                    ]
                    Promise.all(arr)
                    .then(([navBrands, navCates, products, details])=>{
                        
                        const catePromise = products.map(item=>{
                            return ProductService.getCateName(item.catID);
                        })
                        Promise.all(catePromise)
                        .then(cates=>{
                            const n = products.length;
                            let totalOrder = 0;
                            for(let i = 0 ; i < n ;i++){
                                products[i].catName = cates[i].catName;
                                products[i].color = details[i].color;
                                products[i].quantity = quantity[i];
                                products[i].totalPrice =  products[i].price*quantity[i];
                                totalOrder+=products[i].totalPrice;
                            }
                            console.log(products);
                            res.render('me/checkout', {
                                navBrands,
                                navCates,
                                products,
                                totalOrder
                            })
                        })
                       
                    })
                    .catch(err=>{
                        console.log(err);
                        next(err);
                    })
                })
                .catch(err=>{
                    console.log(err);
                    next(err);
                })
            }else{
                let {proID, detailID, quantity} = req.query;
                proID = Utility.convertStringToArray(proID);
                detailID = Utility.convertStringToArray(detailID);
                quantity = Utility.convertStringToArray(quantity);
                const n = proID.length;
                const productPromise = [];
                const detailPromise = [];
                for(let i = 0 ; i < n ;i++){
                    proID[i] = parseInt(proID[i]);
                    detailID[i] = parseInt(detailID[i]);
                    quantity[i] = parseInt(quantity[i]);
                    productPromise.push(ProductService.itemProduct(proID[i]));
                    detailPromise.push(ProductService.getDetail(detailID[i]));
                }
                const arr = [
                    BrandService.getAll(),
                    CateService.getAll(),
                    Promise.all(productPromise),
                    Promise.all(detailPromise)
                ]
                Promise.all(arr)
                .then(([navBrands, navCates, products, details])=>{
                    
                    const catePromise = products.map(item=>{
                        return ProductService.getCateName(item.catID);
                    })
                    Promise.all(catePromise)
                    .then(cates=>{
                        const n = products.length;
                        let totalOrder = 0;
                        for(let i = 0 ; i < n ;i++){
                            products[i].catName = cates[i].catName;
                            products[i].color = details[i].color;
                            products[i].quantity = quantity[i];
                            products[i].totalPrice =  products[i].price*quantity[i];
                            totalOrder+=products[i].totalPrice;
                        }
                        console.log(products);
                        res.render('me/checkout', {
                            navBrands,
                            navCates,
                            products,
                            totalOrder
                        })
                    })
                   
                })
                .catch(err=>{
                    console.log(err);
                    next(err);
                })
            }
        }
        else{
            res.redirect("/account/register-login/");
        }
        
    }

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
            const {oldPassword} = req.body;
            bcrypt.compare(oldPassword, req.user.f_password)
            .then(result=>{
                if(result){
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
                    const arr = [
                        BrandService.getAll(),
                        CateService.getAll(),
                    ]
                    Promise.all(arr)
                    .then(([navBrands, navCates])=>{
                        res.render('me/change-password', {
                            navBrands,
                            navCates,
                            message: "Incorrect password"
                        });
                    })
                }
            })
           
        }else{
            res.redirect('/account/register-login');
        }
    }

    updateCartQuantity(req,res,next){
        let {cartID, quantity} = req.body;
        UserService.getCart(cartID)
        .then(cart=>{
            ProductService.getDetail(cart.detailID)
            .then(detail=>{
                quantity = parseInt(quantity);
                if(quantity > detail.quantity){
                    res.status(200).json({
                        cartID,
                        quantity: detail.quantity,
                        isOverflow: true
                    })
                }else{
                    UserService.updateProductCartQuantity(cartID, quantity)
                    .then(result=>{
                        res.status(200).json({cartID, quantity});
                    }).catch(err=>{
                        console.log(err);
                        next(err);
                    })
                }
            }).catch(err=>{
                console.log(err);
                next(err);
            })
        }).catch(err=>{
            console.log(err);
            next(err);
        })
        
    }

    addToCart(req,res,next){
        console.log(req.body);
        const userId = req.user.f_ID;
        const {productID, detailID, quantity} = req.body;
        UserService.addCart(userId, productID, quantity, detailID)
        .then(result=>{
            res.status(200).json(result);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({msg: "Bad request"});
        })
        
    }

    getCartHeader(req,res,next){
        UserService.getUserCartLastest(req.user.f_ID)
        .then(cart=>{
            let productPromises = cart.map((item)=>{
                return ProductService.findProduct(item.proID)
            });
            Promise.all(productPromises)
            .then(products=>{
                let productLength = products.length;
                let detailPromises=[];
                for (let i=0;i<productLength;i++){
                    detailPromises.push(ProductService.getImageLink(products[i].proID));
                    detailPromises.push(ProductService.getDetail(cart[i].detailID));
                    detailPromises.push(ProductService.getCateName(products[i].catID))
                    detailPromises.push(ProductService.getBrandSlug(products[i].brandID));
                    detailPromises.push(ProductService.getCateSlug(products[i].catID));
                    detailPromises.push(ProductService.countRatingProduct(products[i].proID));
                    detailPromises.push(ProductService.sumRatingProduct(products[i].proID));
                }
                Promise.all(detailPromises)
                .then((result)=>{
                    for (let i=0;i<productLength;i++){
                        products[i].cartID = cart[i].cartID;
                        products[i].quantity = cart[i].quantity;
                        products[i].image=result[i*7][0].proImage;
                        products[i].detail=result[i*7+1];
                        products[i].cate=result[i*7+2].catName;
                        products[i].brandslug=result[i*7+3].brandSlug;
                        products[i].cateslug=result[i*7+4].catSlug;
                        products[i].star=Math.floor(result[i*7+6]/result[i*7+5]);
                        products[i].starLeft=5 - Math.floor(result[i*7+6]/result[i*7+5]);
                        products[i].genderslug=getGenderSlug(products[i].sex)
                    }
                    res.status(200).json(products);
                }).catch(err=>{
                    console.log(err);
                    // next();
                    res.status(500).json({msg:'error'});
                })
            }).catch(err=>{
                console.log(err);
                res.status(500).json({msg:'error'});
            })
        })
    }

    deleteCart(req, res, next){
        let {cartID} = req.body;
        cartID = parseInt(cartID);
        UserService.deleteCart(cartID)
        .then(result=>{
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({msg: 'Bad request'});
        });
        
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