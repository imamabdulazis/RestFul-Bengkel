const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://devopsimun:' + process.env.MONGO_ATLAS_PW + '@belajar-mghf7.mongodb.net/Bengkel?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

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


app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));

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



app.use((req, res, next) => {
    const error = new Error("Tidak Ditemukan");
    error.status = 404;
    next(error);
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