const {models} = require('../models');
const Util = require('../util/Utility');
const { Op } = require("sequelize");
class ProductService{

	list(limit, page, name, brandIDs, catIDs, genderIDs, price, sort){
      
        const arrPro = [
            models.brand.findAll({
                attributes: ['brandID']
            }),
            models.category.findAll({
                attributes: ['catID']
            })
        ]
        return Promise.all(arrPro)
            .then(([brandIDList, catIDList])=>{
            
                if(brandIDs.length < 1){
                    brandIDs=brandIDList.map(brand=>{
                        return brand.dataValues.brandID
                    })
                }
                if(catIDs.length < 1){
                    catIDs=catIDList.map(cat=>{
                        return cat.dataValues.catID
                    })
                }
                if(genderIDs.length < 1){
                    genderIDs = [0,1,2];
                }
                if(price.length < 1){
                    price[0] = 1;
                    price[1] = 200;
                }
                let minPrice = price[0];
                let maxPrice = price[1];
                
                let n = brandIDs.length;
                for(let i = 0 ; i< n ; i++){
                    brandIDs[i] = parseInt(brandIDs[i])
                }
                n = catIDs.length;
                for(let i = 0 ; i< n ; i++){
                    catIDs[i] = parseInt(catIDs[i])
                }
                n = genderIDs.length;
                for(let i = 0 ; i< n ; i++){
                    genderIDs[i] = parseInt(genderIDs[i])
                }
                if(name && name.length > 0){
                    switch (sort) {
                        case 1:
                            return models.product.findAll({
                                offset: (page - 1)*limit, 
                                limit: limit, 
                                raw:true,
                                where:{
                                    brandID: brandIDs,
                                    catID: catIDs,
                                    sex: genderIDs,
                                    proName:{
                                        [Op.substring]:name
                                    },
                                    price:{
                                        [Op.gte]:minPrice
                                    },
                                    price:{
                                        [Op.lte]:maxPrice
                                    }
                                },
                                order:[
                                    ['price','DESC']
                                ]
                            });
                        case 2:
                            return models.product.findAll({
                                offset: (page - 1)*limit, 
                                limit: limit, 
                                raw:true,
                                where:{
                                    brandID: brandIDs,
                                    catID: catIDs,
                                    sex: genderIDs,
                                    proName:{
                                        [Op.substring]:name
                                    },
                                    price:{
                                        [Op.gte]:minPrice
                                    },
                                    price:{
                                        [Op.lte]:maxPrice
                                    }
                                },
                                order:[
                                    ['price','ASC']
                                ]
                                
                            });
                        default:
                            return models.product.findAll({
                                offset: (page - 1)*limit, 
                                limit: limit, 
                                raw:true,
                                where:{
                                    brandID: brandIDs,
                                    catID: catIDs,
                                    sex: genderIDs,
                                    proName:{
                                        [Op.substring]:name
                                    },
                                    price:{
                                        [Op.gte]:minPrice
                                    },
                                    price:{
                                        [Op.lte]:maxPrice
                                    }
                                }
                            });
                    }
                }else{
                    switch (sort) {
                        case "1":
                            console.log("here 1")
                            return models.product.findAll({
                                offset: (page - 1)*limit, 
                                limit: limit, 
                                raw:true,
                                where:{
                                    brandID: brandIDs,
                                    catID: catIDs,
                                    sex: genderIDs,
                                    price:{
                                        [Op.gte]:minPrice
                                    },
                                    price:{
                                        [Op.lte]:maxPrice
                                    }
                                },
                                order:[
                                    ['price','DESC']
                                ]
                            });
                        case "2":
                            console.log("here 2")
                            return models.product.findAll({
                                offset: (page - 1)*limit, 
                                limit: limit, 
                                raw:true,
                                where:{
                                    brandID: brandIDs,
                                    catID: catIDs,
                                    sex: genderIDs,
                                    price:{
                                        [Op.gte]:minPrice
                                    },
                                    price:{
                                        [Op.lte]:maxPrice
                                    }
                                },
                                order:[
                                    ['price','ASC']
                                ]
                                
                            });
                        default:
                            console.log("here 0")
                            return models.product.findAll({
                                offset: (page - 1)*limit, 
                                limit: limit, 
                                raw:true,
                                where:{
                                    brandID: brandIDs,
                                    catID: catIDs,
                                    sex: genderIDs,
                                    price:{
                                        [Op.gte]:minPrice
                                    },
                                    price:{
                                        [Op.lte]:maxPrice
                                    }
                                }
                            });
                    }
                }
            })
        
    }

