import * as dotenv from "dotenv";

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from "mongoose";

import session from "express-session";
import { default as connectMongoDBSession } from 'connect-mongodb-session';

import flash from 'connect-flash';

import rootDir from './util/path';

import User from "./models/user.model";

import { get404 } from "./controllers/errors.controller";

import AuthRouter from './routes/auth.router';
import AdminRoute from './routes/admin.router';
import CustomerRoute from './routes/customer.router';

// =================================================== //
dotenv.config();

const app = express();
// =================================================== //

// MONGODB FOR SESSION STOREAGE 
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
 uri: process.env.URI,
 collection: 'sessions'
}, session);
// =================================================== //

// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

// =================================================== //

// SERVING FILES STATICALLY FOR STATIC FILES ONLY HAS READ ACCESS
app.use(express.static(path.join(rootDir, 'public')))

// =================================================== //

// TEMPLATING ENGINE EJS FOR VIEWS
app.set('view engine', 'ejs');
app.set('views', 'views');

// =================================================== //

// SESSION STORAGE MIDDLEWARE
app.use(
 session({
  secret: process.env.SESSION_STORAGE,
  resave: false,
  saveUninitialized: false,
  store: store
 })
);

// ==================================================== //
// INITIALIZE FLASH AFTER INITIALIZING SESSION - NOW FLASH CAN BE USED FROM ANYWHERE IN APPLICATION ON REQ OBJECT
app.use(flash());

// ==================================================== //

// USER ASSOCIATION WITH EVERY REQUEST MIDDLEWARE
app.use((req, res, next) => {
 if (!req.session.user) {
  return next()
 }
 User.findById(req.session.user._id).then((user) => {
  // console.log("file: index.js:42 ~ User.findById ~ user:", user);
  req.user = user;
  next();
 }).catch((error) => {
  console.log("file: index.js:45 ~ User.findById ~ error:", error);
 })
})

// ==================================================== //
// MIDDLEWARE FOR VIEWS THAT ARE RENDERED TO SET SPECIFIED FIELDS
app.use((req, res, next) => {
 // ALLOWS TO SET LOCAL VARIABLES THAT ARE PASSED INTO THE VIEWS THAT ARE RENDERED
 res.locals.isAuthenticated = req.session.isLoggedIn;
 next();
})

// ROUTES
app.use(AuthRouter);
app.use(CustomerRoute);
app.use('/admin', AdminRoute);
// CATCH ALL ROUTES (404 ERROR)
app.use(get404);

// ================================================ //
// INITIAL CHECK
// app.listen(process.env.PORT, () => {
//  return console.log("🚀 ~ file: index.js:9 ~ App listening on port:", process.env.PORT)
// })
// app.get('/', (req, res) => res.send('Hello World!'))

// ================================================ //

// MONGODB CONNECTION USING MONGOOSE
mongoose.connect(process.env.URI
).then((result) => {
 // console.log("file: index.js:50 ~ mongoose.connect ~ Connected:", process.env.URI);
 // console.log("file: index.js:51 ~ mongoose.connect ~ result:", result);
 app.listen(process.env.PORT)
}).catch((error) => {
 console.log("file: index.js:46 ~ mongoose.connect ~ error:", error);
})
