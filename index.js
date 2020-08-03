const app = require('./app');

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("listen port 3000")
});

// const server = http.createServer(app);

// server.listen(port, () => {
//     console.log("APP SART 3000");
// });
