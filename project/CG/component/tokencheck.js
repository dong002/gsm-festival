const jwt = require('jsonwebtoken')
module.exports={
    async checktoken(req,res,next){
        if(req.cookies.user === undefined){
            throw Error('이쉑 로그인 안됨 ㅋㅋ루')
        }
        aT = jwt.verify(req.cookies.user);
        if(aT == null){
            res.send('req login')
        }
    }
}