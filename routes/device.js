var express = require('express');
var router = express.Router();
var request = require('request');
var dat = '';
var dataStr = '';

/* GET home page. */
router.get('/dashboard', function (req, res, next) {
    console.log("In dashboard");
    res.render('dashboardDevice');
});

router.get('/registerDevice', function (req, res, next) {
    console.log("In register Device");

    request.get('http://localhost:8081/api/location', '', function (error, response, body) {
        if (!error && response.statusCode !== 200) {
            console.log("error");
        }
        else {
            var options = {};
            var postalCode = {};

            options['blood'] = 'Blood Pressure';
            options  ['gluco'] = 'Glucometer';
            options['weighing'] = 'Weighing Machine';
            options['scream'] = 'Scream Sensor';
            options['fitbit'] = 'Fit Bit';

            dataStr = body.toString();
            dat = JSON.parse(dataStr);

            for (var loc in dat.data) {
                postalCode[dat.data[loc]._id] =
                    dat.data[loc].postal_code;
            }

            console.log(postalCode);

            res.render('registerDevice', {
                "options": options,
                "postalCode": postalCode
            });
        }
    });
});

router.get('/viewDevice', function (req, res, next) {

    console.log("In view Device");
    request.get('http://localhost:8081/api/device', '', function (error, response, body) {
        if (!error && response.statusCode !== 200) {
            console.log("error");
        }
        else {
            dataStr = body.toString();
            dat = JSON.parse(dataStr);
            console.log(dat.data);
            res.render('viewDevice', {"devices": dat.data});
        }
    });
});

router.post('/registerDevice', function (req, res, next) {

    console.log(req.body);

    request.post(
        'http://localhost:8081/api/device',
        {json: req.body},
        function (error, response, body) {
            if (!error && response.statusCode !== 200) {
                console.log("error");
            }
            else {
                request.get('http://localhost:8081/api/location', '', function (error, response, body) {
                    if (!error && response.statusCode !== 200) {
                        console.log("error");
                    }
                    else {
                        var options = {};
                        var postalCode = {};

                        options['blood'] = 'Blood Pressure';
                        options  ['gluco'] = 'Glucometer';
                        options['weighing'] = 'Weighing Machine';
                        options['scream'] = 'Scream Sensor';
                        options['fitbit'] = 'Fit Bit';

                        dataStr = body.toString();
                        dat = JSON.parse(dataStr);

                        for (var loc in dat.data) {
                            postalCode[dat.data[loc]._id] =
                                dat.data[loc].postal_code;
                        }

                        console.log(postalCode);

                        res.render('registerDevice', {
                            "options": options,
                            "postalCode": postalCode
                        });
                    }
                });
            }
        }
    );

});

router.get('/deleteDevice', function (req, res, next) {

    console.log(req.query.id);
    var id = req.query.id;

    request.delete(
        'http://localhost:8081/api/device/' + id,
        '',
        function (error, response, body) {
            if (!error && response.statusCode !== 200) {
                console.log("error");
            }
            else {
                console.log(body);
                request.get('http://localhost:8081/api/device', '', function (error, response, body) {
                    if (!error && response.statusCode !== 200) {
                        console.log("error");
                    }
                    else {
                        dataStr = body.toString();
                        dat = JSON.parse(dataStr);
                        console.log(dat.data);
                        res.render('viewDevice', {"devices": dat.data});
                    }
                });
            }
        }
    );

});

router.get('/displayEditDev', function (req, res, next) {

    var device = {};

    device["device_id"] = req.query.id;
    device["device_name"] = req.query.name;
    device["device_type"] = req.query.type;
    device["device_description"] = req.query.desc;
    device["postal_code"] = req.query.postalCode;
    device["unit_number"] = req.query.unitNbr;

    var options = {};

    options['Blood Pressure'] = 'Blood Pressure';
    options ['Glucometer'] = 'Glucometer';
    options['Weighing Machine'] = 'Weighing Machine';
    options['scream'] = 'Scream Sensor';
    options['fitbit'] = 'Fit Bit';

    res.render('editDevice', {"device": device, "options": options});

});

router.post('/editDevice', function (req, res, next) {

    console.log(req.body);

    request.put(
        'http://localhost:8081/api/device',
        {json: req.body},
        function (error, response, body) {
            if (!error && response.statusCode !== 200) {
                console.log("error");
            }
            else {
                console.log(body);
                request.get('http://localhost:8081/api/device', '', function (error, response, body) {
                    if (!error && response.statusCode !== 200) {
                        console.log("error");
                    }
                    else {
                        dataStr = body.toString();
                        dat = JSON.parse(dataStr);
                        console.log(dat.data);
                        res.render('viewDevice', {"devices": dat.data});
                    }
                });
            }
        }
    );
});

module.exports = router;