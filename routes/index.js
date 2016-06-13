var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Leah and Wayne\`s Wedding',
    user: req.user,
    sidebar: {
      title: 'Menu'
    }
  });
});

module.exports = router;
