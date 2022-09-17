const express=require('express')
const userController = require( '../controller/UserController')
const router=express.Router()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
router.post("/registeruser",userController.registerUser)
router.post("/getuser",userController.getUser)
router.post("/loginuser",userController.loginUser)
router.get("/getalluser",userController.getAllUser)
//end
module.exports=router;