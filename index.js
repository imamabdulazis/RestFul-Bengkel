const app = require('./app');
// const express = require("express");
// const app = express();

let port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log("listen port 3000")
});

// const server = http.createServer(app);

// server.listen(port, () => {
//     console.log("APP SART 3000");
// });
