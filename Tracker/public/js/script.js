const socket = io();

if(navigator.geolocation){
    // navigator.geolocation.getCurrentPosition((position) => {
    //     console.log(position);
    // })
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("sendLocation", {latitude, longitude});
    }, (error) => {
        console.error(error);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    })
}

// let map = L.map("map").setView([51.505, -0.09], 13);
let map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 100,
    attribution: '© OpenStreetMap'
}).addTo(map);

let marker = {};
socket.on("receiveLocation", (location) => {
    const {id, latitude, longitude} = location;
    map.setView([latitude, longitude]);
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude]);
    }else{
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
socket.on("disconnect-user", (id) => {
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});