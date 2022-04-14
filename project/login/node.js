const mysql = require('mysql2')
const express = require('express')
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')   
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB,
})
con.connect((err)=>{
    if(err){
        console.log(err)
    } else {
        console.log('연결됬다 멍')
    }

});
const insert = "INSERT INTO hoho (user,pwd) VALUES (?,?)"
const select = "SELECT pwd FROM hoho WHERE user = ?"

app.use(cookieParser());
app.set('views', './views')
app.set('view engine', 'ejs')
// const signup_Suc = (req,res,next) => { 
//    fs.readFile('./node_web/loading.html','utf-8',(err,data)=>{
//         if(err){
//             console.log(err)
//         }else{
//             res.writeHead(200)
//             res.end(data)
//         }
//     })
//     next();
// }
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    //const a = Buffer.from(req.cookie.id, "base64").toString('utf8')
    console.log(req.cookies.user)
    jwt.verify(req.cookies.user, process.env.SECRET_KEY, (err, token) => {
        if(err){throw err}
        if(req.cookies === undefined){res.send('nologin')}
        console.log(token);
    })
    res.render('index.ejs');
})
app.get('/login',(req,res)=>{
    res.render('login.ejs')
})
app.get('/login_suc',(req,res)=>{
    res.render('login_suc.ejs',{dong: '로그인'});
})
app.get('/signup_suc', (req,res)=>{    
    res.render('loading.ejs',{dong: '회원가입'})
})
app.get('/signup', (req,res)=>{
    res.render('signup.ejs')
})
app.post('/signup',(req,res)=>{
    const user = req.body
    console.log(user)
    const param = [user.make_id,user.make_pw]
    con.query(insert,param,(err,rows,fields)=>{
        if(err){
            console.log(err)
            res.redirect('/signup')
        }else{
            res.redirect('/signup_suc')
        }
    })
})
app.post('/login',async(req,res)=>{
    const id = req.body.user_id;
    const password= req.body.user_pwd;

    con.query(select, id, async (err, rows, _fields) => {
        if (err) {
            console.log(err);
            res.send('ni ami')
        }
        else {
            console.log(rows);
            if(rows[0].pwd == password){
                const accessToken = jwt.sign(
                    {
                        id,      
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "1h",
                    }
                );
                res.cookie("user", accessToken);
                // res.status(201).json({
                //     result: "OK",
                //     accessToken,
                // })
                res.redirect('/login_suc')
            } 
            else {
                res.redirect('/login')
            }
        }
    })
    // let a = await check(info.user_id,info.user_pwd)
    // console.log(check(info.user_id));
    // if(check(info.user_id) == info.user_pwd){
    //     res.redirect('/suc')
    // }
    // else{
    //     res.redirect('/login')
    // }
    
})
app.listen(process.env.APP_PORT,()=>{
    console.log("서버에 연결되었따 뿌우웅")
})