const BrandService = require("../services/BrandService");
const CateService = require("../services/CateService");
const ProductService = require("../services/ProductService");


class SiteController{

    //[GET] /
    index(req, res, next){
        let name=null;
        
        const productPromises=[
            ProductService.listByFeatured(),
        ]

        Promise.all(productPromises)
        .then(result=>{
            let products=result[0];

            //Lấy được product
            //Giờ lấy detail của cái product đó
            const productLength=products.length;
            let detailPromises=[];
    
            
           // console.log(products);
            for (let i=0;i<productLength;i++){
                detailPromises.push(ProductService.getImageLink(products[i].proID));
                detailPromises.push(ProductService.getProductDetail(products[i].proID));
                detailPromises.push(ProductService.getCateName(products[i].catID))
                detailPromises.push(ProductService.getBrandSlug(products[i].brandID));
                detailPromises.push(ProductService.getCateSlug(products[i].catID));
            }

            //Chuẩn bị render
            Promise.all(detailPromises)
            .then(result=>{
            
                for (let i=0;i<productLength;i++){
                    products[i].image=result[i*5][0].proImage;
                    products[i].detail=result[i*5+1];
                    products[i].cate=result[i*5+2].catName;
                    products[i].brandslug=result[i*5+3].brandSlug;
                    products[i].cateslug=result[i*5+4].catSlug;
                    products[i].genderslug=getGenderSlug(products[i].sex)
                }


                /// Lấy bét sell ITEM
                // lấy cái thanh featured bên sidebar
        
                const productPromises2=[
                    ProductService.listAll(),
                ]
            
                return Promise.all(productPromises2)
                .then(result2=>{
                    let products2=result2[0];
            
                    //Lấy được product
                    //Giờ lấy detail của cái product đó
                    const productLength2=products2.length;
                    let detailPromises2=[];
                    
                    for (let i=0;i<productLength2;i++){
                        detailPromises2.push(ProductService.getImageLink(products2[i].proID));
                        detailPromises2.push(ProductService.getProductDetail(products2[i].proID));
                        detailPromises2.push(ProductService.getCateName(products2[i].catID));
                        detailPromises2.push(ProductService.getBrandSlug(products2[i].brandID));
                        detailPromises2.push(ProductService.getCateSlug(products2[i].catID));
                    }
                
                    //Chuẩn bị render
                    return Promise.all(detailPromises2)
                    .then(result=>{
                
                        for (let i=0;i<productLength2;i++){
                            products2[i].image=result[i*5][0].proImage;
                            products2[i].detail=result[i*5+1];
                            products2[i].cate=result[i*5+2].catName;
                            products2[i].brandslug=result[i*5+3].brandSlug;
                            products2[i].cateslug=result[i*5+4].catSlug;
                            products2[i].genderslug=getGenderSlug(products2[i].sex)
                        }

                        const arr = [
                            BrandService.getAll(),
                            CateService.getAll(),
                
                        ]
                        Promise.all(arr)
                        .then(([navBrands, navCates])=>{
                            res.render('home', {
                                navBrands,
                                products2,
                                products,
                                navCates
                            });
                        })
                            
                    })
                    .catch(err=>{
                        console.log(err);
                    })
				})
				.catch(err=>{
					console.log(err);
				})


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
        // const arr = [
        //     BrandService.getAll(),
        //     CateService.getAll(),

        // ]
        // Promise.all(arr)
        // .then(([navBrands, navCates])=>{
        //     res.render('home', {
        //         navBrands,
        //         navCates
        //     });
        // })
        // BrandService.getAll()
        // .then(brands=>{
        //     res.render('home', {
        //         brands
        //     });

        // })
    }

    contact(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('contact', {
                navBrands,
                navCates
            });
        })
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


module.exports = new SiteController;