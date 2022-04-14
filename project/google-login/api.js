const express = require('express')
const app = express()
const request = require('request') 
const mysql = require('mysql2')
const passport = require('passport');
let user
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const con =  mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'youtube',
    database: 'student',
})
con.connect((err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('성길이 엉덩이는 빨개')
    }
})
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: '880761826027-cb82u5sa0phqnj9sq67lcbftk3omoipq.apps.googleusercontent.com'
    
    
    
    
    ,
    clientSecret: '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',
    callbackURL: "http://localhost:3000/login/google/callback"
},
(accessToken, refreshToken, profile, cb)=>{
    user = profile
    return cb(null, profile)
}
))
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
//const insert = 
// const option = {
    //     'method': 'GET',
    //     'url': 'https://open.neishttps://open.neis.go.kr/hub/mealServiceDietInfo?KEY=e3984170097e46d9ae73fb4ae925bb46&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=T10&SD_SCHUL_CODE=9296071'
    
    // }
// const api = request(option, (err,res)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(res.body)
//     }
// })
app.get('/',(req, res, next)=>{
    res.render('index.ejs')
    console.log(user)

})
app.get('/login',(req, res, next)=>{
    res.render('login.ejs')
})
app.get('/login/google',passport.authenticate('google', { scope: ['profile']}));
app.get('/login/google/callback', passport.authenticate( 'google', { failureRedirect: '/login' }),(req, res, next) => {
    res.redirect('/')
});
app.listen(3000,()=>{
    console.log("백승민 엉덩이는 벌게")
})