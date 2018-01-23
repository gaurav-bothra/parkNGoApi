let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let VehicleSchema = new Schema({
    UserId : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    
    vehicleInfo : [{
        vehicleType : {
            type: String,
            required: true
        },
        vehicleNo : {
            type: String,
            required: true
        },
        vehicleModel : {
            type: String,
            required: true
        },
        vehicleCompany : {
            type: String,
            required: true
        }
    }]
},{usePushEach: true });

VehicleSchema.statics.findByUserId = function(UserId) {
    console.log('h3llo');
    console.log('UserId in vehicle',UserId)
    let Vehicle = this;
    return Vehicle.findOne({UserId}).then((vehicle) => {
        if(!vehicle) {
            console.log("Vehicle Nhi Mila");
            return Promise.reject();
        }
        return Promise.resolve(vehicle);
    })
};


let Vehicle = mongoose.model('Vehicles', VehicleSchema);