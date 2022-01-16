const express = require('express');
const router = express.Router();

const ShopController = require('../controllers/ShopController');

router.get('/:brand/:gender/:category/:id', ShopController.fullview);

router.get('/:brand/:gender/:category', ShopController.shopByCategory);

router.get('/:brand/:gender', ShopController.shopByGender);

router.get('/:brand', ShopController.shopByBrand);

router.post('/api/rate', ShopController.rateProduct);

router.get('/api/rating',ShopController.getRating);

router.get('/', ShopController.shop);

router.post('/api/rate', ShopController.rateProduct);

router.get('/api/rating',ShopController.getRating);

module.exports = router;
