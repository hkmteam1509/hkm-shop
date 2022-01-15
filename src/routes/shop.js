const express = require('express');
const router = express.Router();

const ShopController = require('../controllers/ShopController');

router.get('/:brand/:gender/:category/filter', ShopController.shopByCategoryFilter);

router.get('/:brand/:gender/filter', ShopController.shopByGenderFilter);

router.get('/:brand/filter', ShopController.shopByBrandFilter);

router.get("/filter", ShopController.shopFilter);

router.get('/:brand/:gender/:category/:id', ShopController.fullview);

router.get('/:brand/:gender/:category', ShopController.shopByCategory);

router.get('/:brand/:gender', ShopController.shopByGender);

router.get('/:brand', ShopController.shopByBrand);

router.get('/', ShopController.shop);


router.post('/api/rate', ShopController.rateProduct);

module.exports = router;
