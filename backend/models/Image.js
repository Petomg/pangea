let mongoose = require('mongoose');
 
let imageSchema = new mongoose.Schema({
    img:
    {
        data: Buffer,
        contentType: String
    }
});
 
 
module.exports = new mongoose.model('Image', imageSchema);