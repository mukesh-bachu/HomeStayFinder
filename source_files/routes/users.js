var express = require('express');
var router = express.Router();

var monk = require('monk');
const { route } = require('./host');
var db = monk('localhost:27017');
var collection = db.get('users');


router.get('/',function(req,res){
	res.render('users');
  });

router.get('/register', function(re,res){
  res.render('newUser');
});

//log in
router.get('/login',function(req,res){
	res.render('userlogin');
  });


  router.get('/show/:id', function(req, res) {
    var collection = db.get('properties');
      collection.find({ _id: req.params.id }, function(err, result){
        if (err) throw err;
        res.render('showul', { property: result[0] });
        //res.json(result);
      });
    });

router.get('/uwelcome',function(req,res){
  var collection1 = db.get('properties');
  collection1.find({}, function(err, properties){
    if (err) throw err;
    res.render('uwelcome', { properties: properties });
  });
  });

  router.get('/rl',function(req,res){
    var collection1 = db.get('properties');
    collection1.find({}, function(err, properties){
      if (err) throw err;
      res.render('rl', { properties: properties });
    });
    });

  router.get('/loggedin',function(req,res){
    var collection = db.get('properties');
    collection.find({}, function(err,properties){
      if (err) throw err;
      res.render('u1welcome', {properties: properties})
    });
    });

router.post('/register', function(req, res) {
	var collection = db.get('users');
	  username = req.body.username;
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
                    username:req.body.username,
                    firstname:req.body.firstname,
                    middlename:req.body.middlename,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    phoneno:req.body.phoneno,
                    password:req.body.password}, function(err, user){
                    if (err) throw err;
					 res.redirect('/users');
				});
			}
		});	
	}
});

router.get('/reservations/:id', function(req,res){
  var collection = db.get('properties');
  collection.find({ _id: req.params.id }, function(err, result){
    if (err) throw err;
    res.render('userReservation', { property: result[0] });
  });
});

router.get('/reservationslist/:id', function(req,res){
  var collection = db.get('reservations');
  collection.find({ _id: req.params.id }, function(err, result){
    if (err) throw err;
    res.render('userReservationShow', { reseravtion: result });
  });
});

router.post('/reservations/:id', function(req,res){
  var collection = db.get('reservations');
  collection.insert({ 
    email:req.body.email,
    phoneno: req.body.phoneno,
    pid: req.body.id,
    todate:req.body.todate,
    fromdate:req.body.fromdate
  }, function(err, reservation){
    if (err) throw err;
    res.redirect('/reservationslist/'+email);
  });
});

router.post('/login', function(req, res) {
	email = req.body.email;
	password = req.body.password;
  var collection = db.get('users');
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
          res.redirect('/users/loggedin');

				}
				else{
					res.json( {error: "User email or password is incorrect!" } );

				}

			}

		});
	}

});

module.exports = router;
