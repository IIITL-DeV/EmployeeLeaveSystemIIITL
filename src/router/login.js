const express = require('express')
const User = require('../models/user')
const unauth = require('../middleware/unauth')

const router = new express.Router()

router.get('/login', unauth, (req, res) => {
    res.render('login', {error: req.query.error, auth: req.query.auth, type: 'user'})
})

router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.redirect('/')
    } catch (e) {
        res.redirect('/login?error=1')
    }
    
})

module.exports = router