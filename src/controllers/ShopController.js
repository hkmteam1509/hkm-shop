const ProductService = require('../services/ProductService');
const CateService = require('../services/CateService');
const util = require('../util/Utility');
const product = require('../models/product');
const category = require('../models/category');
const { getDataSlug } = require('../util/Utility');
const BrandService = require('../services/BrandService');
const CommentService = require('../services/CommentService');
const comment = require('../models/comment');


let maximumPagination=5;
let currentPage=1;
let nextPage=1;
let prevPage=1;
let totalPage=1;
const itemPerPage=9;

const getShop = (req, res, next, brand, brandID, cat, catID, gender, genderID, link, hbs) =>{
	const pageNumber = req.query.page;
	let genderIDs = (req.query.genders) ? req.query.genders : [];
	let brandIDs = (req.query.brands) ? req.query.brands : [];
	let catIDs = (req.query.categories) ? req.query.categories : [];
	let prices = (req.query.prices) ? (req.query.prices) : [];
	let name = (req.query.search) ? req.query.search : "";
	let sort = (req.query.sort) ? req.query.sort : 0;
	console.log(req.query);
	if(brandID){
		brandIDs = [brandID];
	}
	brandIDs = [].concat(brandIDs ?? []);
	if(catID){
		catIDs = [catID];
	}
	catIDs = [].concat(catIDs ?? []);
	if(genderID){
		genderIDs = [genderID];
	}
	genderIDs = [].concat(genderIDs ?? []);
	prices = [].concat(prices ?? []);
	if(prices.length == 0){
		prices = [0];
	}
	currentPage =(pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
	currentPage = (currentPage > 0) ? currentPage : 1;
	currentPage = (currentPage <= totalPage) ? currentPage : totalPage;
	currentPage = (currentPage < 1) ? 1: currentPage;
	const productPromises=[
		ProductService.list(itemPerPage,currentPage, name, brandIDs, catIDs, genderIDs, prices, sort),
		ProductService.getProductTotal(name, brandIDs, catIDs, genderIDs, prices),
		ProductService.listByFeaturedLimit(4),
	]

	//đợi promises
	Promise.all(productPromises)
	.then(result=>{
		let products=result[0];
		const totalProduct=result[1];
		const featureProducts = result[2];
		//Lấy max số trang
		totalPage=Math.ceil(totalProduct/itemPerPage);

		let paginationArray = [];

		let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
		if(currentPage === 1){
			pageDisplace -= 1;
		}
		for(let i = 0 ; i < pageDisplace; i++){
			if(currentPage === 1){
				paginationArray.push({
					page: currentPage + i,
					isCurrent:  (currentPage + i)===currentPage
				});
			}
			else{
				paginationArray.push({
					page: currentPage + i - 1,
					isCurrent:  (currentPage + i - 1)===currentPage
				});
			}
		}
		if(pageDisplace < 2){
			paginationArray=[];
		}

		const productLength=products.length;
		const featureLength=featureProducts.length;
		let detailPromises=[];

		//Lấy detail Product
		for (let i=0;i<productLength;i++){
			detailPromises.push(ProductService.getImageLink(products[i].proID));
			detailPromises.push(ProductService.getProductDetail(products[i].proID));
			detailPromises.push(ProductService.getCateName(products[i].catID))
			detailPromises.push(ProductService.getBrandSlug(products[i].brandID));
			detailPromises.push(ProductService.getCateSlug(products[i].catID));
			detailPromises.push(ProductService.countRatingProduct(products[i].proID));
			detailPromises.push(ProductService.sumRatingProduct(products[i].proID));
		}
		let featureDetailPromise=[];
		//Lấy Detail của Feature Product
		for(let i = 0 ; i < featureLength; i++){
			featureDetailPromise.push(ProductService.getImageLink(featureProducts[i].proID));
			featureDetailPromise.push(ProductService.getProductDetail(featureProducts[i].proID));
			featureDetailPromise.push(ProductService.getCateName(featureProducts[i].catID))
			featureDetailPromise.push(ProductService.getBrandSlug(featureProducts[i].brandID));
			featureDetailPromise.push(ProductService.getCateSlug(featureProducts[i].catID));
			featureDetailPromise.push(ProductService.countRatingProduct(featureProducts[i].proID));
			featureDetailPromise.push(ProductService.sumRatingProduct(featureProducts[i].proID));
		}
		
		//Chuẩn bị render
		Promise.all(detailPromises.concat(featureDetailPromise))
		.then((result)=>{
		
			for (let i=0;i<productLength;i++){
				products[i].image=result[i*7][0].proImage;
				products[i].detail=result[i*7+1];
				products[i].cate=result[i*7+2].catName;
				products[i].brandslug=result[i*7+3].brandSlug;
				products[i].cateslug=result[i*7+4].catSlug;
				products[i].star=Math.floor(result[i*7+6]/result[i*7+5]);
				products[i].starLeft=5 - Math.floor(result[i*7+6]/result[i*7+5]);
				products[i].genderslug=getGenderSlug(products[i].sex)
			}

			for (let i=productLength;i<featureLength+productLength;i++){
				featureProducts[i-productLength].image=result[i*7][0].proImage;
				featureProducts[i-productLength].detail=result[i*7+1];
				featureProducts[i-productLength].cate=result[i*7+2].catName;
				featureProducts[i-productLength].brandslug=result[i*7+3].brandSlug;
				featureProducts[i-productLength].cateslug=result[i*7+4].catSlug;
				featureProducts[i-productLength].star=Math.floor(result[i*7+6]/result[i*7+5]);
				featureProducts[i-productLength].starLeft=5 - Math.floor(result[i*7+6]/result[i*7+5]);
				featureProducts[i-productLength].genderslug=getGenderSlug(featureProducts[i-productLength].sex)
			}

			const arr = [
				BrandService.getAll(),
				CateService.getAll(),
			]

			let startNumber = (currentPage - 1)*itemPerPage + 1;
			let endNumber = startNumber+products.length - 1;
			if(endNumber === 0){
				startNumber = 0;
			}
			Promise.all(arr)
			.then(([navBrands, navCates])=>{
				console.log(150);
				console.log(brandIDs);
				console.log(catIDs);
				console.log(genderIDs);
				console.log(prices);
				res.render(hbs,{
					featureProducts,
					brandIDs,
					catIDs,
					genderIDs,
					total: totalProduct,
					startNumber,
					endNumber,
					navCates,
					navBrands,
					products,
					currentPage,
					brandQuery: brandIDs,
					catQuery: catIDs,
					genderQuery: genderIDs,
					priceQuery: prices,
					searchQuery: name,
					totalPage,
					paginationArray,
					prevPage: (currentPage > 1) ? currentPage - 1 : 1,
					nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
					brand: getDataSlug(brand),
					gender: getDataSlug(gender),
					category: getDataSlug(cat),
					brandUI: util.getUIBrandName(brand),
					catUI: util.getUICategory(cat),
					genderUI: util.getUIgender(gender),
					link: link
				})
			})
			.catch(err=>{
				console.log(err);
				next;
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
}

const getShopFilter = (req, res, next, brandID, catID, genderID)=>{
	const pageNumber = req.query.page;
	let genderIDs = (req.query.genders) ? req.query.genders : [];
	let brandIDs = (req.query.brands) ? req.query.brands : [];
	let catIDs = (req.query.categories) ? req.query.categories : [];
	let name = (req.query.search) ? req.query.search : "";
	let sort = (req.query.sort) ? req.query.sort : 0;
	let prices = (req.query.prices) ? req.query.prices : [];
	if(brandID){
		brandIDs = [brandID];
	}
	if(catID){
		catIDs = [catID];
	}
	
	if(genderID){
		genderIDs = [genderID];
	}
	
	
	currentPage =(pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
	currentPage = (currentPage > 0) ? currentPage : 1;
	currentPage = (currentPage <= totalPage) ? currentPage : totalPage;
	currentPage = (currentPage < 1) ? 1: currentPage;
	const productPromises=[
		ProductService.list(itemPerPage,currentPage, name, brandIDs, catIDs, genderIDs, prices, sort),
		ProductService.getProductTotal(name, brandIDs, catIDs, genderIDs, prices),
	]

	//đợi promises
	Promise.all(productPromises)
	.then(result=>{
		let products=result[0];
		const totalProduct=result[1];
		//Lấy max số trang
		totalPage=Math.ceil(totalProduct/itemPerPage);

		let paginationArray = [];

		let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
		if(currentPage === 1){
			pageDisplace -= 1;
		}
		for(let i = 0 ; i < pageDisplace; i++){
			if(currentPage === 1){
				paginationArray.push({
					page: currentPage + i,
					isCurrent:  (currentPage + i)===currentPage
				});
			}
			else{
				paginationArray.push({
					page: currentPage + i - 1,
					isCurrent:  (currentPage + i - 1)===currentPage
				});
			}
		}
		if(pageDisplace < 2){
			paginationArray=[];
		}

		const productLength=products.length;
		let detailPromises=[];

		//Lấy detail Product
		for (let i=0;i<productLength;i++){
			detailPromises.push(ProductService.getImageLink(products[i].proID));
			detailPromises.push(ProductService.getProductDetail(products[i].proID));
			detailPromises.push(ProductService.getCateName(products[i].catID))
			detailPromises.push(ProductService.getBrandSlug(products[i].brandID));
			detailPromises.push(ProductService.getCateSlug(products[i].catID));
			detailPromises.push(ProductService.countRatingProduct(products[i].proID));
			detailPromises.push(ProductService.sumRatingProduct(products[i].proID));
		}
		
		//Chuẩn bị render
		Promise.all(detailPromises)
		.then((result)=>{
		
			for (let i=0;i<productLength;i++){
				products[i].image=result[i*7][0].proImage;
				products[i].detail=result[i*7+1];
				products[i].cate=result[i*7+2].catName;
				products[i].brandslug=result[i*7+3].brandSlug;
				products[i].cateslug=result[i*7+4].catSlug;
				products[i].star=Math.floor(result[i*7+6]/result[i*7+5]);
				products[i].starLeft=5 - Math.floor(result[i*7+6]/result[i*7+5]);
				products[i].genderslug=getGenderSlug(products[i].sex)
			}

			let startNumber = (currentPage - 1)*itemPerPage + 1;
			let endNumber = startNumber+products.length - 1;
			if(endNumber === 0){
				startNumber = 0;
			}
			res.status(200).json({
				total: totalProduct,
				startNumber,
				endNumber,
				products,
				currentPage,
				searchQuery: name,
				totalPage,
				paginationArray,
				prevPage: (currentPage > 1) ? currentPage - 1 : 1,
				nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
			});
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json(err);
		})
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json(err);
	})
}

const maximumReviewPagination = 3;
let currentReviewPage = 1;
let totalReviewPage = 1;
const reviewPerpage = 3;
class ShopController{
    
	shop(req, res, next){
		console.log(req.query);
		getShop(req, res, next,  null, null, null, null, null, null, null, "shop/shop")
    }

	fullview(req, res, next){
		const id = req.params.id;
		const brandslug = req.params.brand;
		const genderslug = req.params.gender;
		const categoryslug = req.params.category;

		let proID = (id && !Number.isNaN(id)) ? parseInt(id) : next();

        ProductService.updateViews(proID)
		.then(result=>{
			ProductService.itemProduct(proID).then(item=>{
				item.brandslug = brandslug;
				item.genderslug = genderslug;
				item.categoryslug = categoryslug;
				const pageNumber=req.query.page;
				currentReviewPage =(pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
				currentReviewPage = (currentReviewPage > 0) ? currentReviewPage : 1;
				currentReviewPage = (currentReviewPage <= totalReviewPage) ? currentReviewPage : totalReviewPage;
				currentReviewPage = (currentReviewPage < 1) ? 1: currentReviewPage;
				ProductService.getBrandName(item.brandID).then(brand=>{
					item.brand = brand.brandName;
					ProductService.getCateName(item.catID).then(cate=>{
						item.cate = cate.catName;
						Promise.all([ 
							ProductService.getProductDetail(proID), 
							ProductService.getImageLink(proID), 
							ProductService.reviewsItemProduct(proID, reviewPerpage, currentReviewPage), 
							ProductService.countRatingProduct(proID), 
							ProductService.sumRatingProduct(proID), 
							BrandService.getAll(), 
							CateService.getAll(),
							ProductService.countProductReview(proID),
							ProductService.countProductQuantity(proID),
						])
						.then(([details, images, reviews, cntrate, sumrate , navBrands, navCates, total, quantity])=>{
							item.quantity = quantity;
							const totalReview=total;
							totalReviewPage=Math.ceil(totalReview/reviewPerpage);
							let paginationArray = [];
	
							let pageDisplace = Math.min(totalReviewPage - currentReviewPage + 2, maximumPagination);
							if(currentReviewPage === 1){
								pageDisplace -= 1;
							}
							for(let i = 0 ; i < pageDisplace; i++){
								if(currentReviewPage === 1){
									paginationArray.push({
										page: currentReviewPage + i,
										isCurrent:  (currentReviewPage + i)===currentReviewPage
									});
								}
								else{
									paginationArray.push({
										page: currentReviewPage + i - 1,
										isCurrent:  (currentReviewPage + i - 1)===currentReviewPage
									});
								}
							}
							if(pageDisplace < 2){
								paginationArray=[];
							}
							Promise.all([
								ProductService.listByFeaturedLimit(4),
								ProductService.listByRelated(item.brandID, item.catID, item.sex)
							])
							.then(([featureProducts, relateProducts])=>{
								let featureDetailPromise=[];
								const featureLength = featureProducts.length;
								//Lấy Detail của Feature Product
								for(let i = 0 ; i < featureLength; i++){
									featureDetailPromise.push(ProductService.getImageLink(featureProducts[i].proID));
									featureDetailPromise.push(ProductService.getProductDetail(featureProducts[i].proID));
									featureDetailPromise.push(ProductService.getCateName(featureProducts[i].catID))
									featureDetailPromise.push(ProductService.getBrandSlug(featureProducts[i].brandID));
									featureDetailPromise.push(ProductService.getCateSlug(featureProducts[i].catID));
									featureDetailPromise.push(ProductService.countRatingProduct(featureProducts[i].proID));
									featureDetailPromise.push(ProductService.sumRatingProduct(featureProducts[i].proID));
								}
								let relateDetailPromises=[];
								const relateLength = relateProducts.length;
								//Lấy detail Product
								for (let i=0;i<relateLength;i++){
									relateDetailPromises.push(ProductService.getImageLink(relateProducts[i].proID));
									relateDetailPromises.push(ProductService.getProductDetail(relateProducts[i].proID));
									relateDetailPromises.push(ProductService.getCateName(relateProducts[i].catID))
									relateDetailPromises.push(ProductService.getBrandSlug(relateProducts[i].brandID));
									relateDetailPromises.push(ProductService.getCateSlug(relateProducts[i].catID));
									relateDetailPromises.push(ProductService.countRatingProduct(relateProducts[i].proID));
									relateDetailPromises.push(ProductService.sumRatingProduct(relateProducts[i].proID));
								}
								Promise.all(relateDetailPromises.concat(featureDetailPromise))
								.then((result)=>{
								
									for (let i=0;i<relateLength;i++){
										relateProducts[i].image=result[i*7][0].proImage;
										relateProducts[i].detail=result[i*7+1];
										relateProducts[i].cate=result[i*7+2].catName;
										relateProducts[i].brandslug=result[i*7+3].brandSlug;
										relateProducts[i].cateslug=result[i*7+4].catSlug;
										relateProducts[i].star=Math.floor(result[i*7+6]/result[i*7+5]);
										relateProducts[i].starLeft=5 - Math.floor(result[i*7+6]/result[i*7+5]);
										relateProducts[i].genderslug=getGenderSlug(relateProducts[i].sex)
									}
	
									for (let i=relateLength;i<featureLength+relateLength;i++){
										featureProducts[i-relateLength].image=result[i*7][0].proImage;
										featureProducts[i-relateLength].detail=result[i*7+1];
										featureProducts[i-relateLength].cate=result[i*7+2].catName;
										featureProducts[i-relateLength].brandslug=result[i*7+3].brandSlug;
										featureProducts[i-relateLength].cateslug=result[i*7+4].catSlug;
										featureProducts[i-relateLength].star=Math.floor(result[i*7+6]/result[i*7+5]);
										featureProducts[i-relateLength].starLeft=5 - Math.floor(result[i*7+6]/result[i*7+5]);
										featureProducts[i-relateLength].genderslug=getGenderSlug(featureProducts[i-relateLength].sex)
									}
								
									for(let i = 0 ; i < reviews.length;i++){
										reviews[i].date = reviews[i].createdAt.toLocaleString("vi-VN");
									}
									item.rating = (sumrate - sumrate % cntrate) / cntrate;
									item.cntreview = cntrate;
									if (item.sex === 0) {
										item.gender = "Men"
									}
									if (item.sex === 1) {
										item.gender = "Women"
									}
									if (item.sex === 2) {
										item.gender = "Unisex"
									}
									
									res.render('shop/fullview', {
										item,
										details,
										featureProducts,
										related: relateProducts,
										images,
										reviews,
										navBrands,
										navCates,
										paginationArray,
										prevPage: (currentReviewPage > 1) ? currentReviewPage - 1 : 1,
										nextPage: (currentReviewPage < totalReviewPage) ? currentReviewPage + 1 : totalReviewPage,
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
		})
		.catch(err=>{
			console.log(err);
			next();
		})
    }

    shopByCategory(req, res, next){
        const brand = req.params.brand;
        const gender = req.params.gender;
        const category = req.params.category;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand !== 'all'){
				next();
			}else{
				if(gender !== "women" &&
					gender !== "men"&&
					gender !== "unisex" &&
					gender !== "all"){
					next();
				}else {
					CateService.findSlug(category)
					.then(result=>{
						if(!result && category !== "all"){
							next();
						}
						else{
							let brandUI = "";
							let genderUI = "";
							let categoryUI = "";
							
							if(category === "all"){
								if(gender === "all"){
									if(brand === "all"){
										res.redirect("/shop");
									}else{
										res.redirect("/shop/" + brand);
									}
								}
								else{
										res.redirect("/shop/" + brand + "/" + gender);
								}
							}
							else{
								if(brand === "all"){
									brandUI = null;
								}else{
									brandUI = util.getUIBrandName(brand);
								}
		
								if(gender === "all"){
									genderUI = null;
								}else{
									genderUI = util.getUIgender(gender);
								}
								categoryUI = util.getUICategory(category);
								shopbycate(req,res,next,brand,gender,category);
							}
						}
					})
					.catch(err=>{
						console.log(err);
						next()
					})
				}
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }

    //[GET] /:brand/:gender
    shopByGender(req, res, next){
        const brand = req.params.brand;
        const gender = req.params.gender;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand!=="all"){
				next()

			}else{
				if(gender !== "women" &&
					gender !== "men"&&
					gender !== "unisex" &&
					gender !== "all"){
				next();
			}else{
					if(brand === 'all'){
						if(gender === 'all'){
							res.redirect("/shop");
						}
						else{
							shopbysex(req,res,next,gender,brand); 
						}
					}
					else{
						if(gender === 'all'){
							res.redirect("/shop/" + brand);
						}
						else{
							const arr = [
								BrandService.getAll(),
								CateService.getAll(),
							]
							Promise.all(arr)
							.then(([navBrands, navCates])=>{
								res.render("shop/" + gender,{
									navCates,
									navBrands,
									brand : util.getUIBrandName(brand),
									gender : util.getUIgender(gender),
									link: "/shop/" +brand + "/" +gender
								})
							})
						}
					}
				}
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }

    //[GET] /:brand
    shopByBrand(req, res, next){
        const brand = req.params.brand;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand!=="all"){
				next()

			}else{
				if(brand === "all"){
					res.redirect("/shop");
				}
				shopbybrand(req,res,next,brand);
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }

	shopFilter(req,res,next){
		console.log(req.query);
		getShopFilter(req, res, next,  null, null, null);
	}

	shopByBrandFilter(req, res, next){
        const brand = req.params.brand;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand!=="all"){
				next()

			}else{
				if(brand === "all"){
					res.redirect("/shop");
				}
				shopbybrandfilter(req,res,next,brand);
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }

	shopByGenderFilter(req, res, next){
        const brand = req.params.brand;
        const gender = req.params.gender;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand!=="all"){
				next()
			}else{
				if(gender !== "women" &&
					gender !== "men"&&
					gender !== "unisex" &&
					gender !== "all"){
				next();
			}else{
					if(brand === 'all'){
						if(gender === 'all'){
							res.redirect("/shop");
						}
						else{
							shopbysexfilter(req,res,next,gender); 
						}
					}
					else{
						if(gender === 'all'){
							res.redirect("/shop/" + brand);
						}
						else{
							const arr = [
								BrandService.getAll(),
								CateService.getAll(),
							]
							Promise.all(arr)
							.then(([navBrands, navCates])=>{
								res.render("shop/" + gender,{
									navCates,
									navBrands,
									brand : util.getUIBrandName(brand),
									gender : util.getUIgender(gender),
									link: "/shop/" +brand + "/" +gender
								})
							})
						}
					}
				}
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }

	shopByCategoryFilter(req, res, next){
        const brand = req.params.brand;
        const gender = req.params.gender;
        const category = req.params.category;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand !== 'all'){
				next();
			}else{
				if(gender !== "women" &&
					gender !== "men"&&
					gender !== "unisex" &&
					gender !== "all"){
					next();
				}else {
					CateService.findSlug(category)
					.then(result=>{
						if(!result && category !== "all"){
							next();
						}
						else{
							if(category === "all"){
								if(gender === "all"){
									if(brand === "all"){
										res.redirect("/shop");
									}else{
										res.redirect("/shop/" + brand);
									}
								}
								else{
									res.redirect("/shop/" + brand + "/" + gender);
								}
							}
							else{
								shopbycatefilter(req,res,next,category);
							}
						}
					})
					.catch(err=>{
						console.log(err);
						next()
					})
				}
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }

	//[post]/:rate
	rateProduct(req,res,next){
		console.log("da vao toi controler");
		const {userID,authorName,rate,proID,sumary,com} =req.body;
		console.log(req.body);
		
		console.log(userID)

		CommentService.add(userID,authorName,rate,proID,sumary,com)
		.then(result=>{
			//console.log(authorName);
			res.status(201).json(result);
		}).catch(err=>{
			console.log("LỖi :")
			console.log(err)
			res.status(500).json({
				message: err=>message,
			});
		})
	};

	getRating(req,res,next){
		const pageNumber = req.query.page;
		const proID=req.query.proID;

		currentPage =(pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
		currentPage = (currentPage > 0) ? currentPage : 1;
		currentPage = (currentPage <= totalPage) ? currentPage : totalPage;
		currentPage = (currentPage < 1) ? 1: currentPage;

		const commentPromise=[CommentService.list(3,currentPage,proID),CommentService.totalComment(proID)];
		
		Promise.all(commentPromise).then(result=>{
			let totalComment=result[1];
			let paginationArray = [];
            totalPage = Math.ceil(totalComment/3);
            let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
            if(currentPage === 1){
                pageDisplace -= 1;
            }
            for(let i = 0 ; i < pageDisplace; i++){
                if(currentPage === 1){
                    paginationArray.push({
                        page: currentPage + i,
                        isCurrent:  (currentPage + i)===currentPage
                    });
                }
                else{
                    paginationArray.push({
                        page: currentPage + i - 1,
                        isCurrent:  (currentPage + i - 1)===currentPage
                    });
                }
            }
			console.log(pageDisplace)
            if(pageDisplace < 2){
                paginationArray=[];
            }
			res.status(200).json({
				comment: result[0],
				currentPage,
                paginationArray,
                prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
			})
		}).catch(err=>{
			console.log(err);
			res.status(500);
		})
	}
}

function shopbycate(req,res,next,brand,gender,category) {
	let cateID=0;

	const catePormises=[
		ProductService.getCateID(category),
	]
	link = "/shop/" + brand + "/" +gender + "/" + category
	Promise.all(catePormises)
	.then(resultID=>{
		cateID=resultID[0].CatID;
		getShop(req, res, next, brand, null,category, cateID, gender, null,  link, "shop/category");
	})
	.catch(err=>{
		console.log(err);
		next();
	})
}

function shopbycatefilter(req,res,next, category) {
	let cateID=0;
	const catePormises=[
		ProductService.getCateID(category),
	]
	Promise.all(catePormises)
	.then(resultID=>{
		cateID=resultID[0].CatID;
		getShopFilter(req, res, next, null, cateID, null);
	})
	.catch(err=>{
		console.log(err);
		next();
	})
}

function shopbybrandfilter(req,res,next,brand) {

	let brandID=0;
	const brandPormises=[
		ProductService.getBrandID(brand),
	]
	
	Promise.all(brandPormises)
	.then(resultID=>{
		brandID=resultID[0].brandID;
		link = "/shop/" + brand;
		hbs = "shop/brand";
		getShopFilter(req, res, next, brandID,null,null);
		
	})
	.catch(err=>{
		console.log(err);
		next();
	})
}

function shopbybrand(req,res,next,brand) {

	let brandID=0;
	const brandPormises=[
		ProductService.getBrandID(brand),
	]
	
	Promise.all(brandPormises)
	.then(resultID=>{
		brandID=resultID[0].brandID;
		link = "/shop/" + brand;
		hbs = "shop/brand";
		getShop(req, res, next, brand, brandID, null, null, null, null, link, hbs);
		
	})
	.catch(err=>{
		console.log(err);
		next();
	})
}

function shopbysex(req,res,next,gender,brand) {
	let sex=2;
	if (gender==="women")
		sex=1;
	if (gender==="men")
		sex=0;

	const link = "/shop/" +brand + "/" +gender;
	const hbs = "shop/gender"
	getShop(req, res, next, brand, null, null, null, gender, sex, link, hbs);
}

function shopbysexfilter(req,res,next,gender) {
	let sex=2;
	if (gender==="women")
		sex=1;
	if (gender==="men")
		sex=0;

	getShopFilter(req, res, next, null , null,sex, null);
}

function getGenderSlug(sex) {
	let gender="unisex";
	if (sex==1)
		gender="women";
	if (sex==0)
		gender="men";
	return gender;
}

module.exports = new ShopController;