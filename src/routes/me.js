const express = require('express');
const router = express.Router();

const MeController = require('../controllers/MeController');

router.put('/updateInfo', MeController.updateInfo);
router.put('/change-password', MeController.updatePassword);
router.get('/profile', MeController.profile);
router.get('/cart/api/header',MeController.getCartHeader);
router.get('/cart', MeController.showCart);
router.delete('/cart/api/delete', MeController.deleteCart);
router.post('/cart/api/update-quantity', MeController.updateCartQuantity);
router.post('/cart/api', MeController.addToCart);;
router.get('/order/:id', MeController.showOrderDetail);
router.get('/order/api', MeController.showOrderApi);
router.get('/order', MeController.showOrder);
router.get('/checkout', MeController.checkout);
router.get('/change-password', MeController.changePassword);
module.exports = router;
