let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ReservationSchema = new Schema({
    UserVehicleId : {
        type: Schema.Types.ObjectId,
        required: true
    },
    Reservation_Info : [{
    VehicleID:{
        type:Schema.Types.ObjectId,
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
}]
},{usePushEach: true });

ReservationSchema.statics.findByVehicleId = function(vehicleID) {
    console.log('in reservation');
    console.log('in reservation vid' , vehicleID);
    let Reservation = this;
    return Reservation.findOne({vehicleID}).then((reservation) => {
        console.log('reservation',  reservation);
        if(!reservation) {
            console.log('not find');
            return Promise.reject();
        }
        // reservation.Date = new Date(reservation.Date);
        return Promise.resolve(reservation);
    })
};


let Reservation = mongoose.model('Reservations', ReservationSchema);

