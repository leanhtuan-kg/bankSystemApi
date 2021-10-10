var validator = require('validator');
class VALIDATION{
    validater(Obj){
        try {
                        var val_Date=false
                        var type=false
                        var flag=false
                        Obj.mount = Number(Obj.mount)
                        if(typeof Obj.date === 'number')
                            val_Date=false
                        else
                            val_Date=validator.isDate(Obj.date,"dd/mm/yyyy hh:mm:ss")
                    
                        if(typeof Obj.type === 'number')
                            type = false
                        else
                            type=['deposit','withdraw'].indexOf(Obj.type.toLowerCase())<0? false:true
                
                        flag=
                            (val_Date && type && Obj.type.toLowerCase()==='withdraw' && typeof Obj.mount === 'number' && Obj.mount < 0 
                                  || type && Obj.type.toLowerCase() ==='deposit' && typeof Obj.mount === 'number' && Obj.mount > 0
                            )? true:false
                        return flag
        } catch (error) {
                console.log(error)
                return false
        }

    }
}
module.exports=new VALIDATION()


