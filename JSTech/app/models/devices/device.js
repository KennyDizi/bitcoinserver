module.exports = function(){ 
  var mongoose = require('mongoose'); 
  var devicesSchema = mongoose.Schema({ secret: String, description: String, status: Boolean }); 
  return mongoose.model('device', devicesSchema);
}