var express = require('express');
var router = express.Router();

var monk = require('monk');
const { response } = require('express');
var db = monk('localhost:27017');
var collection = db.get('users');

router.get('/', function(req, res) {
	var collection = db.get('properties');
	collection.find({}, function(err,properties){
		if (err) throw err;
		res.render('index', {properties: properties})
	});
});

router.get('/filter', function(req, res) {
	var collection = db.get('properties');
	collection.find({location:req.body.city}, function(err,properties){
		if (err) throw err;
		res.render('index', {properties: properties})
	});
});

router.get('/index/:id', function(req, res) {
	var collection = db.get('properties');
	  collection.find({ _id: req.params.id }, function(err, result){
		  if (err) throw err;
			res.render('showidx', { property: result[0] });
	  });
  });
  router.get('/index/d', function(req, res) {
	var collection = db.get('properties');
	  collection.find({ location: "Dallas" }, function(err, result){
		  if (err) throw err;
			res.render('showidx', { property: result });
	  });
  });

router.get('/about', function(req, res) {
	res.render('about');

});

  

module.exports = router;
