
const jwt = require('jsonwebtoken')
async function verifyToken(req , res , next ){
    try{
      const tokenHeader = req.headers.authorization;
      if(!tokenHeader)
      return res.status(401).json({"message":"Token not found"});
      const token = tokenHeader.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
      if(!verifiedToken)
        return res.status(401).json({ "message":"invalid token"})
      res.locals.auth = verifiedToken;
      // return(res.locals.auth)
      next()
    }catch(err){
      console.log(err)
      let responseBody = {
        timeSamp: new Date(), 
        errMsg: err
    }
     res.send(responseBody)
    }
  }
  module.exports = verifyToken