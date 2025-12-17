let mongoose=require("mongoose")
let sch=new mongoose.Schema({
    "_id":String,
    "name":String,
    "dept":String,
    "pwd":String,
    "role":{
        type:String,
        default:"emp"
    },
    "otp":{type:String,
           default:""
          }
})

let em=mongoose.model("Empdb",sch)

module.exports=em