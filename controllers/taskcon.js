const em1 = require("../models/taskmod")
const { v4: uuidv4 } = require('uuid');
let addtask=async(req,res)=>{
    try{
        let data=new em1({...req.body,"_id":uuidv4()})
        data.save()
        res.send({"msg":"Task Added"})
    }
    catch{
        res.send({"msg":"Task Couldn't Be Added"})
    }
}


let emphome=async(req,res)=>{
    try{
        let data=await em1.find({"eid":req.params.eid})
        res.send(data)
    }
    catch{
      res.send({"msg":"Task Couldn't Be Fetched"})  
    }
}


let updst=async(req,res)=>{
    try{
        await em1.findByIdAndUpdate(req.params.tid,{"status":req.params.st})

        res.send({"msg":"Task Updated"})  
    }
    catch{
        res.send({"msg":"Task Couldn't Be Updated"})  
    }
}



let disp=async(req,res)=>{
    try{
        let data=await em1.aggregate([{$sort:{"status":-1}}])
        res.json(data)
    }
    catch{
       res.send({"msg":"Data Couldn't Be Found"}) 
    }
}


let del=async(req,res)=>{
    try{
    await em1.findByIdAndDelete(req.params.tid)
    res.send({"msg":"Data Deleted"}) 
    }
    catch{
        res.send({"msg":"Data Couldn't Be Deleted"}) 
    }
}


let reas=async(req,res)=>{
    try{
        let data=await em1.findByIdAndUpdate(req.params.tid,{"eid":req.body.eid,"status":"created"})
        res.send(data) 
    }
    catch{
       res.send({"msg":"Data Couldn't Be Re-Assigned"}) 
    }
}
module.exports={addtask,emphome,updst,disp,del,reas}