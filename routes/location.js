var express = require('express');
var router = express.Router();
var request = require('request');
var dat = '';
var dataStr = '';

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
    console.log("In dashboard");
    res.render('dashboardLocation');
});

router.get('/registerLocation', function(req, res, next) {
    console.log("In register Location");
    res.render('registerLocation');
});

router.get('/viewLocation', function(req, res, next) {

    request.get('http://localhost:8081/api/location','',function(error,response,body){
        if (!error && response.statusCode !== 200) {
            console.log("error");
        }
        else{
            dataStr = body.toString();
            dat = JSON.parse(dataStr);
            console.log(dat.data);
            res.render('viewLocation', {"locations":dat.data});
        }
    });
});

router.post('/registerLocation',function(req,res,next) {

    console.log(req.body);

    request.post(
        'http://localhost:8081/api/location',
        {json: req.body},
        function (error, response, body) {
            if (!error && response.statusCode !== 200) {
                console.log("error");
            }
            else{
                console.log(body);
                console.log("In register Device");
                res.render('registerLocation', '');
            }
        }
    );

});

router.get('/deleteLocation',function(req,res,next) {

    console.log(req.query.id);
    var id = req.query.id;

    request.delete(
        'http://localhost:8081/api/location/'+id,
        '',
        function (error, response, body) {
            if (!error && response.statusCode !== 200) {
                console.log("error");
            }
            else{
                console.log(body);
                request.get('http://localhost:8081/api/location','',function(error,response,body){
                    if (!error && response.statusCode !== 200) {
                        console.log("error");
                    }
                    else{
                        dataStr = body.toString();
                        dat = JSON.parse(dataStr);
                        console.log(dat.data);
                        res.render('viewLocation', {"locations":dat.data});
                    }
                });
            }
        }
    );

});

router.get('/displayEditLoc',function(req,res,next) {

    var location={};

    location["_id"] = req.query.id;
    location["block_number"] = req.query.blkNbr;
    location["unit_number"] = req.query.unitNbr;
    location["street"] = req.query.street;
    location["state"] = req.query.state;
    location["country"] = req.query.country;
    location["postal_code"] = req.query.postalCode;

    res.render('editLocation', {"location":location});

});

router.post('/editLocation',function(req,res,next) {

    console.log(req.body);

    request.put(
        'http://localhost:8081/api/location',
        {json: req.body},
        function (error, response, body) {
            if (!error && response.statusCode !== 200) {
                console.log("error");
            }
            else{
                console.log(body);
                request.get('http://localhost:8081/api/location','',function(error,response,body){
                    if (!error && response.statusCode !== 200) {
                        console.log("error");
                    }
                    else{
                        dataStr = body.toString();
                        dat = JSON.parse(dataStr);
                        console.log(dat.data);
                        res.render('viewLocation', {"locations":dat.data});
                    }
                });
            }
        }
    );
});

router.post('/getUnitNbrs',function(req,res,next) {
    console.log(req.body);

    if(req.body.postalCode!='') {
        request.get('http://localhost:8081/api/location/' + req.body.postalCode, '', function (error, response, body) {
            if (!error && response.statusCode !== 200) {
                console.log("error");
            }
            else {
                var unitNbrs = {};
                dataStr = body.toString();
                dat = JSON.parse(dataStr);
                console.log(dat.data);
                for (var loc in dat.data) {
                    unitNbrs[dat.data[loc]
                        .unit_number] = dat.data[loc]
                        .unit_number;
                }

                var unitNbrsArr = Object.keys(unitNbrs).map(function (key) {
                    return unitNbrs[key];
                });
                console.log(unitNbrsArr);
                res.json(unitNbrsArr);
            }
        });
    }
});


module.exports = router;