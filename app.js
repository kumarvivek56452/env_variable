const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app= express()
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", 'ejs');
mongoose.connect("mongodb://0.0.0.0:27017/ueserDB",{useNewUrlParser:true})

const userSchema=new mongoose.Schema({username:String, password:String})


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})

const userModel = new mongoose.model("User",userSchema)

app.get("/",function(req, res){
    res.render("home")
})

app.get("/login",function(req, res){
    res.render("login")
})

app.get("/register",function(req, res){
    res.render("register")
})
app.post("/register",function(req, res){
    const user = new userModel({username:req.body.username,password:req.body.password})
    user.save().then(res.render("secrets")).catch((err)=>console.log(err))
})

app.post("/login",function(req, res){
    const userN=req.body.username;
    const passN=req.body.password
    userModel.findOne({username:userN,password:passN}).then(function(founded){
        if(founded.password===passN){
            res.render("secrets")
        }}

    ).catch((err)=>console.log(err))
})

app.listen("3000", function(req, res){
    console.log("port runining on server 3000")
});