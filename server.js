const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, server.env);
});