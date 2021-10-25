const express = require('express')
const auth = require('../middleware/auth')
const Leave = require('../models/leave')
const moment = require('moment')

const router = new express.Router()

router.get('/leave', auth, async (req, res) => {
    var pending = await Leave.find({userID: req.user._id, status: "pending"})

    pending.forEach(async (e) => {
        var cur = moment().unix()
        var start = e.startTimeYear + '-' + e.startTimeMonth + '-' + e.startTimeDay + " 00:00+05:30"
        start = moment(start, "YYYY-MM-DD hh:mm")
        start = moment(start).unix()

        // console.log(moment(start*1000).format())

        start = start/(60*60*24)
        cur = cur/(60*60*24)

        if(start<cur) {
            e.status = "reject"
            e.comments = "Admin was unable to respond in Time"
            await e.save()  
        }
    })

    pending = await Leave.find({status: 'pending'})

    res.render('leave', {pending, leavesLeft: req.user.leavesLeft})
})

router.post('/leave', auth, async (req, res) => {

    const leave = new Leave({
        userID: req.user._id,
        name: req.user.name,
        post: req.user.post,
        startTimeYear: parseInt(req.body.startDate.split("-")[0]),
        startTimeMonth: parseInt(req.body.startDate.split("-")[1]),
        startTimeDay: parseInt(req.body.startDate.split("-")[2]),
        endTimeYear: parseInt(req.body.endDate.split("-")[0]),
        endTimeMonth: parseInt(req.body.endDate.split("-")[1]),
        endTimeDay: parseInt(req.body.endDate.split("-")[2]),
        reason: req.body.reason,
        status: "pending",
        comment: ""
    })    

    await leave.save()
    res.redirect('/leave')
})

router.get('/leave/delete', auth, async (req, res) => {
    const id = req.query.id
    
    const leave = await Leave.deleteOne({_id: id})

    res.redirect('/leave')
})

module.exports = router