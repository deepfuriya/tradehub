const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tradeDataSchema = new Schema({
    creater_user_id : {type: Schema.Types.ObjectId, ref: 'User',required: [true, 'User field is required']},
    trade_item : {type: Schema.Types.ObjectId, ref: 'Mobile',required: [true, 'Trade item is missing']},
    accepter_user_id : {type: Schema.Types.ObjectId, ref: 'User',required: [true, 'User field is required']},
    trade_with : {type: Schema.Types.ObjectId, ref: 'Mobile',required: [true, 'Trade item is missing']},
    status : {type: Number}
});

module.exports = mongoose.model('TradeData',tradeDataSchema);