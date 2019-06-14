const mongoose = require('mongoose'),
      passport = require('passport'),
      settings = require('../config/settings');
      require('../config/passport')(passport);
const express = require('express'),
      jwt = require('jsonwebtoken'),
      router = express.Router(),
      Contractor = require('../models/Contractor');

router.post('/login', (req, res) => {
    Contractor.findOneAndUpdate({ userName: req.body.userName }, req.body, { upsert: true }, (err, contractor) => {
        if (err) throw err;

        console.log('req.body', req.body);
        console.log('contractor', contractor)
        /*
        if (!contractor) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User could not be inserted or found.' });
        } else {
            const token = jwt.sign(contractor? contractor.toJSON() : req.body, settings.secret);
            console.log('token', token);
            res.json({ success: true, token: `JWT ${token}` });
        }*/
        const token = jwt.sign(contractor ? contractor.toJSON() : req.body, settings.secret);
        console.log('token', token);
        res.json({ success: true, token: `JWT ${token}` });
    });
});

module.exports = router;