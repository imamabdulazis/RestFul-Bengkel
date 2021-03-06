const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(
    'mongourl', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access_Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type,Accept,Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({})
    }
    next();
})

const userAdminRoutes = require('./api/routes/userAdmin');

const userRoutes = require('./api/routes/user');
const bengkelRoutes = require('./api/routes/bengkel');
const kategoriRoutes = require('./api/routes/kategori');

const produkRoutes = require("./api/routes/produk");
const servisRoutes = require("./api/routes/servis");
const orderRoutes = require("./api/routes/order");

const artikelRoutes = require('./api/routes/artikel');
// by bengkel
const kategoriBengkelRoutes = require('./api/routes/_kategoriBengkel');
const produkBengkelRoutes = require('./api/routes/_produkBengkel');
const servisBengkelRoutes = require('./api/routes/_servisBengkel');

// by user
const userServisRoutes = require('./api/routes/_userServis');

const findBengkel = require('./api/routes/_findNearbyBengkel');

// notifikasi
const devUser = require('./api/routes/_deviceUser');
const devBengkel = require('./api/routes/_deviceBengkel');

const notifikasi = require('./api/routes/notifikasi');
const notif = require('./utils/notification');

const report = require('./api/routes/report');

const antrian = require('./api/routes/antrian');

const email = require('./email');


app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));

app.use('/userAdmin', userAdminRoutes);

app.use('/user', userRoutes);
app.use('/bengkel', bengkelRoutes);

app.use('/kategori', kategoriRoutes);

app.use("/produk", produkRoutes);
app.use("/servis", servisRoutes);
app.use("/order", orderRoutes);

app.use('/artikel', artikelRoutes);


// by bengkel
app.use('/bengkel/kategori', kategoriBengkelRoutes);
app.use('/bengkel/produk', produkBengkelRoutes);
app.use('/bengkel/servis', servisBengkelRoutes);

// by user
app.use('/user/servis', userServisRoutes);


// find bengkel
app.use('/findBengkel', findBengkel);

// notifikasi
app.use('/deviceUser', devUser);
app.use('/deviceBengkel', devBengkel);
app.use('/notifikasi', notifikasi);
// test
app.use('/notification', notif);

// report
app.use('/report', report);


// antrian
app.use('/antrian', antrian);

// email
app.use('/email', email);


app.use((req, res, next) => {
    res.sendfile(__dirname + '/public/index.html');
    // const error = new Error("Tidak Ditemukan");
    // error.status = 404;
    // next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

module.exports = app;
