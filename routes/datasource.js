const express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      Datasource = require('../models/Datasource.js'),
      passport = require('passport');
      require('../config/passport')(passport);
const multer = require('multer'),
      upload = multer();

getToken = (headers) => {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

router.post('/', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {
    const token = getToken(req.headers);
    console.log('/datasource req.body.file', req.body.file);
    console.log('req.file', req.file);
    // TODO: Parse csv into JSON
    // TODO: Begin to use sessions
    if (token) {
        Datasource.create(req.body, (err, datasource) => {
            if (err) return next(err);
            res.json(datasource);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    console.log('PROTECTED GET ROUTE FOR DATASOURCE', token);
    if (token) {
        Datasource.find((err, datasource) => {
            if (err) return next(err);
            res.json(datasource);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});

module.exports = router;