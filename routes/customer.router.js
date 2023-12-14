import express from 'express';
import { protectedRoutes } from '../middlewares/protectedRoutes';
import {
 getShopIndexProducts, getShopProducts, getCart, getOrders, getShopSingleProduct, postCart, postCartDeleteProduct, postOrder
} from '../controllers/customer.controller';


const router = express.Router()

// GET SHOP INDEX/ FIRST PAGE
router.get('/', getShopIndexProducts);

// GET SHOP PRODUCTS LIST PAGE
router.get('/products', getShopProducts);

// GET SHOP SINGLE PRODUCTDETAIL PAGE
router.get('/product/:id', getShopSingleProduct);

// POST CART
router.post('/cart', protectedRoutes, postCart);

// GET CARTS
router.get('/cart', protectedRoutes, getCart);

// DELETE CART ITEM
router.post('/cart-delete-item', protectedRoutes, postCartDeleteProduct);

// POST ORDER
router.post('/create-order', protectedRoutes, postOrder);

// GET ORDERS
router.get('/orders', protectedRoutes, getOrders);


export default router;