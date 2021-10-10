const Transaction_Model = require('./models/Transactions');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/banksystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

class IMPORT_DB {
  import_Transactions(objTransaction) 
  {
    var flag = true;
    Transaction_Model.collection.insertMany(objTransaction,onInsert)
    function onInsert(err,docs){
      if(err){
        flag=false
      }
      else{
        console.info('transaction were successfully stored.', objTransaction.length);
      }
    }
   // mongoose.disconnect()
    return flag
  }
}

module.exports = new IMPORT_DB()
