const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const con = require('./component/db.js')
const transporter = require('./component/mailsender.js')
require("dotenv").config();
//10.120.74.57
con.connect((err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('디비 연결됬따 뿌붕!')
    }
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', './view')
app.set('view engine', 'ejs')
const insert = "INSERT INTO user (email,school,student_num) VALUES (?,?,?)"
const select = "SELECT pwd FROM user WHERE school_num = ?"
const update = "UPDATE hoho SET pwa = ? WHERE user"
const insert2 = "INSERT INTO book (purpose,name,start_time,end_time,room_num,pwd) VALUES (?,?,?,?,?,?)"
const select2 = "SELECT * FROM book WHERE room_num=?"
app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get('/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.render('login.ejs')
})
app.get('/signup',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.render('signup.ejs')
})
app.get('/find'),(req,res)=>{
    res.render('find.ejs')
}
let signparam;
app.post('/signup',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
        return Math.floor(Math.random() * (max - min)) + min;
    }
    const number = getRandomInt(1111,9999)
    signparam = [req.body.make_mail,req.body.make_id,req.body.make_pw]
    mailoption = {
        from: `"CG Team" <${process.env.NODEMAILER_USER}>`,
        to: req.body.make_mail,
        subject: 'CG Auth Number',
        text: String(number)
    } 
    let info = await transporter.sendMail(mailoption,(err, info)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(info.response)
        }
    });
      res.json({
        email: req.body.make_mail,
        num: number
      })
    // res.redirect('/signup_suc')

    
  
})
app.post('/hihi',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body.email,req.body.school,req.body.student_num);
    res.status(200).json({'message': 'hoho'})  
})
app.get('/signup_suc',(req,res)=>{
    con.query(insert,signparam,(err,rows,field)=>{
        if(err){
            console.log(err)
            res.send('signup fail')
        }
        else{
            res.send('signup success')
        }
    })
})
app.post('/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    con.query(select,req.body.user_id,(err,row,fields)=>{
        if(err){
            console.log(err)
            res.send('login fail')
        }
        else{
            console.log(row[0].pwd)
            console.log(req.body.user_pwd)
            if(req.body.user_pwd === row[0].pwd){
                const param = [req.body.user_id,row.email]

                const accsessToken = jwt.sign(
                    {
                      param
                    },
                    process.env.JWT_SECRETKEY,
                    {
                        expiresIn: "5d",
                        issuer: "dogndogn"
                    }
                )
                const refreshToken = jwt.sign({},
                    process.env.JWT_SECRETKEY,
                    {
                        expiresIn: '14d',
                        issuer: 'dongdong'                    })
                res.cookie("user",accsessToken)
                res.cookie("setter",refreshToken)
                res.send('로그인 성공')
            }
            else{
                res.send('wrong password')
            }
        }
    })
})
let findparam;
app.patch('/find',async(req,res)=>{
function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}
findparam = [req.body.user_pwd, req.body.user_id]
const number = getRandomInt(1111,9999)
if(!(req.body.user_pwd === req.body.two_pwd)){
    res.send('이쉑히는 비밀번호도 제대로 못치농')
}
 info = await transporter.sendMail({
    from: `"CG Team" <${process.env.NODEMAILER_USER}>`,
    to: req.body.make_mail,
    subject: 'CG Auth Number',
    text: number
    });
    res.json({
        email: req.body.make_mail,
        num: String(number)
    })
    // res.redirect('/find_suc')
})
app.get('/find_suc',(req,res)=>{
    con.query(update, findparam, (err,row,fields)=>{
        if(err){
            console.log('이쉑히는 바꿔줘도 지랄이노')
        }
        else{
            res.send('find_success')
        }s
    })
})
app.post('/book', (req,res)=>{
    const user = req.body;
    bookparam = [user.purpose, user.name, user.start_time, user.end_time, user.room_num, user.pwd]
    console.log(req.body);
    con.query(insert2,bookparam,(err,rows,field)=>{
        if(err){
            console.log(err)
            res.send('book fail')
        }
        else{
            console.log(req.body)
            res.send('book success')
        }
    })
})
app.post('/book_check', (req,res)=>{
    console.log(req.body)
    room_num = req.body.num
    console.log(room_num)
    con.query(select2,room_num,(err,rows,field)=>{
        if(err){
            console.log(err)
            res.send('0')
        }
        else{
            if(rows.length == 0){
                res.send('0')
            }
            else{
                console.log(rows)
                res.send(rows)
            }
        }
    })


})
app.listen(process.env.APP_PORT,process.env.APP_IP, () => {
    console.log('서버 켜졌따')
})