    getProductTotal(name, brandIDs, catIDs, genderIDs, price){
        const arrPro = [
            models.brand.findAll({
                attributes: ['brandID']
            }),
            models.category.findAll({
                attributes: ['catID']
            })
        ]
        return Promise.all(arrPro)
            .then(([brandIDList, catIDList])=>{
                if(brandIDs.length < 1){
                    brandIDs=brandIDList.map(brand=>{
                        return brand.dataValues.brandID
                    })
                }
                if(catIDs.length < 1){
                    catIDs=catIDList.map(cat=>{
                        return cat.dataValues.catID
                    })
                }
                if(genderIDs.length < 1){
                    genderIDs = [0,1,2];
                }
                if(price.length < 1){
                    price[0] = 0;
                    price[1] = 200;
                }
                let minPrice = price[0];
                let maxPrice = price[1];
                if(name){
                    return models.product.count({
                        raw:true,
                        where:{
                            brandID: brandIDs,
                            catID: catIDs,
                            sex: genderIDs,
                            proName:{
                                [Op.substring]:name
                            },
                            price:{
                                [Op.gte]:minPrice
                            },
                            price:{
                                [Op.lte]:maxPrice
                            }
                        }
                    });
                }
                else{
                    return models.product.count({
                        raw:true,
                        where:{
                            brandID: brandIDs,
                            catID: catIDs,
                            sex: genderIDs,
                            price:{
                                [Op.gte]:minPrice
                            },
                            price:{
                                [Op.lte]:maxPrice
                            }
                        }
                    });
                }
                
            })
     
    }

    itemProduct(id){
        return models.product.findOne({
            raw:true,
            where:{
                proID: id
            }
        });
    }

    getProductDetail(id){
        return models.detail.findAll({
            raw:true,
            where:{
                proID: id,
            }
        })
    }

    getImageLink(id){
        return models.imagelink.findAll(
			{attributes: ['proImage'],
			where: {proID:id}, raw:true})
    }

    reviewsItemProduct(id, limit, page){
        return models.comment.findAll({
            raw:true,
            offset: (page - 1)*limit, 
            limit: limit,
            where:{
                proID: id
            },
            order:[
                ['createdAt', 'DESC']
            ]
        });
    }

    countProductReview(id){
        return models.comment.count({
            where:{
                proID:id
            }
        })
    }

    countRatingProduct(id){
        return models.comment.count({
            raw:true,
            where:{
                proID: id
            }
        });
    }

    sumRatingProduct(id){
        return models.comment.sum('rate', {
            raw:true,
            where:{
                proID: id
            }
        });
    }

    getCateName(id){
        return models.category.findOne({
            raw:true,
            where: {
                catID: id,
            }
        })
    }

    getBrandName(id){
        return models.brand.findOne({
            raw:true,
            where: {
                brandID: id,
            }
        })
    }

    listByGender(limit, page, gender){
        return models.product.findAll({
            offset: (page - 1)*limit, 
            limit: limit, 
            raw:true,
            where:{
                sex: gender,
            }
        });
    }
    
    getProductTotalGender(gender){
        return models.product.count({
            where: {
                sex: gender
            }
        });
    }
        
    listByBrand(limit, page, brand){
        return models.product.findAll({
            offset: (page - 1)*limit, 
            limit: limit, 
             raw:true,
            where:{
                 brandID: brand,
            }
        });
    }


    getProductTotalBrand(id){
        return models.product.count({
            where: {
                 brandID: id,
            }
        });
    }
    

    getBrandID(name){
        return models.brand.findOne({
            raw:true,
            attributes: ['brandID'],
            where: {
                brandSlug: name,
            }
        })
    }

    getCateID(name){
        return models.category.findOne({
            raw:true,
            attributes: ['CatID'],
            where: {
                catSlug: name,
            }
        })
    }

    listByCate(limit, page, cate){
        return models.product.findAll({
            offset: (page - 1)*limit, 
            limit: limit, 
             raw:true,
            where:{
                 CatID: cate,
            }
        });
    }


    getProductTotalCate(id){
        return models.product.count({
            where: {
                 catID: id,
            }
        });
    }

    listByFeatured(){
        return models.product.findAll({
            raw:true,
            where:{
                isFeature: 1,
            }
        })
    }

    listByRelated(brand, cate, gender){
        return models.product.findAll({
            limit: 3,
            raw:true,
            where:{
                sex: gender,
                brandID: brand,
                catID: cate
            }
        })
    }

    getBrandSlug(id){
        return models.brand.findOne({
            raw:true,
            attributes: ['brandSlug'],
            where: {
                brandID: id
            }
        })
    }

    getCateSlug(id){
        return models.category.findOne({
            raw:true,
            attributes: ['catSlug'],
            where: {
                catID: id
            }
        })
    }
    

    listByFeaturedLimit(amount){
        return models.product.findAll({
            raw:true,
            limit: amount,
            where:{    
                isFeature: 1,
            }
        })
    }

    listAll(){
        return models.product.findAll({
            raw:true,
            order: [
                ['sold', 'DESC'],
            ]
        })
    }

    countRatingProduct(id){
        return models.comment.count({
            raw:true,
            where:{
                proID: id
            }
        });
    }

    sumRatingProduct(id){
        return models.comment.sum('rate', {
            raw:true,
            where:{
                proID: id
            }
        });
    }

    findProduct(id){
        return models.product.findOne({
            raw: true,
            where:{
                proID: id
            }
        })
    }

    getDetail(detailID){
        return models.detail.findOne({
            raw:true,
            where:{
                detailID: detailID
            }
        })
    }

    updateViews(proID){
        return models.product.increment({
            views: 1
        }, {
            where:{
                proID: proID
            }
        })
    }
}

module.exports = new ProductService;