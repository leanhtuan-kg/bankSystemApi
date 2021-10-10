const ExcelJS = require('exceljs');
const fs = require('fs');
const workbook = new ExcelJS.Workbook();
//implement validation 
const Validate = require('./ValidationRowsExcel')
//implement mongo
const MongoDB=require('../connectDB')

function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);

    //return new Date(date_info.getDate(),date_info.getMonth(),date_info.getFullYear(),hours, minutes, seconds);
}

class PPROCESS_EXCEL {

    async readFileImport(path) {
        var flag = false
        const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(path);
        var listtransaction = []
        var firstRow = true
        for await (const worksheetReader of workbookReader) {
            for await (const row of worksheetReader) {
                if (firstRow)
                    firstRow = false
                else if (row.values != null && row.values.length == 5) {
                    try {
                        var transaction = {}
                        //remove header
                        var filter = row.values.splice(1)
                        //convert Date
                        var Iso_Date = (ExcelDateToJSDate(filter[0]))
                        var convertDate =
                            ((Iso_Date.getDate() > 9) ? Iso_Date.getDate() : ('0' + Iso_Date.getDate())) +
                            '/' + ((Iso_Date.getMonth() > 8) ? (Iso_Date.getMonth() + 1) : ('0' +
                                (Iso_Date.getMonth() + 1))) + '/' + Iso_Date.getFullYear() + '/' + ' ' +
                            Iso_Date.getHours() + ':' + Iso_Date.getMinutes() + ':' + Iso_Date.getSeconds()
                        // -----------
                        transaction.date = convertDate
                        transaction.content = filter[1]
                        transaction.mount = filter[2]
                        transaction.type = filter[3]
                        //--validation data
                        flag = Validate.validater(transaction)
                        if (!flag)
                            break;
                        // --end validata
                        listtransaction.push(transaction)

                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
        //---- end steam
        fs.unlink(path, (err) => {
            if (err) {
              console.error(err)
            }         
        //file removed
        })
        //insert to mongodb
        if (flag) {
            flag=MongoDB.import_Transactions(listtransaction)
        }
        return flag
    }
}
module.exports = new PPROCESS_EXCEL()

