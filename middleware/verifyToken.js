const jsonwebtoken = require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('Authorization')
    if(!token) {
        return res.status(401).send({message:'Access denied'})
    }

    try {
        const verified = jsonwebtoken.verify(token,process.env.TOKEN_SECRET)
        res.user = verified
        next()
    } catch (error) {
        return res.status(401).send({message:'Invalid token'})
    }
}

module.exports = auth