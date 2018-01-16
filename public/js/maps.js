
var Latitude = undefined;
var Longitude = undefined;

var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    zoom: 1,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

map = new google.maps.Map
(document.getElementById("map"), mapOptions);

var marker = null;

socket.on('connect', () => {
    console.log('New User Connected');
});

socket.on('newLocation', (data) => {
    console.log(data);
    
    getMap(data.lat, data.lgn);

});


function getMap(latitude, longitude) {

    var latLong = new google.maps.LatLng(latitude, longitude);

    if (marker) {
        // Marker already created - Move it
        marker.setPosition(latLong);
      }
      else {
        // Marker does not exist - Create it
        marker = new google.maps.Marker({
          position: latLong,
          map: map,
          icon: 'https://i.stack.imgur.com/VpVF8.png'
        });
      }
    map.setZoom(30);
    map.setCenter(marker.getPosition());
}

socket.on('newSpeed',(data) => {
    console.log(`new Speed`,data.speed);
});

// function calculateSpeed(t1, lat1, lng1, t2, lat2, lng2) {
//     // From Caspar Kleijne's answer starts
//     /** Converts numeric degrees to radians */
//     if (typeof(Number.prototype.toRad) === "undefined") {
//       Number.prototype.toRad = function() {
//         return this * Math.PI / 180;
//       }
//     }
//     // From Caspar Kleijne's answer ends
//     // From cletus' answer starts
//     var R = 6371; // km
//     var dLat = (lat2-lat1).toRad();
//     var dLon = (lon2-lon1).toRad();
//     var lat1 = lat1.toRad();
//     var lat2 = lat2.toRad();
  
//     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) *    Math.cos(lat2); 
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//     var distance = R * c;
//     // From cletus' answer ends
  
//     return console.log(distance / t2 - t1);
//   }



