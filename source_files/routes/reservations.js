var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017');
var collection = db.get('reservations');


router.get('/',function(req,res){
	var collection = db.get('reservations');
	collection.find({}, function(err,reservations){
		if (err) throw err;
		res.render('reservations', {reservations: reservations})
	});
  });
  
  //new reservation
  router.get('/new',function(req,res){
	res.render('new');
  });

  //insert
  router.post('/', function(req, res) {
	  //req.body is used to read form input
	var collection = db.get('reservations');
	  collection.insert({ 
		  title: req.body.title,
		  location: req.body.location,
		  img1: req.body.image1,
	  img2: req.body.image2,
	  img3: req.body.image3,
		  description:req.body.desc
	  }, function(err, reservation){
		  if (err) throw err;
		  res.redirect('/reservations');
	  });
  });
  
  router.get('/:id', function(req, res) {
	var collection = db.get('reservations');
	  collection.find({ _id: req.params.id }, function(err, result){
		  if (err) throw err;
			res.render('show', { reservation: result[0] });
		  //res.json(result);
	  });
  });
  
 
  
  //delete
  router.delete('/:id', function(req, res) {
	  var collection = db.get('reservations');
	  collection.remove({ _id: req.params.id }, function(err, video){
		  if (err) throw err;
	  res.redirect('/reservations');
	  });
  });



  module.exports = router;
