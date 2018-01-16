let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ReservationSchema = new Schema({
    VehicleID : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Vehicles'
    },
    Registration_No : {
        type: String,
        required: true
    },
    Date : {
        type: Date,
        required: true,
        default: Date.now()
    },
    Time_In : {
        type: Date,
        required: true,
        default: Date.now
    },
    Time_Out : {
        type: Date,
        required: false,
    }
});

ReservationSchema.statics.findByVehicleId = function(vehicleID) {
    console.log('h3llo');
    let Reservation = this;
    return Reservation.findOne({vehicleID}).then((reservation) => {
        if(!reservation) {
            return Promise.reject();
        }
        return Promise.resolve(reservation);
    })
};


let Reservation = mongoose.model('Reservations', ReservationSchema);

