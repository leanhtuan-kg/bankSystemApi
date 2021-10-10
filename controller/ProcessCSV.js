const fs = require("fs");
const fastcsv = require("fast-csv");
let csvData = [];
let header = true
const Validation = require('./ValidationRowsExcel')
const MongoDB=require('../connectDB')
var textdemo=''
class PROCESS_CSV {
  readFileImport(path,cb) {
    var flag=false
    let stream = fs.createReadStream(path);
    
    const csvStream = 
      fastcsv
      .parse()
      .on("data", function (data) {
        if (header) {
          header = false
        }
        else {
          try {
            let transaction =
            {
              "date": data[0],
              "content": data[1],
              "mount": data[2],
              "type": data[3]
            }
            flag = Validation.validater(transaction)
            if (!flag) {
               csvStream.end
            }
            else {
              csvData.push(transaction);
            }
          } catch (error) {
              console.log(error)
          }

        }

      })
      .on("end", function () {
            //remove file
            fs.unlink(path, (err) => {
                if (err) {
                  console.error(err)
                }         
            })
            if(!flag){
              console.log('import fail')
            }
            else{
              //insert to mongodb
              flag=MongoDB.import_Transactions(csvData)   
            }
            cb(null,flag)
      });
      stream.pipe(csvStream);
  }
}
module.exports=new PROCESS_CSV()
