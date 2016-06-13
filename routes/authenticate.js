var express = require('express'),
    url = require('url'),
    querystring = require('querystring');
var authentication = require('../authentication.json')

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new LocalStrategy({session: true}, (username, password, done) => {
  if (username === 'foo' && password === 'bar') {
    done(null, { id: `local:${username}` });
  } else {
    done(null, false);
  }
}));
passport.use(new FacebookStrategy({
  clientID: authentication.facebook.appid,
  clientSecret: authentication.facebook.secret,
  callbackURL: 'http://localhost:3000/authenticate/fbcallback'
}, (accessToken, refreshToken, profile, done) => {
  done(null, {id: `facebook:${profile.id}`, name: profile.displayName});
}));

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });

var ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); 
  }
  console.log(`not authenticated. session: ${JSON.stringify(req.session)}`);
  req.error = 'Please sign in!';
  req.session.redirectTo = req.originalUrl;
  res.redirect('/authenticate/login');
};

var router = express.Router();
router.get('/login',
    (req, res, next) => { 
      res.render('authentication/login'); 
    }
);
router.post('/login', passport.authenticate('local'),
    (req, res, next) => { 
      console.log(`POST session: ${JSON.stringify(req.session)}`);
      var redirectTo = req.session.redirectTo;
      req.session.redirectTo = null;
      res.redirect(redirectTo); 
    }
);

router.get('/fblogin', passport.authenticate('facebook'));
router.get('/fbcallback', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/login'}));

router.use('/', ensureAuthenticated);

router.get('/profile',
    (req, res, next) => { res.render('authentication/profile', {user: req.user} ); }
);

router.get('/',
    (req, res, next) => { res.render('authentication/index'); }
);

module.exports = {router: router, ensureAuthenticated: ensureAuthenticated};
