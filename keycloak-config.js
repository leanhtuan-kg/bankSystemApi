
var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
    "realm": "BANK_TRANSACTION",
    "auth-server-url": "http://localhost:8080/auth/",
    "ssl-required": "external",
    "resource": "transaction_api",
    "credentials": {
      "secret": "40d9c855-c89c-4ad7-98d9-3aacd0133e04"
    },
    "confidential-port": 0
  };

function initKeycloak() {
    if (_keycloak) {
        console.warn("Trying to init Keycloak again!");
        return _keycloak;
    } 
    else {
        console.log("Initializing Keycloak...");
        var memoryStore = new session.MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    } 
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};