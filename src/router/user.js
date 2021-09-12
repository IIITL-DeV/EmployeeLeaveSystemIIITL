const express = require('express')
const auth = require('../middleware/auth')

const router = new express.Router()

router.get('/user', auth, (req, res) => {
    res.render('user')
})

module.exports = router