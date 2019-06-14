const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const ContractorSchema = new Schema({
    userName: String
});

module.exports = mongoose.model('Contractor', ContractorSchema);