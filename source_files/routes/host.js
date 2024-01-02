var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017');
var collection = db.get('host');

router.get('/',function(req,res){
	res.render('host');
  });

//get properties
router.get('/:email',function(req,res){
	var collection = db.get('properties');
	collection.find({email:req.params.email}, function(err,properties){
		if (err) throw err;
		res.render('properties', {properties: properties})
	});
  });

 //new host
 router.get('/register',function(req,res){
	res.render('newhost');
  });
  router.get('/register2',function(req,res){
	res.render('newhost');
  });
//log in
router.get('/login',function(req,res){
	res.render('hostlogin');
  });

  router.get('welcome/:email', function(req,res){
	var collection = db.get('properties');
	collection.find({owner:req.params.email}, function(err,properties){
		if (err) throw err;
		res.render('properties',{properties:properties});
	});
  });
 
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
		var collection = db.get('properties');
		collection.find({owner:req.params.email}, function(err,properties){
			if (err) throw err;
			res.render('properties',{properties:properties});
		});
	});
});

router.post('/register2', function(req, res) {
	var collection = db.get('host');
	username = req.body.hostname;
    email = req.body.email;
    password = req.body.password;

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

                collection.insert({
                    hostname:req.body.hostname,
                    firstname:req.body.firstname,
                    middlename:req.body.middlename,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    phoneno:req.body.phoneno,
                    password:req.body.password}, function(err, user){
					
                     if (err) throw err;
					 res.redirect('/host');

				});

			}


		});	

	}
});

router.post('/login', function(req, res) {
	email = req.body.email;
	password = req.body.password;
    var collection = db.get('host');

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
					res.redirect('/host/welcome/');
				}
				else{
					res.json( {error: "User email or password is incorrect!" } );

				}

			}

		});
	}

});

module.exports = router;
