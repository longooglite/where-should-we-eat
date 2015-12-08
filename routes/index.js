var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //put the init data here
    res.render('index', { title: 'Where Should We Fucking Eat?' });
});
module.exports = router;

var mongoose = require('mongoose');
var Restaurant = mongoose.model('Restaurant');

router.get('/restaurants', function(req, res, next){
    Restaurant.find(function(error, restaurants){
        if(error) return next(error);
        res.json(restaurants);
    });
});
router.post('/restaurants', function(req, res, next) {
    var rest = new Restaurant(req.body);
    rest.save(function(error, rest){
        if(error) return next(error);
        res.json(rest);
    });
});