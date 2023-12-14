import express from 'express';
import { getLogin, getSignup, postLogin, postLogout, postSignup } from '../controllers/auth.controller';

const router = express.Router();

// USER SIGN-UP FORM GET
router.get('/signup', getSignup);

// USER SIGN-UP POST
router.post('/signup', postSignup);

// USER LOGIN FORM GET
router.get('/login', getLogin);

// USER LOGIN POST
router.post('/login', postLogin);

// USER LOGOUT POST
router.post('/logout', postLogout);

export default router;