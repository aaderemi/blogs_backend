const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/', async(req, res)=>{
    const body = req.body

    const retUser = await User.findOne({username:body.username})


    const passwordCorrect = retUser === null ? false:await bcrypt.compare(body.password, retUser.passwordHash)

    if(passwordCorrect){

        const toBeSigned = {
            username: retUser.username,
            id: retUser._id
        }
        const token = jwt.sign(toBeSigned, process.env.SECRET)

        return res.json({token, username: retUser.username, name: retUser.name})
    }else{
        return res.status(400).json({error:'incorrect username or password'})
    }

})

module.exports = router