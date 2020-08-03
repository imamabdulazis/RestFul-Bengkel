// const app = require('./app');
const express = require("express");
const app = express();

let port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send("test")
})

app.listen(port, () => {
    console.log("listen port 3000")
});

// const server = http.createServer(app);

// server.listen(port, () => {
//     console.log("APP SART 3000");
// });
