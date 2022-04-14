const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs');
let db;
MongoClient.connect('mongodb+srv://root:youtube@cluster0.bdokr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(에러, client){
  if (에러) { console.log(에러)}
  else{console.log('두둥등장')}
  db = client.db('todoapp')
  app.listen(3000, function() {
    console.log('승민이 엉덩이 3㎥')
  })
})

//여기 이하는 쓸데없는 app.get 이런 코드들

app.get('/', function(요청, 응답) { 
  응답.render('i.ejs')
})
app.get('/write',(req,res)=>{
  
  db.collection('post').find().toArray((err,result)=>{
    //console.log(result)
    res.render('write.ejs', { posts : result })
  })
})
app.post('/write',(req,res)=>{
    db.collection('counter').findOne({name : "postnum"}, (err,result)=>{
    const totalpost = result.totalPost
      db.collection('post').insertOne({id : totalpost + 1, title : req.body.title, date : req.body.date},(err,res)=>{
        console.log('성길이 야추 3M')
        db.collection('counter').updateOne({name:"postnum"},{$inc : {totalPost:1}},(err)=>{
          if(err){
            console.log(err)
          }
        })
      })
    });  
  console.log(req.body)
  res.redirect('/write')
})
app.delete('/delete',(req,res)=>{
    const pid = parseInt(req.body._id)
    console.log(pid) 
    db.collection('post').deleteOne({id : pid}, (err,res)=>{

    })
})


