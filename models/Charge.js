let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ChargeSchema = new Schema({
    chargeInfo : {
        type: String,
        required: true
    },
    chargeRS : {
        type: Number,
        required: true
    }
});


let Charge = mongoose.model('Charges', ChargeSchema);