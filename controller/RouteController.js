var express = require('express');
const multer = require('multer')
const XL_CSV = require('./ProcessCSV')
const XL_EXCEL = require('./ProcessExcel')
var router = express.Router();

const keycloak = require('../keycloak-config').getKeycloak();

global.__basedir = __dirname;
// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

router.get('/anonymous', function(req, res){
    res.send("Hello Anonymous");
});

router.get('/test',keycloak.protect(),(req,res)=>{
    res.send('test API')
})

router.post('/import_transactions', keycloak.protect(), upload.single("import_file"), async (req, res) => {

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

module.exports = router;