
import express from 'express';
import fs from 'fs';
import cors from 'cors';
import fetch from 'node-fetch';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended:true
}));

app.use('/images',express.static('uploads'));

app.get('/',(req,res)=>{
  res.json({data:'apiData data'});
})

app.get('/names',(req,res)=>{
  const data=fs.readFileSync('./thing.json');
    res.json( JSON.parse(data));
})

app.get("/api", async(req, res) => {
  await fetch('https://inrdeals.com/fetch/stores?id=dee542885700&token=1e17a6fe633f7fd3b461e9c27fdbf66deaf30b2b',{mode:'cors'}).then(data=>data.json()).then(data=>res.json(data)) 
});

app.get("/api_coupon", async(req, res) => {
  await fetch('https://inrdeals.com/api/v1/coupon-feed?token=65382fdc6fc8ecff5b74f0d88c6e09741ef44d62&id=dee542885700',{mode:'cors'}).then(data=>data.json()).then(data=>res.json(data)) 
});

app.listen(3000,()=>{
    console.log(`server run at port 3000`);
})