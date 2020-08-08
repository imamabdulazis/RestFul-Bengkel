function Deg2Rad(deg) {
    return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
}

function NearestCity(latitude, longitude, locations) {
    var mindif = 99999;
    var closest;

    for (index = 0; index < locations.length; ++index) {
        var dif = PythagorasEquirectangular(latitude, longitude, locations[index][1], locations[index][2]);
        if (dif < mindif) {
            closest = index;
            mindif = dif;
        }
    }

    var closestLocation = (locations[closest]);
    // console.log('Lokasi terdekat :' + closestLocation[0]);
    return closestLocation;
}

module.exports = NearestCity;



// let cities = [
//     ["Yogyakarta", -7.797068, 110.370529],
//     ["Semarang", -6.966667, 110.416664],
//     ["Banten", -6.120000, 106.150276],
//     ["Pekalongan", -6.888701, 109.668289],
//     ["Wonosobo", -7.353126, 109.906090],
//     ["Jakarta", -6.200000, 106.816666],
// ];
// // // //test ugm
// // let targetLocation = {
// //     latitude: -7.76591,
// //     longitude: 110.37742
// // };

// // test UI
// let targetLocation = {
//     latitude: -6.360768,
//     longitude: 106.831724
// };
// // //test undip semarang
// // let targetLocation = {
// //     latitude: -7.049000,
// //     longitude: 110.438004
// // };
