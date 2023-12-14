import express from 'express';

import { protectedRoutes } from '../middlewares/protectedRoutes'

import { getEditAdminProduct, getAdminAddProduct, getAdminProducts, postAdminAddProduct, postAdminUpdatedProduct, deleteAdminProduct } from '../controllers/admin.controller';

const router = express.Router()


//  GET ADD PRODUCT VIEW

// GET ADD PRODUCT FORM/PAGE
router.get('/add-product', protectedRoutes, getAdminAddProduct);

// CREATE NEW PRODUCT
router.post('/add-product', protectedRoutes, postAdminAddProduct);

// // GET PRODUCTS LIST
router.get('/products', protectedRoutes, getAdminProducts);

// GET EDIT ADMIN SINGLE PRODUCT FORM/PAGE
router.get('/edit-product/:id', protectedRoutes, getEditAdminProduct);

// POST EDIT ADMIN SINGLE PRODUCT 
router.post('/edit-product', protectedRoutes, postAdminUpdatedProduct);

// DELETE ADMIN SINGLE PRODUCT 
router.post('/delete-product', protectedRoutes, deleteAdminProduct);


export default router;