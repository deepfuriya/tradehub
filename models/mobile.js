const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mobileSchema = new Schema({
    item_category : {type: String, required: [true, 'Item category is required']},
    item_name : {type: String, required: [true, 'Item name is required']},
    details : {type: Array, required: [true, 'Item details are required']},
    status : {type: String},
    image : {type: String, required: [true, 'Item image is required']},
    price : {type: String, required: [true, 'Item price is required']},
    created_by : {type: Schema.Types.ObjectId, ref: 'User'}
},
{timestamps: true}

);


module.exports = mongoose.model('Mobile',mobileSchema);



