const mongoose=require('mongoose');
const db="mongodb+srv://cashcrow:mongo786786@cluster0.cnobfr3.mongodb.net/?retryWrites=true&w=majority";
const connectDB=async()=>{
    try{
      await mongoose.connect(db,{useNewUrlParser:true});
      console.log("MongoDb Connected");
    }
    catch(err){
      console.log(err.message);
    }
  }


module.exports=connectDB