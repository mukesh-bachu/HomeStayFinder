var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017');
var collection = db.get('properties');


router.get('/',function(req,res){
	var collection = db.get('properties');
	collection.find({}, function(err,properties){
		if (err) throw err;
		res.render('properties', {properties: properties})
	});
  });
  
  //new property
  router.get('/new',function(req,res){
	res.render('new');
  });
  //edit property
  router.get('/:id/edit',function(req,res){
	  res.render('edit',{property_id: req.params.id});
	});
  
  //insert
  router.post('/', function(req, res) {
	  //req.body is used to read form input
	var collection = db.get('properties');
	  collection.insert({ 
		  owner:req.body.name,
		  title: req.body.title,
		  location: req.body.location,
		  img1: req.body.image1,
	  img2: req.body.image2,
	  img3: req.body.image3,
		  description:req.body.desc,
		  amenities:req.body.amenities,
		  cleaningfee:req.body.cleaningfee,
		  price:req.body.price
	  }, function(err, property){
		  if (err) throw err;
		  res.redirect('/properties');
	  });
  });
  
  router.get('/:id', function(req, res) {
	var collection = db.get('properties');
	  collection.find({ _id: req.params.id }, function(err, result){
		  if (err) throw err;
			res.render('show', { property: result[0] });
		  //res.json(result);
	  });
  });
  
  //update
  router.put('/:id', function(req, res) {
	  //req.body is used to read form input
	  var collection = db.get('properties');
	  collection.update({_id: req.params.id },
		  { $set: {
			  img1: req.body.image1,
		  	img2: req.body.image2,
		  img3: req.body.image3,
			  description:req.body.desc,
			amenities: req.body.amenities,
		price: req.body.price,
	cleaningfee:req.body.cleaningfee }
	  }, function(err, property){
		  if (err) throw err;
		  res.redirect('/properties');
	  });
  });
  
  //delete
  router.delete('/:id', function(req, res) {
	  var collection = db.get('properties');
	  collection.remove({ _id: req.params.id }, function(err, video){
		  if (err) throw err;
	  res.redirect('/properties');
	  });
  });



  module.exports = router;
