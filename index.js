const express = require("express");
const fs = require('fs');
const session = require('express-session');
const keyCloak = require('keycloak-connect');
const cors = require("cors");
const bodyParser = require('body-parser')


var https = require('https');
var options = {
    key: fs.readFileSync('secure/sslcert/privatekey.pem', 'utf8'),
    cert: fs.readFileSync('secure/sslcert/certificate.pem', 'utf8')
};

const app = express();

https.createServer(options, app).listen(8443, () => {
    console.log('server is listening')
});

app.use(bodyParser.json());

var memoryStore = new session.MemoryStore()
app.use(session({
    secret: 'Mysecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}))
app.use(cors());

const keycloak = require('./keycloak-config').initKeycloak();
app.use(keycloak.middleware());

const routeController = require('./controller/RouteController');

app.use('/api', routeController);

app.get('/', function(req, res){
    res.send("Server is up!");
});

