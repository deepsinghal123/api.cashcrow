const express=require('express')
const PORT=3000
const app=express()
const cors=require('cors')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())
app.use('/images',express.static('uploads'))
const userRoutes=require('./routes/userRoutes')
const connectDb=require('./Connection/connectDB')
app.set('view engine','ejs')
connectDb()
//User
app.use('/api/',userRoutes)
//end
app.get("/api_campaign", async(req, res) => {
  await fetch('https://inrdeals.com/fetch/stores?id=dee542885700&token=1e17a6fe633f7fd3b461e9c27fdbf66deaf30b2b',{mode:'cors'}).then(data=>data.json()).then(data=>res.json(data)) 
});

app.get("/api_campaigns/:store_id", async(req, res) => {
  await fetch('https://inrdeals.com/fetch/stores?id=dee542885700&token=1e17a6fe633f7fd3b461e9c27fdbf66deaf30b2b',{mode:'cors'}).then(data=>data.json()).then(data=>
  {
    data = data.stores.filter(function(item){
      return(item.id == req.params.store_id)
    })
    res.json(data)
  }
  ) 
});

app.get("/api_coupon", async(req, res) => {
  await fetch('https://inrdeals.com/api/v1/coupon-feed?token=65382fdc6fc8ecff5b74f0d88c6e09741ef44d62&id=dee542885700',{mode:'cors'}).then(data=>data.json()).then(data=>res.json(data)) 
});

app.post("/get_api_data", async(req, res) => {
  await fetch(req.body.url,{mode:'cors'}).then(data=>data.json()).then(data=>res.json(data)) 
});

app.get("/transaction_report", async(req, res) => {
  let currentDate1 = new Date()
  let oldDate1 = new Date()
  oldDate1.setMonth(oldDate1.getMonth()-3);
  let currentDate = currentDate1.toISOString().split('T')[0]
  let oldDate = oldDate1.toISOString().split('T')[0]
  await fetch(`https://inrdeals.com/fetch/reports?token=198f2053cbdcb7c0f83aae0409c2a0b4cf8ea0ff&id=dee542885700&startdate=${oldDate}&enddate=${currentDate}&txn_id=884780`,{mode:'cors'}).then(data=>data.json()).then(data=>res.json(data)) 
});
//Notfound
app.use((req,res,next)=>{
 res.status(404).send(
   {
     status:404,
     error:"not found"
   }
 ) 
})
app.listen(PORT,(err)=>{
    if(err) throw err
    console.log(`WORK ON PORT ${PORT}`)
})