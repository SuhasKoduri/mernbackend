let express=require("express")
let mongoose=require("mongoose");
const rt = require("./routes/route");
let cors=require("cors")
require('dotenv').config()
let app=new express()
mongoose.connect(process.env.uri).then(()=>{
    app.listen(process.env.port)
    console.log("Ok");
    
}).catch(()=>{
    console.log("Not Ok");
    
})
app.use(express.json())
app.use(cors())
app.use("/",rt)