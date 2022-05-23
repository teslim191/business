const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = {
    ensureAuth: (req, res, next) => {
        const token = req.cookies.jwt
        // check if token exists
        if (token) {
            // if token exist verify token
            jwt.verify(token, process.env.TOKEN, (err, decodedToken) => {
                if (err) {
                    console.log(err)
                    res.redirect('/login')
                }else{
                    // the decoded token has the payload which contains the userid
                    console.log(decodedToken)
                    next()
                }
            })
        }else{
            
            res.redirect('/login')
        }
    },

    checkCurrentUser: (req, res, next) =>{
        // get token
        const token = req.cookies.jwt
        // check if token exist
        if (token) {
        // verify token
        jwt.verify(token,process.env.TOKEN, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null
                next()
            }else{
                // if token exist, get the id of the user from the decodedToken
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id).lean()
                // we want to be able to use the user globally
                res.locals.user = user
                next()
            }
        })
        }else{
            res.locals.user = null
            next()

        }

    }
}