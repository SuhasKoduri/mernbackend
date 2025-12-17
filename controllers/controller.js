const em = require("../models/model")
let bcrypt=require("bcrypt")
let jwt=require("jsonwebtoken")
const nodemailer = require("nodemailer");
require('dotenv').config()
let add=async(req,res)=>{
    try{
        let obj=await em.findById(req.body._id)
        if(obj)
        {
            res.json({"msg":"User Already Registered"})
        }
        else
        {
            let hashcode=await bcrypt.hash(req.body.pwd,Number(process.env.rot))
            let data=new em({...req.body,pwd:hashcode})
            await data.save()
            res.json({"msg":"User Registration Successful"})
        }
    }
    catch(err){
        console.log(err)
        res.json({"msg":"Employee Couldn't Be Registered"})
    }
}

let login=async(req,res)=>{
    try{
        let obj=await em.findById(req.body._id)
        if(obj)
        {
            let pass=await bcrypt.compare(req.body.pwd,obj.pwd)
            if(pass)
            {
                res.json({"jwtoken":jwt.sign({_id:obj._id},process.env.secpwd),"name":obj.name,"role":obj.role,"eid":obj._id})
            }
            else
            {
                res.json({"msg":"Check Your Password"})
            }
        }
        else{
            res.json({"msg":"Check Your Mail ID"})
        }
    }
    catch{
        res.json({"msg":"User Login Failed"})
    }
}


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "suhaskoduri47@gmail.com",
    pass: process.env.mailpwd,
  },
});


let fpwd=async(req,res)=>{
    let obj=await em.findById(req.params.id)
    if(obj)
    {
        let num=Math.floor(Math.random()*100000)+""
        let otp=num.padEnd(5,"0")
        await em.findByIdAndUpdate(obj._id,{"otp":otp})
        
        const info = await transporter.sendMail({
            from: '"<noreply>" <suhaskoduri47@gmail.com>',
            to: obj._id,
            subject: "OTP For Verification",
            html: otp
        });

        if(info.accepted.length>0)
        {
            res.json({"msg":"OTP Sent"})
        }
        else{
            res.json({"msg":"OTP Couldn't be sent"})
        }
    }
    else{
        res.json({"msg":"Check Your Mail ID"})
    }
}


let vpwd=async(req,res)=>{
    try{
        let data=await em.findById(req.body._id)
        
        if(data.otp==req.body.otp)
        {
            await em.findByIdAndUpdate(data._id,{"otp":""})
            res.json({"msg":"OTP VERIFIED"})
        }
        else{
            res.json({"msg":"Wrong OTP"})
        }
    }
    catch{
        res.json({"msg":"OTP Couldn't Be Verified"})
    }
}


let respwd=async(req,res)=>{
    try{
    let hashcode=await bcrypt.hash(req.body.pwd,process.env.rot)
    let data=await em.findByIdAndUpdate(req.body._id,{"pwd":hashcode})
    if(data != null)
    {
    res.json({"msg":"Password Reset Successfull"})
    }
    else{
        res.json({"msg":"Password Reset Not Successful"})
    }
    }
    catch{
        res.json({"msg":"Password Couldn't Be Reset"})
    }

}



let gettask=async(req,res)=>{
    try{
        let data=await em.find({"dept":req.params.dept},{name:1,role:1})
        res.json(data)
    }
    catch{
        res.json({"msg":"Couldn't Fetch Data"})
    }
}
module.exports={add,login,fpwd,vpwd,respwd,gettask}