let mongoose=require("mongoose")
let sch1=new mongoose.Schema({
    "_id":String,
    "title":String,
    "desc":String,
    "status":{
        type:String,
        default:"created"
    },
    "eid":String
})

let em1=mongoose.model("Empdb1",sch1)

module.exports=em1