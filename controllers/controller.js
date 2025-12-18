const em = require("../models/model")
let bcrypt=require("bcrypt")
let jwt=require("jsonwebtoken")
let nodemailer = require("nodemailer")
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
  service: "gmail",
  auth: {
    user: "suhaskoduri47@gmail.com",
    pass: process.env.mailpwd,
  },
});

const fpwd = async (req, res) => {
  try {
    const obj = await em.findById(req.params.id);
    if (!obj) {
      return res.json({ msg: "Check Your Mail ID" });
    }

    // ✅ OTP generation (your logic)
    const num = Math.floor(Math.random() * 100000).toString();
    const otp = num.padEnd(5, "0");

    await em.findByIdAndUpdate(obj._id, { otp });

    await transporter.sendMail({
      from: `"OTP Service" <${process.env.GMAIL_USER}>`,
      to: obj._id, // email stored as _id
      subject: "OTP For Verification",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    return res.json({ msg: "OTP Sent" });
  } catch (err) {
    console.error("OTP MAIL ERROR:", err);
    return res.json({ msg: "OTP Couldn't be sent" });
  }
};




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