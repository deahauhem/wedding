var express = require('express'),
    url = require('url'),
    querystring = require('querystring');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({session: true}, (username, password, done) => {
  if (username === 'foo' && password === 'bar') {
    done(null, { id: username });
  } else {
    done(null, false);
  }
}));
// TODO: read the docs
passport.serializeUser((user, done) => {
  done(null, user);
});
// TODO: read the docs
passport.deserializeUser((user, done) => { done(null, user); });

var ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  req.error = 'Please sign in!';
  res.redirect('/authenticate/login');
};

var router = express.Router();
router.get('/login',
    (req, res, next) => { res.render('authentication/login'); }
);
router.get('/profile', ensureAuthenticated,
    (req, res, next) => { res.render('authentication/profile', {user: req.user} ); }
);

router.get('/', ensureAuthenticated,
    (req, res, next) => { res.render('authentication/index'); }
);
router.post('/login', passport.authenticate('local'),
    (req, res, next) => { res.render('authentication/index'); }
);

module.exports = router;

