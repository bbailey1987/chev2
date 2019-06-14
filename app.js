const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      datasource = require('./routes/datasource'),
      auth = require('./routes/auth'),
      app = express(),
      mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/chevron', { promiseLibrary: require('bluebird') })
    .then(() => console.log('Connection successful!'))
    .catch(err => console.error(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended' : false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/datasource', datasource);
app.use('/api/auth', auth);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// restful api error handler
app.use((err, req, res, next) => {
    console.log(err);

    if (req.app.get('env') != 'development') {
        delete err.stack;
    }

    res.status(err.statusCode || 500).json(err);
});

module.exports = app;