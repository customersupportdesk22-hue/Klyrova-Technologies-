'use strict';
const express = require('express');
const helmet = require('helmet');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'klyrova';
const ADMIN_TOKEN = process.env.REVIEW_ADMIN_TOKEN;
const EMAIL_TO = process.env.REVIEW_NOTIFICATION_EMAIL || 'bahzuri60@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;
const COMMAND_CENTRE_ADMIN_TOKEN = process.env.COMMAND_CENTRE_ADMIN_TOKEN;

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '20kb' }));
app.use((req,res,next)=>{ if(['/server.js','/package.json','/.env.example'].includes(req.path)) return res.sendStatus(404); next(); });
app.use(express.static(path.join(__dirname), { index: 'index.html' }));

let reviews;
let mongoClient;
const attempts = new Map();
const allowedCountries = new Map([
  ['Kenya','+254'],['United States','+1'],['United Kingdom','+44'],['Canada','+1'],
  ['Australia','+61'],['United Arab Emirates','+971'],['South Africa','+27'],
  ['Nigeria','+234'],['Germany','+49'],['India','+91']
]);
function rateLimit(req,res,next){
  const key=req.ip;
  const now=Date.now();
  const current=attempts.get(key);
  if(current && now-current.started<60*60*1000 && current.count>=5) return res.status(429).json({error:'Too many submissions. Please try again later.'});
  if(!current || now-current.started>=60*60*1000) attempts.set(key,{started:now,count:1});
  else current.count++;
  next();
}
function commandCentreOnly(req,res,next){
  if(!COMMAND_CENTRE_ADMIN_TOKEN) return res.status(503).json({error:'Command Centre access is not configured yet.'});
  const supplied=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  const expectedBuffer=Buffer.from(COMMAND_CENTRE_ADMIN_TOKEN);
  const suppliedBuffer=Buffer.from(supplied);
  if(!supplied || suppliedBuffer.length!==expectedBuffer.length || !crypto.timingSafeEqual(suppliedBuffer,expectedBuffer)) {
    return res.status(401).json({error:'Command Centre access denied.'});
  }
  next();
}
function adminOnly(req,res,next){
  if(!ADMIN_TOKEN) return res.status(503).json({error:'Admin review access is not configured yet.'});
  const supplied=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  if(!supplied || supplied.length!==ADMIN_TOKEN.length || supplied!==ADMIN_TOKEN) return res.status(401).json({error:'Admin access denied.'});
  next();
}
async function sendNotification(review){
  if(!RESEND_API_KEY || !RESEND_FROM) return;
  const textBody=[
    'A new Klyrova customer review is awaiting approval.',
    '',
    'Name: '+review.name,
    'Email: '+review.email,
    'Country: '+review.country,
    'Dial code: '+review.dialCode,
    'Phone: '+review.phone,
    'Rating: '+review.rating,
    '',
    'Review:',
    review.review,
    '',
    'Open the Klyrova review admin page to approve or reject it.'
  ].join('\n');
  const response=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{'Authorization':'Bearer '+RESEND_API_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({from:RESEND_FROM,to:[EMAIL_TO],subject:'New Klyrova customer review awaiting approval',text:textBody})
  });
  if(!response.ok) throw new Error('Review notification email failed: '+response.status);
}
app.get('/api/admin/system-health',commandCentreOnly,async(req,res)=>{
  let databaseStatus='connected';
  try {
    await mongoClient.db(DB_NAME).command({ping:1});
  } catch(error) {
    databaseStatus='unavailable';
    console.error('Command Centre database health check failed:',error.message);
  }
  const memory=process.memoryUsage();
  res.json({
    ok:databaseStatus==='connected',
    service:'Klyrova Technologies',
    application:{status:'running',uptimeSeconds:Math.floor(process.uptime()),nodeVersion:process.version},
    database:{status:databaseStatus},
    memory:{rssMb:Math.round(memory.rss/1024/1024),heapUsedMb:Math.round(memory.heapUsed/1024/1024)},
    checkedAt:new Date().toISOString()
  });
});
app.get('/api/health',(req,res)=>res.json({ok:true,service:'Klyrova review service'}));
app.post('/api/reviews',rateLimit,async(req,res)=>{
  try{
    const {name,email,country,dialCode,phone,rating,review,publicationPermission}=req.body||{};
    if(typeof name!=='string'||name.trim().length<2||name.length>80) return res.status(400).json({error:'Please enter your name.'});
    if(typeof email!=='string'||email.length>120||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Please enter a valid email address.'});
    if(!allowedCountries.has(country)) return res.status(400).json({error:'Please choose one of the listed countries.'});
    if(dialCode!==allowedCountries.get(country)) return res.status(400).json({error:'The country dialing code does not match your selected country.'});
    if(typeof phone!=='string'||phone.replace(/[\s()+.-]/g,'').length<5||phone.length>24) return res.status(400).json({error:'Please enter a valid phone number.'});
    const score=Number(String(rating).match(/^[1-5]/)?.[0]);
    if(!Number.isInteger(score)||score<1||score>5) return res.status(400).json({error:'Please choose a rating.'});
    if(typeof review!=='string'||review.trim().length<8||review.length>1200) return res.status(400).json({error:'Please write a little more about your experience.'});
    if(publicationPermission!==true) return res.status(400).json({error:'Please confirm your review publication permission.'});
    const doc={name:name.trim(),email:email.trim(),country,dialCode,phone:phone.trim(),rating:score,review:review.trim(),publicationPermission:true,status:'pending',createdAt:new Date(),approvedAt:null};
    const result=await reviews.insertOne(doc);
    try{await sendNotification(doc);}catch(error){console.error(error.message);}
    res.status(201).json({ok:true,id:String(result.insertedId),message:'Your review has been received and is awaiting approval.'});
  }catch(error){console.error(error);res.status(500).json({error:'Unable to submit your review right now.'});}
});
app.get('/api/reviews',async(req,res)=>{
  try{
    const docs=await reviews.find({status:'approved'},{projection:{name:1,country:1,rating:1,review:1,approvedAt:1}}).sort({approvedAt:-1}).limit(30).toArray();
    res.json(docs.map(doc=>({displayName:doc.name,country:doc.country,rating:doc.rating,review:doc.review,approvedAt:doc.approvedAt})));
  }catch(error){console.error(error);res.status(500).json({error:'Unable to load reviews.'});}
});
app.get('/api/admin/reviews',adminOnly,async(req,res)=>{
  try{
    const status=['pending','approved','rejected'].includes(req.query.status)?req.query.status:null;
    const filter=status?{status}:{};
    const docs=await reviews.find(filter,{projection:{name:1,email:1,country:1,dialCode:1,phone:1,rating:1,review:1,status:1,createdAt:1,approvedAt:1}}).sort({createdAt:-1}).limit(100).toArray();
    res.json(docs.map(doc=>({...doc,_id:String(doc._id)})));
  }catch(error){console.error(error);res.status(500).json({error:'Unable to load review records.'});}
});
app.patch('/api/admin/reviews/:id',adminOnly,async(req,res)=>{
  try{
    const {status}=req.body||{};
    if(!['approved','rejected'].includes(status)) return res.status(400).json({error:'Choose approve or reject.'});
    if(!ObjectId.isValid(req.params.id)) return res.status(400).json({error:'Invalid review ID.'});
    const update={status,updatedAt:new Date()};
    if(status==='approved') update.approvedAt=new Date();
    else update.approvedAt=null;
    const result=await reviews.updateOne({_id:new ObjectId(req.params.id)},{$set:update});
    if(!result.matchedCount) return res.status(404).json({error:'Review not found.'});
    res.json({ok:true,status});
  }catch(error){console.error(error);res.status(500).json({error:'Unable to update this review.'});}
});
app.delete('/api/admin/reviews/:id',adminOnly,async(req,res)=>{
  try{
    if(!ObjectId.isValid(req.params.id)) return res.status(400).json({error:'Invalid review ID.'});
    const result=await reviews.deleteOne({_id:new ObjectId(req.params.id)});
    if(!result.deletedCount) return res.status(404).json({error:'Review not found.'});
    res.json({ok:true});
  }catch(error){console.error(error);res.status(500).json({error:'Unable to delete this review.'});}
});
async function start(){
  if(!MONGODB_URI){console.error('MONGODB_URI is required.');process.exit(1);}
  mongoClient=new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  const db=mongoClient.db(DB_NAME);
  reviews=db.collection('customer_reviews');
  await reviews.createIndex({status:1,approvedAt:-1});
  await reviews.createIndex({createdAt:-1});
  app.listen(PORT,'0.0.0.0',()=>console.log('Klyrova review service listening on '+PORT));
}
start().catch(error=>{console.error('Startup failed:',error);process.exit(1);});
process.on('SIGTERM',async()=>{if(mongoClient) await mongoClient.close();process.exit(0);});
