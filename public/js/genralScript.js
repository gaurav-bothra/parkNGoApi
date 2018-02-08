$('#trackUser').on('click', () => {
    window.location.assign('/admin/trackUser');
});

$('#onlineUser').on('click', () => {
    window.location.assign('/admin/onlineUsers');
});

$('#totalUser').on('click', () => {
    window.location.assign('/admin/totalUsers');
});

$('#currentSpeed').on('click', () => {
    window.location.assign('/user/currentSpeed');
});

$('#currentLocation').on('click', () => {
    window.location.assign('/user/currentLocation');
});

$('#travelDistance').on('click', () => {
    window.location.assign('/user/travelDistance');
});

$('#history').on('click', () => {
    window.location.assign('/user/history');
});

$('#carAdded').on('click', () => {
    window.location.assign('/user/car');
});

$('#userLicense').on('click', () => {
    window.location.assign('/user/userLicense');
});

function getUsersCar(id){
    fetch('http://localhost:10081/api/user/cars/'+id)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data);
        for(var i = 0; i <= data.vehicleInfo.length - 1; i++){
            $('#dropdown1').append(`<li><a href="#!">${data.vehicleInfo[i].vehicleType}</a></li>`);
        }
    })
}



