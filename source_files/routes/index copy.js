var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

var monk = require('monk');
const { response } = require('express');
var db = monk('localhost:27017');
var collection = db.get('users');
//protected route
router.get('/welcome', auth, function(req, res) {
	res.json({ message: "Welcome!!" } );

});

router.post('/register', function(req, res) {
	
	const {username, email, password } = req.body;

	if(!(username && email && password)){

		res.json( { error: "All fields are required!" } );
	}
	else{

		collection.findOne({ email: email }, function(err, user){
			if (err) throw err;

			if (user){
				res.json({ error : "User already exists. Please login!"} );

			}
			else{
				let newUser = {
					username,
					email,
					password

				}
				collection.insert(newUser, function(err, user){
					
                     if (err) throw err;
					 var token = jwt.sign({ user_id: user._id, email}, 'secretkey');

					 if (token){
						user.token = token;

					 }
					 res.json(user);

				})


			}


		});	

	}



});

router.post('/login', function(req, res) {
	const {email, password } = req.body;

	if(!(email && password)){

		res.json({ error: "All fields are required!" } );
	}
	else{

		collection.findOne({ email: email }, function(err, user){
			if (err) throw err;
			if(user == null){

				res.json({ error: "User doesn't exist" } );

			}
			else{
				if (user.password === password ){
					var token = jwt.sign({ user_id: user._id, email}, 'secretkey');
					user.token = token;
					res.json(user);

				}
				else{
					res.json( {error: "User email or password is incorrect!" } );

				}

			}

		});

	}

});


router.get('/', function(req, res, next) {
  res.redirect('/properties')
});

router.get('/properties',function(req,res){
	var collection = db.get('properties');
	collection.find({}, function(err,properties){
		if (err) throw err;
		res.render('index', {properties: properties})
	});
  });
  
  //new property
  router.get('/properties/new',function(req,res){
	res.render('new');
  });
  //edit property
  router.get('/properties/:id/edit',function(req,res){
	  res.render('edit',{property_id: req.params.id});
	});
  
  //insert
  router.post('/properties', function(req, res) {
	  //req.body is used to read form input
	var collection = db.get('properties');
	  collection.insert({ 
		  title: req.body.title,
		  location: req.body.location,
		  img1: req.body.image1,
	  img2: req.body.image2,
	  img3: req.body.image3,
		  description:req.body.desc
	  }, function(err, property){
		  if (err) throw err;
		  res.redirect('/properties');
	  });
  });
  
  router.get('/properties/:id', function(req, res) {
	var collection = db.get('properties');
	  collection.find({ _id: req.params.id }, function(err, result){
		  if (err) throw err;
			res.render('show', { property: result[0] });
		  //res.json(result);
	  });
  });
  
  //update
  router.put('/properties/:id', function(req, res) {
	  //req.body is used to read form input
	  var collection = db.get('properties');
	  collection.update({_id: req.params.id },
		  { $set: {
			  title: req.body.title,
			  location: req.body.location,
			  img1: req.body.image1,
		  img2: req.body.image2,
		  img3: req.body.image3,
			  description:req.body.desc }
	  }, function(err, property){
		  if (err) throw err;
		  res.redirect('/properties');
	  });
  });
  
  //delete
  router.delete('/properties/:id', function(req, res) {
	  var collection = db.get('properties');
	  collection.remove({ _id: req.params.id }, function(err, video){
		  if (err) throw err;
	  res.redirect('/properties');
	  });
  });
  

module.exports = router;
