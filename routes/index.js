var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to ETH Blockchain Donation Portal', name:null });
});

router.post('/', function(req, res, next) {

  res.render('index', { title: 'Welcome to ETH Blockchain Donation Portal', name:req.body.name });
});

router.get('/page1', function(req, res, next) {
  res.render('page1', { title: 'Welcome to ETH Blockchain Donation Portal', name:null });
});

router.get('/page2', function(req, res, next) {
  res.render('page2', { title: 'Welcome to ETH Blockchain Donation Portal', name:null });
});



module.exports = router;
