const express = require("express");
const fs = require('fs');
const session = require('express-session');
const keyCloak = require('keycloak-connect');
const cors = require("cors");
const bodyParser = require('body-parser')
const multer = require('multer')
const XL_CSV = require('./controller/ProcessCSV')
const XL_EXCEL = require('./controller/ProcessExcel')
/////

global.__basedir = __dirname;
// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        //cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });
// end Multer

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
//app.use(bodyParser.urlencoded({ extended: false}));

var memoryStore = new session.MemoryStore()
app.use(session({
    secret: 'Mysecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}))
app.use(cors());

var keycloak = new keyCloak({
    store: memoryStore
})
app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/'
}))

app.get('/test',keycloak.protect(),(req,res)=>{
    res.send('test API')
})

app.post('/restful-service', keycloak.protect(), upload.single("import_file"), async (req, res) => {

        res.setHeader("Content-type","application/json")
        //check file extension like xlsx or csv
        if (!req.file) {
            console.log("file not exist!")
            res.status(404).json({ "message": "file not exist" })
        }
        else {
            var extension = req.file.filename.split(".").pop()
            var kindOfextension = ['xlsx', 'csv'].indexOf(extension)

            if (kindOfextension < 0) {
                res.status(404).json({ message: 'Invalid filename extension ! Only Accepted .xlsx and .csv' });
            }
            else if (kindOfextension == 0) {
                //cal process xlsx
                var result_client = ''
                var path = `./uploads/${req.file.filename}`
                XL_EXCEL.readFileImport(path).then(
                    function (result) {
                            if(result)
                                res.status(201).json({"message":"import complete"})
                            else
                                res.status(404).json({"message":"import fail import file not valid"})
                    }
                )

            }
            else {
                //cal process csv 
                var path = `./uploads/${req.file.filename}`
                XL_CSV.readFileImport(path,function(err,rs){
                    if(err) return next(err);
                    if(rs){
                        res.status(201).json({"message":"import complete"})
                    }
                    else{
                        res.status(404).json({"message":"import fail import file not valid"})
                    }
                })    
            }
        }
    

})

