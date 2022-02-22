const express = require('express')
const router = express.Router()
const { ensureAuth, checkCurrentUser } = require('../middleware/auth')

router.get('/', ensureAuth, checkCurrentUser, (req, res)=>{
    res.render('smoothies')
})


module.exports = router