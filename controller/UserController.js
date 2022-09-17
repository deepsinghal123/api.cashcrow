const jsonwebtoken=require('jsonwebtoken')
const jsonsecret="5sa5sa67s66s66sa6saww"
const userModel=require('../db/userSchema.js');
const crypto =require('crypto')
const bcrypt = require('bcrypt');
const multer =require('multer')
const path=require('path')

const fs=require('fs')
//getting all product 
const autenticateToken= async(req,res,next)=>{
    if(req!=undefined){
        var token=null
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token=( req.headers.authorization.split(' ')[1]);
        } else if (req.query && req.query.token) {
            token=( req.query.token);
        }
        //console.log(req.header)
        if(token==null){
            res.json({"err":1,"msg":"Token not match"})
        }
        else {
            await jsonwebtoken.verify(token,jsonsecret,(err,data)=>{
                if(err){
                    res.send("Token expired")
                }
                else {
                    next();
                }
            })
        }
    }
    else{
        next()
    }
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'))
        //console.log(path.join(__dirname, './uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
        //console.log(file)
    }
});
const multi_upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype)
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('myfile', 1)
const registerUser= async (req, res , next)=>{
    console.log(req.body)
    let firstname=req.body.firstname;
    let lastname=req.body.lastname;
    let email=req.body.email;
    let mobile=req.body.mobilenumber;
    let gender=req.body.gender;
    var data={first_name:firstname,last_name:lastname,email:email}
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        if (err) throw err
        data={first_name:firstname,last_name:lastname,email:email,phone_no:mobile,gender:gender,password:hash,type:"register normal"}
        let ins=new userModel(data);
    //console.log(data)
    ins.save((err)=>{
        console.log(err)
        if(err){ res.json({ "success": false,err:"user already added",message:"user already added."})}
        else{
        res.json({ "success": true,
        "status_code": 200,
        "message": `${firstname +lastname} was registered successfully`
    });
        }
    })
            });
        });
        
        
        
        
    }
    
  


const getUser= async (req, res , next)=>{
    console.log("req.body")
    console.log(req.body)
    userModel.find({_id:req.body.userid},(err,data)=>{
        if(err) throw err;
        else{
            var data1=data
            console.log(data)
            if(data[0].gender==undefined){
                data1[0].gender="male"
            }
            if(data[0].phone_no==undefined){
                data1[0].phone_no=9999999998
            }
            if(data[0].DOB==undefined){
                data1[0].DOB="01/01/2000"
            }
            console.log(data1)
            res.send(data);}
        })
        console.log("getuser")
    }
    
    const loginUser= async (req, res , next)=>{
        let email=req.body.email;
    let password=req.body.password
    const saltRounds = 10;
    console.log(email,password)
    let token=jsonwebtoken.sign({ UID:email },jsonsecret,{ expiresIn: 60*60*60*24 }) //1 minute expire time for jwt token
    userModel.find({$and:[{email:email}]},(err,data)=>{
        if(err){
            res.json({"success" : false,err:err,message:"incorrect username And password."})
        }   
        else{
            console.log(data)
            if(data.length==0){
                res.json({"success" : false,err:"user not exist",message:"incorrect username And password."})
            }
            else{
            bcrypt.compare(password, data[0].password, function(err, result) {
                if(result){
                    const data1={
                    "first_name": data[0].first_name,
                    "last_name": data[0].last_name,
                    "email" : data[0].email ,
                    "phone_no": data[0].phone_no,
                    "gender": data[0].gender,
                    "userid":data[0]._id,
                    "profile_img":data[0].profile_img,
                    "address":data[0].Address,
                    "usertype":data[0].type
                }
                console.log(data1)
                if(data.length==0){
                    res.json({"success" : false,err:"user not exist",message:"incorrect username And password."})
                }
                else{
                    res.json({"success" : true,
                "status_code": 200,
                "message": "You have logged In",
                  "customer_details": data1,
                  "token":token
                });
                }
            }   
            else{
                res.json({"success" : false,err:err,message:"incorrect username And password."})
            }     
            
            });

        }
            
        }
    })
    }
    const getAllUser= async (req, res , next)=>{
        userModel.find({},(err,data)=>{
            if(err) throw err;
            else{
            res.json({data:data});           
            }
    
    })
}



module.exports= {registerUser,getUser,loginUser,autenticateToken,getAllUser}