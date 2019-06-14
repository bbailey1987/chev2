const mongoose = require('mongoose');

const DatasourceSchema = new mongoose.Schema({
    id : String
});

module.exports = mongoose.model('Datasource', DatasourceSchema);