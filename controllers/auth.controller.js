import path from 'path';
import rootDir from '../util/path';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';


// GET USER SIGN-UP FORM
export const getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length <= 0) {
    message = null
  }
  res.render(path.join(rootDir, 'views', 'auth', 'signup.ejs'), {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false,
    errorMessage: message,
  });
}

// POST USER SIGN-UP
export const postSignup = (req, res, next) => {
  // STORE NEW USERS IN DB
  const { name, email, password, confirmPassword } = req.body
  // VALIDATION

  // CHECK IF THE EMAIL ALREADY EXISTS
  User.findOne({ email: email }).then((userDoc) => {
    console.log(userDoc)
    if (userDoc) {
      req.flash('error', 'User already exists, please sign in')
      return res.redirect('/signup')
    }
    // IF USER DOESN'T EXIST, HASH THE PASSWORD AND CREATE NEW USER
    return bcrypt.hash(password, 12).then((hashedPaswword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPaswword,
        cart: { items: [] }
      });
      return user.save()
    }).then((result) => {
      // console.log("file: auth.controller.js:43 ~ returnbcrypt.hash ~ result:", result);
      res.redirect('/login')
    })
  }).catch((error) => {
    console.log("file: auth.controller.js:31 ~ user.save ~ error:", error);
  })
}


// GET USER LOGIN FORM
export const getLogin = (req, res, next) => {
  let message = req.flash('err');
  if (message.length <= 0) {
    message = null
  }
  res.render(path.join(rootDir, 'views', 'auth', 'login.ejs'), {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message,
  });
};

// POST USER LOGIN
export const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // CHECK IF USER EXISTS IN DB
  User.findOne({ email: email }).then((user) => {
    // IF USER DOESN'T EXIST RETURN TO LOGIN FORM
    if (!user) {
      req.flash('err', 'Invalid email or password');
      return res.redirect('/login')
    }
    // IF USER EXISTS, COMPARE PASSWORD ENTERED AND PASSWORD IN USER OBJECT FROM DB
    bcrypt.compare(password, user.password).then((doMatch) => {
      // COMPARE RETURNS BOOLEAN
      if (doMatch) {
        // IF TRUE SAVE USER AND LOGIN DETAIL IN SESSION
        req.session.user = user;
        req.session.isLoggedIn = true;
        return req.session.save((error) => {
          if (error) {
            console.log("file: auth.controller.js:21 ~ req.session.save ~ error:", error);
          }
          return res.redirect('/');
        })
      }
      // IF FALSE RETURN TO LOGIN FORM
      req.flash('err', 'Invalid email or password');
      return res.redirect('/login')
    }).catch((error) => {
      console.log("file: auth.controller.js:93 ~ bcrypt.compare ~ error:", error);
      req.flash('err', error);
      return res.redirect('/login')
    })
  }).catch((error) => {
    console.log("file: auth.js:20 ~ User.findById ~ error:", error);
  })
};

// POST USER LOGOUT
export const postLogout = (req, res, next) => {
  // REMOVE SESSION FROM DB AND REDIRECT
  req.session.destroy((error) => {
    if (error) {
      console.log("file: auth.controller.js:28 ~ req.session.destroy ~ error:", error);
    }
    res.redirect('/')
  })
}
