var mongoose = require('mongoose');
var RestaurantSchema = new mongoose.Schema({
    rest_id: mongoose.Schema.Types.ObjectId,
    name:String,
    type:String,
    priceRate:String,
    starRate:String,
    latitude:String,
    longitude:String
});
RestaurantSchema.methods.rate = function(ent){
    this.status = "finished";
    this.save(ent);
};
mongoose.model('Restaurant', RestaurantSchema);